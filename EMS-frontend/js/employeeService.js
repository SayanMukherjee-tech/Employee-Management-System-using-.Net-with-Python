// employeeService.js
// Handles employee CRUD operations as async delegates to storageService

const employeeService = {
  async getAll(page = 1, pageSize = window.CONFIG.PAGE_SIZE, search = '', department = 'All Departments', status = 'All', sortBy = '', sortDir = 'asc') {
    let query = `?page=${page}&pageSize=${pageSize}`;
    
    if (search.trim() !== '') {
      query += `&search=${encodeURIComponent(search)}`;
    }
    
    if (department !== 'All Departments' && department !== 'All') {
      query += `&department=${encodeURIComponent(department)}`;
    }
    
    if (status !== 'All') {
      query += `&status=${encodeURIComponent(status)}`;
    }
    
    if (sortBy) {
      query += `&sortBy=${encodeURIComponent(sortBy)}&sortDirection=${encodeURIComponent(sortDir)}`;
    }
    
    return await storageService.getAll(query);
  },
  
  async getById(id) {
    return await storageService.getById(id);
  },
  
  async add(employee) {
    return await storageService.add(employee);
  },
  
  async update(id, updated) {
    return await storageService.update(id, updated);
  },
  
  async remove(id) {
    return await storageService.remove(id);
  },
  
  // No longer returning unique departments from client data, maybe predefined or we can fetch.
  // We'll keep static or predefined if needed, but MP1 had it dynamically.
  // Actually, UI just renders predefined filters from index.html usually, let's keep it static.
  getUniqueDepartments() {
    return ["Engineering", "Marketing", "HR", "Finance", "Operations", "Sales"];
  }
};
