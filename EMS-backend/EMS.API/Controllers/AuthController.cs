using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var response = await _authService.LoginAsync(loginDto);

            if (response == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var user = await _authService.RegisterAsync(registerDto);

            if (user == null)
            {
                return Conflict(new { message = "Username already exists" });
            }

            return Ok(new { message = "User registered successfully" });
        }
    }
}
