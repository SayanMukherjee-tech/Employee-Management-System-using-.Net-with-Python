// uiService.js
// Handles all DOM rendering and UI updates

const uiService = {
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  },
  
  formatCurrency(amount) {
    const num = parseFloat(amount);
    if (isNaN(num) || num === 0) return '₹0 LPA';
    
    // For LPA (Lakhs Per Annum)
    if (num >= 100000) {
      const lpa = (num / 100000).toFixed(2);
      return `₹${lpa} LPA`;
    }
    
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(num);
  },

  renderSignup() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-container">
          <div class="icon"><i class="bi bi-person-plus"></i></div>
          <h2>Create Account</h2>
          <p>Register a new admin account</p>
          <form id="signupForm" autocomplete="off">
            <div class="mb-2">
              <label class="form-label">Username</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input type="text" class="form-control" id="signupUsername" required>
              </div>
              <div class="form-error" id="signupUsernameError"></div>
            </div>
            <div class="mb-2">
              <label class="form-label">Password</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input type="password" class="form-control" id="signupPassword" required minlength="6">
              </div>
              <div class="form-error" id="signupPasswordError"></div>
            </div>
            <div class="mb-2">
              <label class="form-label">Confirm Password</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input type="password" class="form-control" id="signupConfirmPassword" required minlength="6">
              </div>
              <div class="form-error" id="signupConfirmPasswordError"></div>
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-3"><i class="bi bi-person-plus"></i> Create Account</button>
          </form>
          <div class="form-text mt-3">Already have an account? <span class="form-link" id="toLogin">Login</span></div>
        </div>
      </div>
    `;
  },
  
  renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-container">
          <div class="icon"><i class="bi bi-shield-lock"></i></div>
          <h2>Welcome Back</h2>
          <p>Sign in to your admin account</p>
          <form id="loginForm" autocomplete="off">
            <div class="mb-2">
              <label class="form-label">Username</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input type="text" class="form-control" id="loginUsername" required>
              </div>
              <div class="form-error" id="loginUsernameError"></div>
            </div>
            <div class="mb-2">
              <label class="form-label">Password</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input type="password" class="form-control" id="loginPassword" required minlength="6">
              </div>
              <div class="form-error" id="loginPasswordError"></div>
            </div>
            <div class="form-error d-none" id="loginError" style="margin-top:0.5rem; text-align:center;">Invalid credentials</div>
            <button type="submit" class="btn btn-primary w-100 mt-3"><i class="bi bi-box-arrow-in-right"></i> Login</button>
          </form>
          <div class="form-text mt-3">Don't have an account? <span class="form-link" id="toSignup">Sign up</span></div>
          <div class="form-text mt-2"><small>Demo: admin / admin123</small></div>
        </div>
      </div>
    `;
  },

  renderMainLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <nav class="navbar navbar-expand-md navbar-custom sticky-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="#"><i class="bi bi-people-fill"></i> EMS Dashboard</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" style="background-color:rgba(255,255,255,0.1); border:none;">
            <i class="bi bi-list" style="color:#fff; font-size:1.5rem;"></i>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="#" id="navDashboard"><i class="bi bi-speedometer2"></i> Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="navEmployees"><i class="bi bi-people"></i> Employees</a>
              </li>
            </ul>
            <div class="nav-right">
              <button class="btn-nav-primary trigger-add-modal write-only"><i class="bi bi-plus"></i> Add Employee</button>
              <div class="user-info d-none d-md-flex">
                <i class="bi bi-person-circle"></i> 
                <span id="navUsername" class="me-2">admin</span>
                <span class="badge rounded-pill bg-light text-dark shadow-sm" id="roleBadge" style="font-size:0.7rem; padding: 0.3em 0.8em; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Admin</span>
              </div>
              <button class="btn-nav-outline" id="logoutBtn"><i class="bi bi-box-arrow-right"></i> Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div class="dashboard-wrapper">
        <!-- Viewer Mode Notice -->
        <div id="viewerNotice" class="container mt-3 d-none">
          <div class="alert alert-info border-0 shadow-sm d-flex align-items-center" role="alert" style="background: rgba(67, 97, 238, 0.05); color: #4361ee;">
            <i class="bi bi-info-circle-fill me-3" style="font-size: 1.2rem;"></i>
            <div>
              <strong>Viewer Mode:</strong> You have read-only access. Only administrators can add, edit, or delete records.
            </div>
          </div>
        </div>
        <!-- Dashboard Section -->
        <div id="dashboard-section" class="container pb-5">
          <!-- Dynamic Content Rendered Here -->
        </div>

        <!-- Employees Section -->
        <div id="employees-section" class="container pb-5" style="display:none;">
          <div class="dashboard-header">
            <div>
              <h4><i class="bi bi-people" style="color: #4361ee; font-size: 1.2rem;"></i> Employees</h4>
              <p>Manage, search, filter and sort your workforce.</p>
            </div>
            <button class="btn btn-primary px-4 trigger-add-modal write-only"><i class="bi bi-plus"></i> Add Employee</button>
          </div>
          
          <div class="emp-table-wrapper">
            <div class="filter-bar flex-column flex-md-row gap-3">
              <div class="filter-left flex-wrap">
                <div class="search-box">
                  <i class="bi bi-search"></i>
                  <input type="text" id="searchInput" placeholder="Search by name or email...">
                </div>
                <select class="form-select dept-select" id="departmentFilter">
                  <!-- Dynamically populated -->
                </select>
                <div class="filter-pills" id="statusFilter">
                  <span class="pill active" data-status="All">All</span>
                  <span class="pill" data-status="Active">Active</span>
                  <span class="pill" data-status="Inactive">Inactive</span>
                </div>
              </div>
              <div class="filter-right">
                <span style="color: #8898aa; font-size: 0.85rem;" id="tableCountText"></span>
              </div>
            </div>
            
            <table class="emp-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>AVATAR</th>
                  <th class="sortable" data-sort="name">NAME <i class="bi bi-arrow-down-up"></i></th>
                  <th>EMAIL</th>
                  <th>DEPARTMENT</th>
                  <th>DESIGNATION</th>
                  <th class="sortable" data-sort="salary">SALARY <i class="bi bi-arrow-down-up"></i></th>
                  <th class="sortable" data-sort="joinDate">JOIN DATE <i class="bi bi-arrow-down-up"></i></th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody id="employeesTableBody">
                <!-- Rows Rendered Here -->
              </tbody>
            </table>
          </div>
          
          <div id="paginationContainer" class="mt-4">
            <!-- Pagination Bar Rendered Here -->
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div class="modal fade" id="employeeModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header text-white" style="background-color: #1e293b; border-bottom:none;">
              <h5 class="modal-title fw-bold" id="employeeModalLabel">Add Employee</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4 bg-white">
              <form id="employeeForm">
                <input type="hidden" id="empId">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">First Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="empFirstName" placeholder="e.g. Priya">
                    <div class="invalid-feedback" id="errFirstName"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Last Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="empLastName" placeholder="e.g. Prabhu">
                    <div class="invalid-feedback" id="errLastName"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Email Address <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="empEmail" placeholder="name@hexacore.com">
                    <div class="invalid-feedback" id="errEmail"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Phone Number <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="empPhone" placeholder="10-digit number">
                    <div class="invalid-feedback" id="errPhone"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Department <span class="text-danger">*</span></label>
                    <select class="form-select" id="empDepartment">
                      <option value="">— Select Department —</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                    <div class="invalid-feedback" id="errDepartment"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Designation <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="empDesignation" placeholder="e.g. Software Engineer">
                    <div class="invalid-feedback" id="errDesignation"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Annual Salary (₹) <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="empSalary" placeholder="e.g. 750000">
                    <div class="invalid-feedback" id="errSalary"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Join Date <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" id="empJoinDate">
                    <div class="invalid-feedback" id="errJoinDate"></div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-dark">Status <span class="text-danger">*</span></label>
                    <select class="form-select" id="empStatus">
                      <option value="">— Select Status —</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div class="invalid-feedback" id="errStatus"></div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer bg-white border-0 pt-0">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary px-4" id="btnSaveEmployee">Save Employee</button>
            </div>
          </div>
        </div>
      </div>

      <!-- View Modal -->
      <div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header text-white" style="background-color: #1e293b; border-bottom:none;">
              <h5 class="modal-title fw-bold"><i class="bi bi-person-vcard"></i> Employee Details</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4 bg-white text-center">
              <div id="viewModalContent"></div>
            </div>
            <div class="modal-footer bg-white border-0 justify-content-center">
              <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content border-0 shadow-lg text-center">
            <div class="modal-header bg-danger text-white border-0">
              <h5 class="modal-title fw-bold"><i class="bi bi-exclamation-triangle-fill"></i> Confirm Delete</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
              <i class="bi bi-person-x text-danger mb-3" style="font-size:3rem;"></i>
              <p class="mb-1 text-muted">Are you sure you want to delete</p>
              <h5 class="fw-bold text-dark mb-3" id="deleteEmpName"></h5>
              <p class="text-muted small mb-0">This action cannot be undone.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center bg-light">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="btnConfirmDelete"><i class="bi bi-trash"></i> Yes, Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async renderDashboardData() {
    const summary = await dashboardService.getSummary();
    
    let deptRows = summary.departmentBreakdown.map(d => `
      <tr>
        <td><span class="dept-badge dept-bg-${d.department}">${d.department}</span></td>
        <td class="text-center count-text">${d.count}</td>
        <td style="width: 50%;">
          <div class="progress">
            <div class="progress-bar dept-bg-${d.department}" role="progressbar" style="width: ${d.percentage}%"></div>
          </div>
        </td>
        <td class="text-end percent-text">${d.percentage}%</td>
      </tr>
    `).join('');

    let recentRows = summary.recentEmployees.map(e => {
      const initials = e.firstName.charAt(0) + e.lastName.charAt(0);
      return `
        <div class="recent-item">
          <div class="avatar-initials">${initials}</div>
          <div class="emp-info">
            <div class="emp-name">${e.firstName} ${e.lastName}</div>
            <div class="emp-role">${e.role}</div>
          </div>
          <div class="emp-meta">
            <span class="dept-badge dept-bg-${e.department}">${e.department}</span>
            <span class="status-badge status-${e.status}">${e.status}</span>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('dashboard-section').innerHTML = `
      <div class="dashboard-header">
        <div>
          <h4><i class="bi bi-speedometer2" style="color: #4361ee; font-size: 1.2rem;"></i> Dashboard</h4>
          <p>Welcome back! Here's your workforce overview.</p>
        </div>
        <button class="btn btn-primary px-4 trigger-add-modal write-only"><i class="bi bi-plus"></i> Add Employee</button>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="top-card card-blue">
            <div class="icon-box"><i class="bi bi-people-fill"></i></div>
            <div class="content">
              <h3>${summary.totalEmployees}</h3>
              <p>Total Employees</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="top-card card-green">
            <div class="icon-box"><i class="bi bi-person-check-fill"></i></div>
            <div class="content">
              <h3>${summary.activeEmployees}</h3>
              <p>Active</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="top-card card-red">
            <div class="icon-box"><i class="bi bi-person-dash-fill"></i></div>
            <div class="content">
              <h3>${summary.inactiveEmployees}</h3>
              <p>Inactive</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="top-card card-yellow">
            <div class="icon-box"><i class="bi bi-diagram-3-fill"></i></div>
            <div class="content">
              <h3>${summary.totalDepartments}</h3>
              <p>Departments</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-7">
          <div class="section-card">
            <div class="section-title">
              <span><i class="bi bi-bar-chart-fill"></i> Department Breakdown</span>
            </div>
            <table class="dept-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th class="text-center">Count</th>
                  <th>Distribution</th>
                  <th class="text-end">%</th>
                </tr>
              </thead>
              <tbody>
                ${deptRows}
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-md-5">
          <div class="section-card">
            <div class="section-title">
              <span><i class="bi bi-clock-history"></i> Recent Employees</span>
              <span class="badge-light-blue">Last 5 Added</span>
            </div>
            <div class="recent-list">
              ${recentRows}
            </div>
          </div>
        </div>
      </div>
    `;
    this.applyRoleUI();
  },

  renderEmployeesTable(pagedResult) {
    const employees = pagedResult.items;
    
    if (employees.length === 0) {
      document.getElementById('employeesTableBody').innerHTML = `
        <tr>
          <td colspan="10" class="text-center py-5 text-muted">
            <i class="bi bi-search d-block mb-3" style="font-size: 2rem;"></i>
            No employees found matching your criteria.
          </td>
        </tr>
      `;
      document.getElementById('tableCountText').textContent = 'Showing 0 employees';
      document.getElementById('paginationContainer').innerHTML = '';
      return;
    }

    const rows = employees.map(e => {
      const initials = e.firstName.charAt(0) + e.lastName.charAt(0);
      return `
        <tr>
          <td style="color: #8898aa;">#${e.id}</td>
          <td><div class="avatar-circle">${initials}</div></td>
          <td class="fw-bold-name">${e.firstName} ${e.lastName}</td>
          <td style="color: #4a5568;">${e.email}</td>
          <td><span class="dept-badge dept-bg-${e.department}">${e.department}</span></td>
          <td style="color: #4a5568;">${e.role}</td>
          <td class="fw-bold-name">${this.formatCurrency(e.salary || 0)}</td>
          <td style="color: #4a5568;">${this.formatDate(e.joinDate)}</td>
          <td><span class="status-badge status-${e.status}">${e.status}</span></td>
          <td>
            <button class="btn-action view-btn" data-id="${e.id}"><i class="bi bi-eye text-primary-action"></i></button>
            <button class="btn-action edit-btn write-only" data-id="${e.id}"><i class="bi bi-pencil text-warning-action"></i></button>
            <button class="btn-action delete-btn write-only" data-id="${e.id}"><i class="bi bi-trash text-danger-action"></i></button>
          </td>
        </tr>
      `;
    }).join('');

    document.getElementById('employeesTableBody').innerHTML = rows;
    
    const start = (pagedResult.page - 1) * pagedResult.pageSize + 1;
    const end = Math.min(start + pagedResult.items.length - 1, pagedResult.totalCount);
    document.getElementById('tableCountText').textContent = `Showing ${start}-${end} of ${pagedResult.totalCount} employees`;
    
    this.renderPagination(pagedResult);
    this.applyRoleUI();
  },

  renderPagination(pagedResult) {
    const totalPages = pagedResult.totalPages;
    const currentPage = pagedResult.page;
    
    if (totalPages <= 1) {
      document.getElementById('paginationContainer').innerHTML = '';
      return;
    }

    let pages = '';
    for (let i = 1; i <= totalPages; i++) {
      pages += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <button class="page-link" data-page="${i}">${i}</button>
        </li>
      `;
    }

    document.getElementById('paginationContainer').innerHTML = `
      <nav aria-label="Employee table pagination">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></button>
          </li>
          ${pages}
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></button>
          </li>
        </ul>
      </nav>
    `;
  },

  applyRoleUI() {
    const isAdmin = authService.isAdmin();
    const isViewer = authService.isViewer();
    const role = authService.getRole();
    
    // Show/hide write-only buttons
    const writeOnlyElements = document.querySelectorAll('.write-only');
    writeOnlyElements.forEach(el => {
      if (!isAdmin) {
        el.style.setProperty('display', 'none', 'important');
      } else {
        el.style.display = '';
      }
    });

    // Update role badge in navbar
    const badge = document.getElementById('roleBadge');
    if (badge) {
      badge.textContent = role;
      badge.className = `badge rounded-pill shadow-sm ${isViewer ? 'bg-secondary' : 'bg-primary'} text-white`;
    }

    // Show/hide viewer notice
    const notice = document.getElementById('viewerNotice');
    if (notice) {
      if (isViewer) {
        notice.classList.remove('d-none');
      } else {
        notice.classList.add('d-none');
      }
    }
  },
  
  populateDepartmentFilter() {
    const depts = employeeService.getUniqueDepartments();
    const select = document.getElementById('departmentFilter');
    if(select) {
        let options = '<option value="All Departments">All Departments</option>';
        depts.forEach(d => {
            options += `<option value="${d}">${d}</option>`;
        });
        select.innerHTML = options;
    }
  },
  
  populateViewModal(emp) {
    const initials = emp.firstName.charAt(0) + emp.lastName.charAt(0);
    document.getElementById('viewModalContent').innerHTML = `
      <div class="mb-3 d-flex justify-content-center">
        <div class="avatar-circle" style="width: 64px; height: 64px; font-size: 1.5rem;">${initials}</div>
      </div>
      <h4 class="fw-bold text-dark mb-1">${emp.firstName} ${emp.lastName}</h4>
      <div class="mb-4"><span class="dept-badge dept-bg-${emp.department}">${emp.department}</span></div>
      
      <div class="row text-start gx-4 gy-3">
        <div class="col-6">
          <div class="text-muted small fw-bold text-uppercase">Email</div>
          <div class="text-dark">${emp.email}</div>
        </div>
        <div class="col-6">
          <div class="text-muted small fw-bold text-uppercase">Phone</div>
          <div class="text-dark">${emp.phone}</div>
        </div>
        <div class="col-6">
          <div class="text-muted small fw-bold text-uppercase">Role</div>
          <div class="text-dark">${emp.role}</div>
        </div>
        <div class="col-6">
          <div class="text-muted small fw-bold text-uppercase">Annual Salary</div>
          <div class="text-primary fw-bold">${this.formatCurrency(emp.salary || 0)}</div>
        </div>
        <div class="col-6">
          <div class="text-muted small fw-bold text-uppercase">Join Date</div>
          <div class="text-dark">${this.formatDate(emp.joinDate)}</div>
        </div>
        <div class="col-6">
          <div class="text-muted small fw-bold text-uppercase">Status</div>
          <div><span class="status-badge status-${emp.status}">${emp.status}</span></div>
        </div>
      </div>
    `;
  }
};
