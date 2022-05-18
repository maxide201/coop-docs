using CoopDocs.Database.EntityModels;
using CoopDocs.Database;

namespace CoopDocs.ViewModels
{
	public static class ModelConverters
	{
		public static DocumentViewModel ToViewModel(this Document entity, string userId)
		{
			if (entity == null)
				return null;

			var tet = entity.DocumentPermissions.FirstOrDefault(x => x.UserId == userId);

			var viewModel = new DocumentViewModel()
			{
				Id = entity.Id,
				Content = entity.Content,
				Name = entity.Name,
				Permission = entity.DocumentPermissions.FirstOrDefault(x=>x.UserId == userId).PermissionType
			};

			return viewModel;
		}
	}
}
