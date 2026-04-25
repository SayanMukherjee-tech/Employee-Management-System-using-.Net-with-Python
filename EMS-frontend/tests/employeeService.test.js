// employeeService.test.js
// Basic test for employeeService

describe('employeeService', () => {
  it('should add a new employee', () => {
    const initialCount = employees.length;
    const emp = { name: 'Test', email: 'test@company.com', departmentId: 1, status: 'Active' };
    employeeService.add(emp);
    expect(employees.length).toBe(initialCount + 1);
  });
});
