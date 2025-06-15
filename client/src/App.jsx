import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import SkillMatrixForm from './pages/employee/SkillMatrixForm';


import LeadDashboard from './pages/lead/LeadDashboard';
import ReviewSkillMatrix from './pages/lead/ReviewSkillMatrix';

import HrDashboard from './pages/hr/HrDashboard';
import InitiateAssessment from './pages/hr/InitiateAssessment';
import CreateEmployee from './pages/hr/CreateEmployee';
import TeamEmployeeList from './pages/hr/TeamEmployeeList';

const Layout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <main style={{ flex: 1, padding: '1rem' }}>{children}</main>
  </div>
);

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role?.role_name;

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        {/* Role-Based Routes */}
        {user && (
          <Route
            path="/"
            element={
              <Layout>
                {/* Default dashboard based on role */}
                {role === 'employee' && <EmployeeDashboard/>}
                {role === 'lead' && <LeadDashboard />}
                {role === 'hr' && <HrDashboard />}
              </Layout>
            }
          />
        )}

        {/* Employee Routes */}
        {role === 'employee' && (
          <>
            <Route
              path="/skill-matrix"
              element={
                <Layout>
                  <SkillMatrixForm />
                </Layout>
              }
            />
          </>
        )}

        {/* Lead Routes */}
        {role === 'lead' && (
          <>
            <Route
              path="/review/:employeeId"
              element={
                <Layout>
                  <ReviewSkillMatrix />
                </Layout>
              }
            />
          </>
        )}

        {/* HR Routes */}
        {role === 'hr' && (
          <>
            <Route
              path="/initiate"
              element={
                <Layout>
                  <InitiateAssessment />
                </Layout>
              }
            />
            <Route
              path="/create-employee"
              element={
                <Layout>
                  <CreateEmployee />
                </Layout>
              }
            />
            <Route
              path="/teams"
              element={
                <Layout>
                  <TeamEmployeeList />
                </Layout>
              }
            />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
