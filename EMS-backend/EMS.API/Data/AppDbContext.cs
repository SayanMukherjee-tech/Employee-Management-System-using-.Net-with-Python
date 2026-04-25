using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<AppUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Roles/Users
            var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            var viewerPasswordHash = BCrypt.Net.BCrypt.HashPassword("viewer123");

            modelBuilder.Entity<AppUser>().HasData(
                new AppUser { Id = 1, Username = "admin", PasswordHash = adminPasswordHash, Role = "Admin", CreatedAt = DateTime.UtcNow },
                new AppUser { Id = 2, Username = "viewer", PasswordHash = viewerPasswordHash, Role = "Viewer", CreatedAt = DateTime.UtcNow }
            );

            // Seed 15 Employees
            modelBuilder.Entity<Employee>().HasData(
                new Employee { Id = 1, FirstName = "Pooja", LastName = "Ghosh", Email = "pooja.ghosh@XYZ.com", Phone = "9876543210", Department = "Engineering", Role = "DevOps Engineer", Salary = 750000, JoinDate = DateTime.Parse("2022-06-15"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 2, FirstName = "Amit", LastName = "Joshi", Email = "amit.joshi@XYZ.com", Phone = "9876543211", Department = "Operations", Role = "Supply Chain Analyst", Salary = 600000, JoinDate = DateTime.Parse("2023-01-10"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 3, FirstName = "Lakshmi", LastName = "Chandran", Email = "lakshmi.chandran@XYZ.com", Phone = "9876543212", Department = "Marketing", Role = "Brand Manager", Salary = 850000, JoinDate = DateTime.Parse("2021-11-20"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 4, FirstName = "Suresh", LastName = "Babu", Email = "suresh.babu@XYZ.com", Phone = "9876543213", Department = "Finance", Role = "Tax Consultant", Salary = 700000, JoinDate = DateTime.Parse("2022-03-05"), Status = "Inactive", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 5, FirstName = "Meera", LastName = "Krishnan", Email = "meera.krishnan@XYZ.com", Phone = "9876543214", Department = "Engineering", Role = "QA Engineer", Salary = 650000, JoinDate = DateTime.Parse("2023-05-12"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 6, FirstName = "Rahul", LastName = "Sharma", Email = "rahul.sharma@XYZ.com", Phone = "9876543215", Department = "HR", Role = "HR Executive", Salary = 500000, JoinDate = DateTime.Parse("2023-08-01"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 7, FirstName = "Vikram", LastName = "Singh", Email = "vikram.singh@XYZ.com", Phone = "9876543216", Department = "Engineering", Role = "Software Engineer", Salary = 900000, JoinDate = DateTime.Parse("2021-02-15"), Status = "Inactive", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 8, FirstName = "Neha", LastName = "Gupta", Email = "neha.gupta@XYZ.com", Phone = "9876543217", Department = "Finance", Role = "Financial Analyst", Salary = 720000, JoinDate = DateTime.Parse("2022-09-10"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 9, FirstName = "Anjali", LastName = "Desai", Email = "anjali.desai@XYZ.com", Phone = "9876543218", Department = "Marketing", Role = "SEO Specialist", Salary = 550000, JoinDate = DateTime.Parse("2023-04-18"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 10, FirstName = "Karan", LastName = "Patel", Email = "karan.patel@XYZ.com", Phone = "9876543219", Department = "Operations", Role = "Operations Manager", Salary = 950000, JoinDate = DateTime.Parse("2020-10-05"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 11, FirstName = "Riya", LastName = "Sen", Email = "riya.sen@XYZ.com", Phone = "9876543220", Department = "HR", Role = "Talent Acquisition", Salary = 680000, JoinDate = DateTime.Parse("2021-07-22"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 12, FirstName = "Rohit", LastName = "Verma", Email = "rohit.verma@XYZ.com", Phone = "9876543221", Department = "Engineering", Role = "Tech Lead", Salary = 1200000, JoinDate = DateTime.Parse("2019-11-15"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 13, FirstName = "Sneha", LastName = "Reddy", Email = "sneha.reddy@XYZ.com", Phone = "9876543222", Department = "Marketing", Role = "Content Strategist", Salary = 600000, JoinDate = DateTime.Parse("2022-12-01"), Status = "Inactive", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 14, FirstName = "Arjun", LastName = "Nair", Email = "arjun.nair@XYZ.com", Phone = "9876543223", Department = "Finance", Role = "Accountant", Salary = 500000, JoinDate = DateTime.Parse("2023-02-14"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 15, FirstName = "Priya", LastName = "Menon", Email = "priya.menon@XYZ.com", Phone = "9876543224", Department = "Operations", Role = "Logistics Coordinator", Salary = 450000, JoinDate = DateTime.Parse("2023-07-10"), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            // Configure Email as unique
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Username)
                .IsUnique();
        }
    }
}
