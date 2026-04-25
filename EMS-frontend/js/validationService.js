// validationService.js
// Handles form validation logic

const validationService = {
  validateEmployee(emp, currentId = null) {
    const errors = {};
    
    // Required fields check
    const required = ['firstName', 'lastName', 'email', 'phone', 'department', 'designation', 'salary', 'joinDate', 'status'];
    required.forEach(field => {
      if (!emp[field] || String(emp[field]).trim() === '') {
        errors[field] = 'This field is required';
      }
    });

    // Email regex
    if (!errors.email) {
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailPattern.test(emp.email)) {
        errors.email = 'Invalid email format';
      } else {
        // Email uniqueness
        const existing = employeeService.getAll().find(e => e.email.toLowerCase() === emp.email.toLowerCase() && e.id != currentId);
        if (existing) {
          errors.email = 'Email already exists';
        }
      }
    }

    // Phone (10 digits)
    if (!errors.phone) {
      const phonePattern = /^\d{10}$/;
      if (!phonePattern.test(emp.phone)) {
        errors.phone = 'Phone must be exactly 10 digits';
      }
    }

    // Salary positive
    if (!errors.salary) {
      const sal = Number(emp.salary);
      if (isNaN(sal) || sal <= 0) {
        errors.salary = 'Salary must be a positive number';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  validateLogin({ username, password }) {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  },
  
  validateSignup({ username, password, confirmPassword }) {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  },

  mapServerErrors(errorResponse) {
    const errors = {};
    if (errorResponse && errorResponse.data) {
      const data = errorResponse.data;
      
      // Handle ASP.NET Core Validation Errors (400 Bad Request)
      if (data.errors) {
        Object.keys(data.errors).forEach(key => {
          // camelCase the key to match frontend field names
          const field = key.charAt(0).toLowerCase() + key.slice(1);
          errors[field] = data.errors[key][0];
        });
      } 
      // Handle Custom Conflict Errors (409 Conflict)
      else if (data.message) {
        if (data.message.toLowerCase().includes('email')) {
          errors.email = data.message;
        } else if (data.message.toLowerCase().includes('username')) {
          errors.username = data.message;
        } else {
          errors.general = data.message;
        }
      }
    }
    return errors;
  }
};
