using System.Security.Claims;

namespace CoopDocs.Helpers
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }
            var claim = principal.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? claim.Value : null;
        }
    }
}
