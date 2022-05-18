using Microsoft.AspNetCore.Mvc;
using CoopDocs.Database.EntityModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using CoopDocs.ViewModels;
using CoopDocs.Database;
using CoopDocs.Helpers;
using Microsoft.EntityFrameworkCore;

namespace CoopDocs.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class DocumentController : ControllerBase
	{
		private readonly UserManager<User> _userManager;
		private readonly SignInManager<User> _signInManager;

		private readonly ILogger<DocumentController> _logger;

		public DocumentController(IConfiguration configuration, ILogger<DocumentController> logger, UserManager<User> userManager, SignInManager<User> signInManager) : base(configuration)
		{
			_logger = logger;
			_userManager = userManager;
			_signInManager = signInManager;
		}

		[HttpGet]
		[Route("my")]
		public async Task<JsonResult> GetMyDocuments()
		{
			using(var ctx = CreateDataContext())
			{
				var data = ctx.Documents
					.Include(x => x.DocumentPermissions)
					.Where(x => x.DocumentPermissions.Any(x=>x.UserId == AuthorizedUserId && x.PermissionType == (int)PermissionsEnum.Author))
					.AsNoTracking()
					.ToList();

				var viewData = data.Select(x => x.ToViewModel(AuthorizedUserId)).ToList();

				return new JsonResult(viewData);
			}
		}

		[HttpGet]
		[Route("shared")]
		public async Task<JsonResult> GetSharedDocuments()
		{
			using (var ctx = CreateDataContext())
			{
				var data = ctx.Documents.AsNoTracking()
					.Include(x => x.DocumentPermissions)
					.Where(x => x.DocumentPermissions.Any(x => x.UserId == AuthorizedUserId && x.PermissionType != 1))
					.ToList();

				var viewData = data.Select(x => x.ToViewModel(AuthorizedUserId)).ToList();

				return new JsonResult(viewData);
			}
		}
	}
}