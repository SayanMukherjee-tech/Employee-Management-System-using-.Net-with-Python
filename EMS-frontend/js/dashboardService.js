// dashboardService.js
// Handles dashboard summary logic as async delegates to storageService

const dashboardService = {
  async getSummary() {
    const summary = await storageService.getDashboardSummary();
    
    // Map backend DTO to frontend format if necessary
    const departmentBreakdown = Object.keys(summary.departmentBreakdown).map(dept => {
      const count = summary.departmentBreakdown[dept];
      const percentage = summary.totalEmployees > 0 ? Math.round((count / summary.totalEmployees) * 100) : 0;
      return { department: dept, count, percentage };
    });

    return {
      totalEmployees: summary.totalEmployees,
      activeEmployees: summary.activeEmployees,
      inactiveEmployees: summary.onLeaveEmployees, // Mapping 'On Leave' to inactive visually or however MP1 did it
      totalDepartments: Object.keys(summary.departmentBreakdown).length,
      departmentBreakdown,
      recentEmployees: summary.recentEmployees
    };
  }
};
