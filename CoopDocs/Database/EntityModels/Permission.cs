using System;
using System.Collections.Generic;

namespace CoopDocs.Database.EntityModels
{
    public partial class Permission
    {
        public int Id { get; set; }
        public string Description { get; set; } = null!;


        public ICollection<Document> Documents { get; set; }
        public ICollection<DocumentPermission> DocumentPermissions { get; set; }
    }
}
