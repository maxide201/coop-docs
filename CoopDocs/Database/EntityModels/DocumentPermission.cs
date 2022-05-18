using System;
using System.Collections.Generic;

namespace CoopDocs.Database.EntityModels
{
    public partial class DocumentPermission
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public int DocumentId { get; set; }
        public int PermissionType { get; set; }

        public virtual Document Document { get; set; } = null!;
        public virtual Permission PermissionTypeNavigation { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
