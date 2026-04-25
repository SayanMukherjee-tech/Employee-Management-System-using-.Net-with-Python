// storageService.js
// Handles API calls

const storageService = {
  async request(endpoint, method = 'GET', body = null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${window.CONFIG.API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.reload();
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw { status: response.status, data: errorData };
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  },

  async getAll(queryParams = '') {
    return this.request(`/Employees${queryParams}`);
  },

  async getById(id) {
    return this.request(`/Employees/${id}`);
  },

  async add(employee) {
    return this.request('/Employees', 'POST', employee);
  },

  async update(id, employee) {
    return this.request(`/Employees/${id}`, 'PUT', employee);
  },

  async remove(id) {
    return this.request(`/Employees/${id}`, 'DELETE');
  },

  async getDashboardSummary() {
    return this.request('/Employees/dashboard');
  }
};
