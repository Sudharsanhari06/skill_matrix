import React from 'react';
import Sidebar from './Sidebar';
import '../styles/sidebar.css';


const Layout = ({ children }) => (
  <div className='layout-container'>
    <div className='sidebar-container'>
        <Sidebar />
    </div>
    <main className='dashboard-container'>
      {children}
    </main>
  </div>
);

export default Layout;
