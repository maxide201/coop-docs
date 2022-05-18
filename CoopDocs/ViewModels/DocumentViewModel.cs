using CoopDocs.Database;

namespace CoopDocs.ViewModels
{
	public class DocumentViewModel
	{
		public int Id { get; set; }
		public string Name { get; set; } = null!;
		public string Content { get; set; } = null!;
		public int Permission { get; set; }
	}
}
