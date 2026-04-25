// authService.test.js

describe('authService', () => {
  it('should authenticate with correct credentials', () => {
    expect(authService.login('admin', 'admin')).toBe(true);
  });
  it('should not authenticate with wrong credentials', () => {
    expect(authService.login('admin', 'wrong')).toBe(false);
  });
});
