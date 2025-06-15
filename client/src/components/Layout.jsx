// Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <section className="flex">
      <Sidebar />
      <main >
        <Outlet />
      </main>
    </section>
  );
};

export default Layout;
