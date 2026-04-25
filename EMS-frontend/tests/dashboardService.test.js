// dashboardService.test.js

describe('dashboardService', () => {
  it('should return correct summary', () => {
    const summary = dashboardService.getSummary();
    expect(summary.totalEmployees).toBe(employees.length);
    expect(summary.totalDepartments).toBe(departments.length);
  });
});
