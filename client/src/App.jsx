import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import './index.css';

import LoginForm from './components/LoginForm';
// import Sidebar from './components/Sidebar';
import Layout from './components/Layout';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import SkillMatrixForm from './pages/employee/SkillMatrixForm';


import LeadDashboard from './pages/lead/LeadDashboard';
import ReviewSkillMatrix from './pages/lead/ReviewSkillMatrix';
import TeamMembers from './pages/lead/TeamMembers';

import HrDashboard from './pages/hr/HrDashboard';
import InitiateAssessment from './pages/hr/InitiateAssessment';
import CreateEmployee from './pages/hr/CreateEmployee';
import TeamEmployeeList from './pages/hr/TeamEmployeeList';


const App = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role?.role_name;

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        {user && (
          <Route
            path="/"
            element={
              <Layout>
                {role === 'employee' && <EmployeeDashboard />}
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
            <Route path='/team-review' element={<Layout>
              <TeamMembers />
            </Layout>} />
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
