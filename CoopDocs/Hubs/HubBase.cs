using CoopDocs.Database.EntityModels;
using Microsoft.AspNetCore.SignalR;
using CoopDocs.Helpers;

namespace CoopDocs.Hubs
{
    public abstract class HubBase : Hub
    {
        public IConfiguration Configuration { get; }
        public string AuthorizedUserId => Context.User.GetUserId();

        public HubBase(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected dbContext CreateDataContext()
        {
            return new dbContext(Configuration.GetConnectionString("Database"));
        }
    }
}
