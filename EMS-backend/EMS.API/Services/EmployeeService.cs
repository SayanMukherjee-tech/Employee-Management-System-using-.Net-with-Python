using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _repository;

        public EmployeeService(IEmployeeRepository repository)
        {
            _repository = repository;
        }

        public async Task<PagedResult<EmployeeDto>> GetEmployeesAsync(string? search, string? department, string? status, string? sortBy, string? sortDirection, int page, int pageSize)
        {
            var query = await _repository.GetQueryableAsync();

            // 1. Filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(e => e.FirstName.ToLower().Contains(lowerSearch) || 
                                         e.LastName.ToLower().Contains(lowerSearch) || 
                                         e.Email.ToLower().Contains(lowerSearch));
            }

            if (!string.IsNullOrWhiteSpace(department) && department != "All Departments")
            {
                query = query.Where(e => e.Department == department);
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                query = query.Where(e => e.Status == status);
            }

            // 2. Sort
            bool isDesc = sortDirection?.ToLower() == "desc";
            query = sortBy?.ToLower() switch
            {
                "name" => isDesc ? query.OrderByDescending(e => e.FirstName).ThenByDescending(e => e.LastName) : query.OrderBy(e => e.FirstName).ThenBy(e => e.LastName),
                "department" => isDesc ? query.OrderByDescending(e => e.Department) : query.OrderBy(e => e.Department),
                "status" => isDesc ? query.OrderByDescending(e => e.Status) : query.OrderBy(e => e.Status),
                _ => isDesc ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id)
            };

            // 3. Count total items
            int totalCount = await query.CountAsync();

            // 4. Paginate
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            // Map to DTO
            var dtos = items.Select(e => new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Department = e.Department,
                Role = e.Role,
                Status = e.Status,
                JoinDate = e.JoinDate,
                Phone = e.Phone,
                Salary = e.Salary
            });

            return new PagedResult<EmployeeDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var query = await _repository.GetQueryableAsync();
            var allEmployees = await query.ToListAsync();

            var recentEmployees = allEmployees
                .OrderByDescending(e => e.CreatedAt) // Changed from JoinDate to CreatedAt as per instructions
                .Take(5)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    Email = e.Email,
                    Department = e.Department,
                    Role = e.Role,
                    Status = e.Status,
                    JoinDate = e.JoinDate,
                    Phone = e.Phone,
                    Salary = e.Salary
                })
                .ToList();

            return new DashboardSummaryDto
            {
                TotalEmployees = allEmployees.Count,
                ActiveEmployees = allEmployees.Count(e => e.Status == "Active"),
                OnLeaveEmployees = allEmployees.Count(e => e.Status == "Inactive"), // Changed from "On Leave" to "Inactive"
                DepartmentBreakdown = allEmployees
                    .GroupBy(e => e.Department)
                    .ToDictionary(g => g.Key, g => g.Count()),
                RecentEmployees = recentEmployees
            };
        }

        public async Task<EmployeeDto?> GetByIdAsync(int id)
        {
            var e = await _repository.GetByIdAsync(id);
            if (e == null) return null;

            return new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Department = e.Department,
                Role = e.Role,
                Status = e.Status,
                JoinDate = e.JoinDate,
                Phone = e.Phone,
                Salary = e.Salary
            };
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
        {
            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Department = dto.Department,
                Role = dto.Role,
                Status = dto.Status,
                JoinDate = dto.JoinDate,
                Phone = dto.Phone,
                Salary = dto.Salary,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var added = await _repository.AddAsync(employee);
            return new EmployeeDto
            {
                Id = added.Id,
                FirstName = added.FirstName,
                LastName = added.LastName,
                Email = added.Email,
                Department = added.Department,
                Role = added.Role,
                Status = added.Status,
                JoinDate = added.JoinDate,
                Phone = added.Phone,
                Salary = added.Salary
            };
        }

        public async Task UpdateAsync(int id, UpdateEmployeeDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return;

            existing.FirstName = dto.FirstName;
            existing.LastName = dto.LastName;
            existing.Email = dto.Email;
            existing.Department = dto.Department;
            existing.Role = dto.Role;
            existing.Status = dto.Status;
            existing.JoinDate = dto.JoinDate;
            existing.Phone = dto.Phone;
            existing.Salary = dto.Salary;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
