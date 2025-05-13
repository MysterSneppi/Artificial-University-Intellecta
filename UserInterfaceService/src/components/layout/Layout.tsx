import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;