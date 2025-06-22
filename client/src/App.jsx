import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import './index.css';

import LoginForm from './components/LoginForm';
// import Sidebar from './components/Sidebar';
import Layout from './components/Layout';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import SkillMatrix from './pages/employee/SkillMatrix';
import Assessment from './components/Assessment';

import LeadDashboard from './pages/lead/LeadDashboard';
import TeamMembers from './pages/lead/TeamMembers';
import SkillCriteria from './components/SkillCriteria';
import LeadReview from './pages/lead/LeadReview';

import HrDashboard from './pages/hr/HrDashboard';
import InitiateAssessment from './pages/hr/InitiateAssessment';
import CreateEmployee from './pages/hr/CreateEmployee';
import TeamEmployeeList from './pages/hr/TeamEmployeeList';
import HrAssessmentList from './pages/hr/HrAssessmentList';
import HrReviewSkillMatrix from './pages/hr/HrReviewSkillMatrix';
import TeamSkillMatrix from './components/TeamSkillMatrix';


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
            {<Route
              path="/skill-matrix"
              element={
                <Layout>
                  <SkillMatrix />
                </Layout>
              }
            />}
            <Route
              path="/skill-criteria"
              element={
                <Layout>
                  < SkillCriteria />
                </Layout>
              }
            />
            <Route path='/assessment'
              element={
                <Layout>
                  <Assessment />
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
                  <LeadReview />
                </Layout>
              }
            />
            <Route path='/assessment'
              element={
                <Layout>
                  <Assessment />
                </Layout>
              }
            />

            <Route
              path="/skill-criteria"
              element={
                <Layout>
                  < SkillCriteria />
                </Layout>
              }
            />
            <Route path='/team-review' element={<Layout>
              <TeamMembers />
            </Layout>} />

            <Route path="/team-skill-matrix" element={<Layout><TeamSkillMatrix /></Layout>} />

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
            <Route
              path="/hr/review-list"
              element={
                <Layout>
                  <HrAssessmentList />
                </Layout>
              }
            />
            <Route
              path="/hr/review/:assessmentId"
              element={
                <Layout>
                  <HrReviewSkillMatrix />
                </Layout>
              }
            />

          </>
        )}

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
