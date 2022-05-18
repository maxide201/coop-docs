using Microsoft.AspNetCore.Mvc;
using CoopDocs.Database.EntityModels;
using Microsoft.AspNetCore.Identity;

namespace CoopDocs.Controllers
{

	public class AccountViewModel
	{
		public string? Login { get; set; }
		public string? Password { get; set; }
	}
	[ApiController]
	[Route("api/[controller]")]
	public class AccountController : ControllerBase
	{
		private readonly UserManager<User> _userManager;
		private readonly SignInManager<User> _signInManager;

		private readonly ILogger<AccountController> _logger;

		public AccountController(IConfiguration configuration, ILogger<AccountController> logger, UserManager<User> userManager, SignInManager<User> signInManager) :  base(configuration)
		{
			_logger = logger;
			_userManager = userManager;
			_signInManager = signInManager;
		}

		[HttpPost]
		[Route("signup")]
		public async Task<object> SignUp(AccountViewModel loginData)
		{

			var user = new User
			{
				UserName = loginData.Login,
			};
			var result = await _userManager.CreateAsync(user, loginData.Password);

			if (result.Succeeded)
			{
				await _signInManager.PasswordSignInAsync(loginData.Login, loginData.Password, true, false);
			}
			return 1;

		}

		[HttpPost]
		[Route("signin")]
		public async Task<object> SignIn(AccountViewModel loginData)
		{
			await _signInManager.PasswordSignInAsync(loginData.Login, loginData.Password, true, false);

			return 1;
		}

		[HttpGet]
		[Route("signout")]
		public async Task<string> SignOutFromApp()
		{
			await _signInManager.SignOutAsync();

			return "Sign OUT";
		}

		[HttpGet]
		[Route("info")]
		public async Task<bool> Info()
		{
			var a = User.Identity.IsAuthenticated;
			return a;
		}
	}
}