import React from 'react';
import Sidebar from './Sidebar';
import '../styles/sidebar.css';
import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className='layout-container'>
    <div className='sidebar-container'>
      <Sidebar />
    </div>
    <div className="main-content">
      <Navbar />
      <main className="dashboard-container">
        {children}
      </main>
    </div>
  </div>
);

export default Layout;
