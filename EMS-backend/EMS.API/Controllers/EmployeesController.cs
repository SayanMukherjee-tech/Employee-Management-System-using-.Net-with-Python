using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeesController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<EmployeeDto>>> GetEmployees(
            [FromQuery] string? search,
            [FromQuery] string? department,
            [FromQuery] string? status,
            [FromQuery] string? sortBy = "name",
            [FromQuery] string? sortDir = "asc",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _employeeService.GetEmployeesAsync(search, department, status, sortBy, sortDir, page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployee(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardSummaryDto>> GetDashboard()
        {
            var summary = await _employeeService.GetDashboardSummaryAsync();
            return Ok(summary);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeDto>> CreateEmployee(CreateEmployeeDto dto)
        {
            try
            {
                var employee = await _employeeService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Unique") || ex.InnerException?.Message.Contains("Unique") == true)
                {
                    return Conflict(new { message = "Email already exists" });
                }
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee(int id, UpdateEmployeeDto dto)
        {
            try
            {
                await _employeeService.UpdateAsync(id, dto);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Unique") || ex.InnerException?.Message.Contains("Unique") == true)
                {
                    return Conflict(new { message = "Email already exists" });
                }
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            await _employeeService.DeleteAsync(id);
            return Ok();
        }
    }
}
