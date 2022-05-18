using CoopDocs.Database.EntityModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using CoopDocs.Hubs;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;

services.AddControllersWithViews()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
services.AddDbContext<dbContext>(options =>
				options.UseNpgsql(builder.Configuration.GetConnectionString("Database"))).AddLogging();
services.AddIdentity<User, IdentityRole>(options =>
{
}).AddEntityFrameworkStores<dbContext>();

services.AddSignalR();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllerRoute(
	name: "default",
	pattern: "{controller}/{action=Index}/{id?}");

app.MapHub<DocHub>("/hubs/doc");

app.MapFallbackToFile("index.html"); ;

app.Run();
