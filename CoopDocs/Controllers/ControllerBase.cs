using CoopDocs.Database.EntityModels;
using CoopDocs.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace CoopDocs.Controllers
{
    public abstract class ControllerBase : Controller
    {
        public IConfiguration Configuration { get; }
        public string AuthorizedUserId => User.GetUserId();

        public ControllerBase(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected dbContext CreateDataContext()
        {
            return new dbContext(Configuration.GetConnectionString("Database"));
        }
    }
}
