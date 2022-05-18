using System;
using System.Collections.Generic;

namespace CoopDocs.Database.EntityModels
{
    public partial class Document
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Content { get; set; } = null!;

        public ICollection<Permission> Permissions { get; set; }
        public ICollection<DocumentPermission> DocumentPermissions { get; set; }
    }
}
