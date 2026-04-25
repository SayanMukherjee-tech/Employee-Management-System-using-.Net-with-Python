using Moq;
using NUnit.Framework;
using EMS.API.Services;
using EMS.API.Models;
using EMS.API.DTOs;
using System.Threading.Tasks;

namespace EMS.Tests.Services
{
    [TestFixture]
    public class EmployeeServiceTests
    {
        private Mock<IEmployeeRepository> _repoMock;
        private EmployeeService _service;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IEmployeeRepository>();
            _service = new EmployeeService(_repoMock.Object);
        }

        [Test]
        public async Task GetByIdAsync_ValidId_ReturnsMappedDto()
        {
            // Arrange
            var fakeEmployee = new Employee 
            { 
                Id = 1, 
                FirstName = "Priya", 
                LastName = "Prabhu", 
                Email = "p@h.com", 
                Status = "Active",
                Role = "Developer",
                Department = "Engineering",
                Salary = 750000,
                JoinDate = System.DateTime.UtcNow
            };
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(fakeEmployee);

            // Act
            var result = await _service.GetByIdAsync(1);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.FirstName, Is.EqualTo("Priya"));
            _repoMock.Verify(r => r.GetByIdAsync(1), Times.Once);
        }

        [Test]
        public async Task GetByIdAsync_NonExistentId_ReturnsNull()
        {
            // Arrange
            _repoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Employee?)null);

            // Act
            var result = await _service.GetByIdAsync(999);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task CreateAsync_CallsRepository()
        {
            // Arrange
            var dto = new CreateEmployeeDto 
            { 
                FirstName = "Test", 
                LastName = "User", 
                Email = "test@user.com",
                Role = "Manager",
                Department = "HR",
                Salary = 50000,
                JoinDate = System.DateTime.UtcNow,
                Status = "Active"
            };
            _repoMock.Setup(r => r.AddAsync(It.IsAny<Employee>())).ReturnsAsync(new Employee { Id = 1 });

            // Act
            await _service.CreateAsync(dto);

            // Assert
            _repoMock.Verify(r => r.AddAsync(It.IsAny<Employee>()), Times.Once);
        }
    }
}
