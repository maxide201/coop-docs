using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using CoopDocs.Helpers;
using Microsoft.EntityFrameworkCore;
using CoopDocs.ViewModels;
using CoopDocs.Database;
using Microsoft.AspNetCore.Identity;
using CoopDocs.Database.EntityModels;
using Newtonsoft.Json;

namespace CoopDocs.Hubs
{
    public class DocHub : HubBase
    {

		private readonly UserManager<User> _userManager;
		private static readonly Dictionary<string, string> _groups = new Dictionary<string, string>();
		public DocHub(IConfiguration configuration, UserManager<User> userManager) : base(configuration)
		{ 
			_userManager = userManager;
		}

		public async override Task OnDisconnectedAsync(Exception? exception)
		{
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, _groups[Context.ConnectionId]);
			if(_groups.ContainsKey(Context.ConnectionId))
				_groups.Remove(Context.ConnectionId);
			await base.OnDisconnectedAsync(exception);
		}

		public async Task OpenDocument(string document_id)
		{
			int id = 0;
			bool parsed = Int32.TryParse(document_id, out id);
			if (parsed)
			{
				using (var ctx = CreateDataContext())
				{
					var data = ctx.Documents
						.Include(x => x.DocumentPermissions)
						.Where(x => x.Id == id && x.DocumentPermissions.Any(x => x.UserId == AuthorizedUserId))
						.AsNoTracking()
						.FirstOrDefault();

					if (data != null)
					{
						var viewData = data.ToViewModel(AuthorizedUserId);
						_groups[Context.ConnectionId] = data.Id.ToString();
						await Groups.AddToGroupAsync(Context.ConnectionId, data.Id.ToString());
						await Clients.Caller.SendAsync("document", viewData);
						return;
					}
				}
			}

			await Clients.Caller.SendAsync("document", null);
		}

		public async Task SendMyAction(string actionMssage)
		{
			var user = await _userManager.FindByIdAsync(AuthorizedUserId);
			if (user != null)
			{
				await Clients.OthersInGroup(_groups[Context.ConnectionId]).SendAsync("action", actionMssage);
				var action = JsonConvert.DeserializeObject<EditorAction>(actionMssage);
				if (action != null && action.isContentChanged)
				{
					var id = Int32.Parse(_groups[Context.ConnectionId]);
					using (var ctx = CreateDataContext())
					{
						var document = ctx.Documents.Where(x => x.Id == id).FirstOrDefault();
						document.Content = action.content;
						ctx.SaveChanges();
					}
				}
			}
		}
	}
}