
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage';
import LoginPage from '@/pages/LoginPage.jsx';
import EmployeeDashboard from '@/pages/EmployeeDashboard.jsx';
import ManagerDashboard from '@/pages/ManagerDashboard.jsx';
import EmployeeProfile from '@/pages/EmployeeProfile.jsx';
import AllEmployeesPage from '@/pages/AllEmployeesPage.jsx';
import ReportsPage from '@/pages/ReportsPage.jsx';
import MyPerformancePage from '@/pages/MyPerformancePage.jsx';
import KPIDashboard from '@/pages/KPIDashboard.jsx';
import EmployeeManagementPage from '@/pages/EmployeeManagementPage.jsx';
import DepartmentsPage from '@/pages/DepartmentsPage.jsx';
import TaskAssignmentPage from '@/pages/TaskAssignmentPage.jsx';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Employee Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="Employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-performance"
            element={
              <ProtectedRoute requiredRole="Employee">
                <MyPerformancePage />
              </ProtectedRoute>
            }
          />
          
          {/* Manager Routes */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute requiredRole="Manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRole="Manager">
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kpi-dashboard"
            element={
              <ProtectedRoute requiredRole="Manager">
                <KPIDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRole="Manager">
                <EmployeeManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute requiredRole="Manager">
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute requiredRole="Manager">
                <TaskAssignmentPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/employee/:id"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-employees"
            element={
              <ProtectedRoute>
                <AllEmployeesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
