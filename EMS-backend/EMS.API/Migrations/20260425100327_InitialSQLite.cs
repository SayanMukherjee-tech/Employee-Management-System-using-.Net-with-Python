using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSQLite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "TEXT", maxLength: 15, nullable: false),
                    Department = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Salary = table.Column<decimal>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CreatedAt", "Department", "Email", "FirstName", "JoinDate", "LastName", "Phone", "Role", "Salary", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7771), "Engineering", "pooja.ghosh@XYZ.com", "Pooja", new DateTime(2022, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ghosh", "9876543210", "DevOps Engineer", 750000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7772) },
                    { 2, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7786), "Operations", "amit.joshi@XYZ.com", "Amit", new DateTime(2023, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Joshi", "9876543211", "Supply Chain Analyst", 600000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7786) },
                    { 3, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7793), "Marketing", "lakshmi.chandran@XYZ.com", "Lakshmi", new DateTime(2021, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chandran", "9876543212", "Brand Manager", 850000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7793) },
                    { 4, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7799), "Finance", "suresh.babu@XYZ.com", "Suresh", new DateTime(2022, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Babu", "9876543213", "Tax Consultant", 700000m, "Inactive", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7799) },
                    { 5, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7806), "Engineering", "meera.krishnan@XYZ.com", "Meera", new DateTime(2023, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Krishnan", "9876543214", "QA Engineer", 650000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7806) },
                    { 6, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7813), "HR", "rahul.sharma@XYZ.com", "Rahul", new DateTime(2023, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sharma", "9876543215", "HR Executive", 500000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7814) },
                    { 7, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7831), "Engineering", "vikram.singh@XYZ.com", "Vikram", new DateTime(2021, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Singh", "9876543216", "Software Engineer", 900000m, "Inactive", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7832) },
                    { 8, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7838), "Finance", "neha.gupta@XYZ.com", "Neha", new DateTime(2022, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gupta", "9876543217", "Financial Analyst", 720000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7838) },
                    { 9, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7845), "Marketing", "anjali.desai@XYZ.com", "Anjali", new DateTime(2023, 4, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Desai", "9876543218", "SEO Specialist", 550000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7845) },
                    { 10, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7878), "Operations", "karan.patel@XYZ.com", "Karan", new DateTime(2020, 10, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Patel", "9876543219", "Operations Manager", 950000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7878) },
                    { 11, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7886), "HR", "riya.sen@XYZ.com", "Riya", new DateTime(2021, 7, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sen", "9876543220", "Talent Acquisition", 680000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7886) },
                    { 12, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7892), "Engineering", "rohit.verma@XYZ.com", "Rohit", new DateTime(2019, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Verma", "9876543221", "Tech Lead", 1200000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7892) },
                    { 13, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7899), "Marketing", "sneha.reddy@XYZ.com", "Sneha", new DateTime(2022, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reddy", "9876543222", "Content Strategist", 600000m, "Inactive", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7899) },
                    { 14, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7905), "Finance", "arjun.nair@XYZ.com", "Arjun", new DateTime(2023, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nair", "9876543223", "Accountant", 500000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7905) },
                    { 15, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7925), "Operations", "priya.menon@XYZ.com", "Priya", new DateTime(2023, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Menon", "9876543224", "Logistics Coordinator", 450000m, "Active", new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7926) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7286), "$2a$11$VAKioSvVwsy0rU8u/H1myOra9fVL4.G/hXo1/CGEvGgKAnT0Iz8/O", "Admin", "admin" },
                    { 2, new DateTime(2026, 4, 25, 10, 3, 27, 338, DateTimeKind.Utc).AddTicks(7288), "$2a$11$K9fA3fewFqSVSNRRLgOmK.Gx0M99u9zrr1yNMtYyvgqDgekU4r8RO", "Viewer", "viewer" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
