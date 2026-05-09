using Moq;
using NUnit.Framework;
using EMS.API.Services;
using EMS.API.Models;
using EMS.API.DTOs;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EMS.API.Data;

namespace EMS.Tests.Services
{
    [TestFixture]
    public class AuthServiceTests
    {
        private AppDbContext _db;
        private Mock<IConfiguration> _configMock;
        private AuthService _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "AuthTestDb")
                .Options;
            _db = new AppDbContext(options);

            _configMock = new Mock<IConfiguration>();
            _configMock.Setup(c => c["Jwt:Key"]).Returns("TestSecretKey_32Chars_ForNUnit!!");
            _configMock.Setup(c => c["Jwt:Issuer"]).Returns("EMS.API");
            _configMock.Setup(c => c["Jwt:Audience"]).Returns("EMS.Client");
            _configMock.Setup(c => c["Jwt:ExpiryHours"]).Returns("8");
            // 

            _service = new AuthService(_db, _configMock.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _db.Database.EnsureDeleted();
            _db.Dispose();
        }

        [Test]
        public async Task RegisterAsync_NewUser_ReturnsSuccess()
        {
            // Arrange
            var dto = new RegisterDto { Username = "newuser", Password = "password123" };

            // Act
            var result = await _service.RegisterAsync(dto);

            // Assert
            Assert.That(result, Is.Not.Null);
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == "newuser");
            Assert.That(user, Is.Not.Null);
            Assert.That(BCrypt.Net.BCrypt.Verify("password123", user!.PasswordHash), Is.True);
        }

        [Test]
        public async Task LoginAsync_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            var adminUser = new AppUser { Username = "admin", PasswordHash = passwordHash, Role = "Admin" };
            _db.Users.Add(adminUser);
            await _db.SaveChangesAsync();

            var dto = new LoginDto { Username = "admin", Password = "admin123" };

            // Act
            var result = await _service.LoginAsync(dto);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Token, Is.Not.Null.And.Not.Empty);
            Assert.That(result.Role, Is.EqualTo("Admin"));
        }

        [Test]
        public async Task LoginAsync_WrongPassword_ReturnsNull()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            var adminUser = new AppUser { Username = "admin", PasswordHash = passwordHash, Role = "Admin" };
            _db.Users.Add(adminUser);
            await _db.SaveChangesAsync();

            var dto = new LoginDto { Username = "admin", Password = "wrongpassword" };

            // Act
            var result = await _service.LoginAsync(dto);

            // Assert
            Assert.That(result, Is.Null);
        }
    }
}
