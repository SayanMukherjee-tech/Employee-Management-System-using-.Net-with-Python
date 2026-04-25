// app.js
// Main entry point - Now utilizing jQuery for advanced DOM manipulation and view toggling

$(document).ready(function() {
  // Application State
  const _state = {
    page: 1,
    pageSize: 100, // show up to 100 employees per page
    filters: {
      query: '',
      department: 'All Departments',
      status: 'All',
      sortBy: '',
      sortDir: 'asc'
    },
    currentEditId: null,
    currentDeleteId: null,
    searchDebounceTimer: null
  };

  // Initial routing
  if (!authService.isAuthenticated()) {
    showLoginView();
  } else {
    initializeMainApp();
  }

  // --- Auth Views ---
  function showSignupView() {
    uiService.renderSignup();
    
    $('#toLogin').on('click', function() {
      showLoginView();
    });

    $('#signupForm').on('submit', async function(e) {
      e.preventDefault();
      $('.form-error').text('');
      
      const username = $('#signupUsername').val().trim();
      const password = $('#signupPassword').val();
      const confirmPassword = $('#signupConfirmPassword').val();
      
      const validationErrors = validationService.validateSignup({ username, password, confirmPassword });
      if (Object.keys(validationErrors).length > 0) {
        Object.keys(validationErrors).forEach(key => {
          $(`#signup${key.charAt(0).toUpperCase() + key.slice(1)}Error`).text(validationErrors[key]);
        });
        return;
      }

      const result = await authService.signup(username, password);
      if (result.success) {
        showToast('Account created successfully! Please login.');
        setTimeout(() => { showLoginView(); }, 1200);
      } else {
        $('#signupUsernameError').text(result.error);
      }
    });
  }

  function showLoginView() {
    uiService.renderLogin();
    
    $('#toSignup').on('click', function() {
      showSignupView();
    });

    $('#loginForm').on('submit', async function(e) {
      e.preventDefault();
      $('.form-error').text('');
      $('#loginError').addClass('d-none');
      
      const username = $('#loginUsername').val().trim();
      const password = $('#loginPassword').val().trim();
      
      const validationErrors = validationService.validateLogin({ username, password });
      if (Object.keys(validationErrors).length > 0) {
        Object.keys(validationErrors).forEach(key => {
          $(`#login${key.charAt(0).toUpperCase() + key.slice(1)}Error`).text(validationErrors[key]);
        });
        return;
      }

      const result = await authService.login(username, password);
      if (result.success) {
        initializeMainApp();
      } else {
        $('#loginError').text(result.error).removeClass('d-none');
      }
    });
  }

  // --- Main Application ---
  async function initializeMainApp() {
    uiService.renderMainLayout();
    
    // Set username in nav
    $('#navUsername').text(authService.getUsername() || 'User');

    // Initial renders
    await uiService.renderDashboardData();
    uiService.populateDepartmentFilter();
    await refreshEmployeesTable();
    
    // Default to showing Dashboard
    $('#dashboard-section').show();
    $('#employees-section').hide();
    
    bindNavigationEvents();
    bindFilterAndSortEvents();
    bindCrudEvents();
    bindPaginationEvents();
    
    uiService.applyRoleUI();
  }

  function bindNavigationEvents() {
    $('#navDashboard').on('click', async function(e) {
      e.preventDefault();
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
      
      await uiService.renderDashboardData();
      
      $('#employees-section').hide();
      $('#dashboard-section').fadeIn(300);
      $('.navbar-collapse').collapse('hide');
    });

    $('#navEmployees').on('click', async function(e) {
      e.preventDefault();
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
      
      await refreshEmployeesTable();
      
      $('#dashboard-section').hide();
      $('#employees-section').fadeIn(300);
      $('.navbar-collapse').collapse('hide');
    });

    $('#logoutBtn').on('click', function() {
      authService.logout();
      showLoginView();
    });
  }

  // --- Search, Filter, Sort, Pagination ---
  async function refreshEmployeesTable() {
    const pagedResult = await employeeService.getAll(
      _state.page,
      _state.pageSize,
      _state.filters.query,
      _state.filters.department,
      _state.filters.status,
      _state.filters.sortBy,
      _state.filters.sortDir
    );
    uiService.renderEmployeesTable(pagedResult);
  }

  function bindFilterAndSortEvents() {
    // Search input (Debounced)
    $('#app').on('input', '#searchInput', function() {
      clearTimeout(_state.searchDebounceTimer);
      _state.filters.query = $(this).val();
      _state.page = 1; // Reset to first page
      
      _state.searchDebounceTimer = setTimeout(() => {
        refreshEmployeesTable();
      }, 350);
    });

    // Department dropdown
    $('#app').on('change', '#departmentFilter', function() {
      _state.filters.department = $(this).val();
      _state.page = 1;
      refreshEmployeesTable();
    });

    // Status Pills
    $('#app').on('click', '#statusFilter .pill', function() {
      $('#statusFilter .pill').removeClass('active');
      $(this).addClass('active');
      _state.filters.status = $(this).data('status');
      _state.page = 1;
      refreshEmployeesTable();
    });

    // Sorting Headers
    $('#app').on('click', 'th.sortable', function() {
      const sortKey = $(this).data('sort');
      
      if (_state.filters.sortBy === sortKey) {
        _state.filters.sortDir = _state.filters.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        _state.filters.sortBy = sortKey;
        _state.filters.sortDir = 'asc';
      }
      
      $('th.sortable').removeClass('asc desc');
      $(this).addClass(_state.filters.sortDir);
      
      refreshEmployeesTable();
    });
  }

  function bindPaginationEvents() {
    $('#app').on('click', '.page-link', function(e) {
      e.preventDefault();
      const page = $(this).data('page');
      if (page && page !== _state.page) {
        _state.page = page;
        refreshEmployeesTable();
        // Scroll to top of table
        window.scrollTo({ top: $('#employees-section').offset().top - 100, behavior: 'smooth' });
      }
    });
  }

  // --- CRUD Modals ---
  function bindCrudEvents() {
    // 1. ADD: Trigger Add Modal
    $('#app').on('click', '.trigger-add-modal', function() {
      if (authService.isViewer()) {
        showToast("You don't have permission to add an employee! Please contact your admin for the same.");
        return;
      }
      _state.currentEditId = null;
      $('#employeeModalLabel').text('Add Employee');
      $('#btnSaveEmployee').text('Save Employee');
      $('#employeeForm')[0].reset();
      $('.invalid-feedback').text('');
      $('.form-control, .form-select').removeClass('is-invalid');
      
      const modal = new bootstrap.Modal(document.getElementById('employeeModal'));
      modal.show();
    });

    // 2. VIEW: Trigger View Modal
    $('#app').on('click', '.view-btn', async function() {
      const id = $(this).data('id');
      try {
        const emp = await employeeService.getById(id);
        if (emp) {
          uiService.populateViewModal(emp);
          const modal = new bootstrap.Modal(document.getElementById('viewModal'));
          modal.show();
        }
      } catch (err) {
        showToast('Error loading employee details');
      }
    });

    // 3. EDIT: Trigger Edit Modal
    $('#app').on('click', '.edit-btn', async function() {
      _state.currentEditId = $(this).data('id');
      try {
        const emp = await employeeService.getById(_state.currentEditId);
        if (emp) {
          $('#employeeModalLabel').text('Edit Employee');
          $('#btnSaveEmployee').text('Update Employee');
          $('.invalid-feedback').text('');
          $('.form-control, .form-select').removeClass('is-invalid');
          
          $('#empFirstName').val(emp.firstName);
          $('#empLastName').val(emp.lastName);
          $('#empEmail').val(emp.email);
          $('#empPhone').val(emp.phone || '');
          $('#empDepartment').val(emp.department);
          $('#empDesignation').val(emp.role); // Role maps to designation UI
          $('#empSalary').val(emp.salary || '');
          $('#empJoinDate').val(emp.joinDate ? emp.joinDate.split('T')[0] : '');
          $('#empStatus').val(emp.status);

          const modal = new bootstrap.Modal(document.getElementById('employeeModal'));
          modal.show();
        }
      } catch (err) {
        showToast('Error loading employee details');
      }
    });

    // 4. SAVE (Create & Update Submit handler)
    $('#app').on('click', '#btnSaveEmployee', async function() {
      const empData = {
        firstName: $('#empFirstName').val().trim(),
        lastName: $('#empLastName').val().trim(),
        email: $('#empEmail').val().trim(),
        phone: $('#empPhone').val().trim(),
        // Backend maps role to designation
        department: $('#empDepartment').val(),
        role: $('#empDesignation').val().trim(), 
        salary: parseInt($('#empSalary').val()) || 0,
        joinDate: $('#empJoinDate').val(),
        status: $('#empStatus').val()
      };

      $('.invalid-feedback').text('');
      $('.form-control, .form-select').removeClass('is-invalid');
      
      try {
        if (authService.isViewer()) {
          showToast("You don't have permission to add an employee! Please contact your admin for the same.");
          return;
        }
        if (_state.currentEditId) {
          await employeeService.update(_state.currentEditId, empData);
          showToast('Employee updated successfully!');
        } else {
          await employeeService.add(empData);
          showToast('Employee added successfully!');
        }

        bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
        await refreshEmployeesTable();
        await uiService.renderDashboardData();
      } catch (err) {
        const serverErrors = validationService.mapServerErrors(err);
        if (Object.keys(serverErrors).length > 0) {
          Object.keys(serverErrors).forEach(key => {
            // Map 'role' to 'Designation' field in UI
            const fieldKey = key === 'role' ? 'Designation' : key.charAt(0).toUpperCase() + key.slice(1);
            const fieldId = `#emp${fieldKey}`;
            $(fieldId).addClass('is-invalid');
            $(`#err${fieldKey}`).text(serverErrors[key]);
          });
        } else {
          showToast('An unexpected error occurred');
        }
      }
    });

    // 5. DELETE: Trigger Confirm Delete Modal
    $('#app').on('click', '.delete-btn', async function() {
      _state.currentDeleteId = $(this).data('id');
      const emp = await employeeService.getById(_state.currentDeleteId);
      if (emp) {
        $('#deleteEmpName').text(`${emp.firstName} ${emp.lastName}`);
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
      }
    });

    // 6. DELETE: Confirm Execution
    $('#app').on('click', '#btnConfirmDelete', async function() {
      if (_state.currentDeleteId) {
        try {
          await employeeService.remove(_state.currentDeleteId);
          showToast('Employee deleted successfully!');
          
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          await refreshEmployeesTable();
          await uiService.renderDashboardData();
        } catch (err) {
          showToast('Error deleting employee');
        }
      }
    });

    // --- Fix for modal freeze ---
    $(document).on('hidden.bs.modal', '.modal', function () {
      $('.modal-backdrop').remove();
      $('body').css('overflow', 'auto');
      $('body').css('padding-right', '0');
    });
  }

  // --- Utilities ---
  function showToast(msg) {
    let toast = $('#ems-toast');
    if (toast.length === 0) {
      $('body').append(`
        <div id="ems-toast" style="position:fixed; top:30px; right:30px; z-index:9999; background:#4361ee; color:#fff; padding:1rem 2rem; border-radius:8px; font-weight:600; box-shadow:0 4px 16px rgba(0,0,0,0.12); display:none;">
        </div>
      `);
      toast = $('#ems-toast');
    }
    toast.text(msg).fadeIn(200);
    setTimeout(() => { toast.fadeOut(300); }, 2500);
  }
});
