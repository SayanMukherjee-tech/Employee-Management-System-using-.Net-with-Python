// authService.js
// Handles authentication logic

let _session = null; // Private in-memory session

const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${window.CONFIG.API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || 'Invalid username or password' };
      }

      const data = await response.json();
      // Store in-memory as per instructions (lost on refresh)
      _session = { username, token: data.token, role: data.role };
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  async signup(username, password) {
    try {
      const response = await fetch(`${window.CONFIG.API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || 'Registration failed' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  logout() {
    _session = null;
  },

  isAuthenticated() {
    return _session !== null;
  },

  getUsername() {
    return _session ? _session.username : null;
  },

  getToken() {
    return _session ? _session.token : null;
  },

  getRole() {
    return _session ? _session.role : null;
  },

  isAdmin() {
    return this.getRole() === 'Admin';
  },

  isViewer() {
    return this.getRole() === 'Viewer';
  }
};
