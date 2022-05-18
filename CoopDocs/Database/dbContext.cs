using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Diagnostics;

namespace CoopDocs.Database.EntityModels
{
    public partial class dbContext : IdentityDbContext<User>
    {
        private readonly string _connectionString;

        public dbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        public dbContext(DbContextOptions<dbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Document> Documents { get; set; } = null!;
        public virtual DbSet<DocumentPermission> DocumentPermissions { get; set; } = null!;
        public virtual DbSet<Permission> Permissions { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.LogTo(message => Debug.WriteLine(message));
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql(_connectionString);

            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Document>(entity =>
            {
                entity.ToTable("document");

			    entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .UseIdentityAlwaysColumn();

                entity.Property(e => e.Content).HasColumnName("content");

                entity.Property(e => e.Name).HasColumnName("name");


            });
            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("permission");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .UseIdentityAlwaysColumn();

                entity.Property(e => e.Description).HasColumnName("description");
            });

            modelBuilder.Entity<DocumentPermission>(entity =>
            {
                entity.ToTable("document_permission");
                entity.HasKey(e => new {e.DocumentId, e.PermissionType});

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.DocumentId).HasColumnName("document_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.PermissionType).HasColumnName("permission_type");

                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Document)
                    .WithMany(d => d.DocumentPermissions)
                    .HasForeignKey(e => e.DocumentId);

                entity.HasOne(e => e.PermissionTypeNavigation)
                    .WithMany(p => p.DocumentPermissions)
                    .HasForeignKey(e => e.PermissionType);

            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
