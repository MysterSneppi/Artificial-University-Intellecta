import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
       <div className="flex items-center">
  <Link to="/dashboard" className="flex items-center space-x-2">
    <img src="src/img/IntellectaLogo.png" alt="Logo" width={40} height={40} />
    <span className="text-primary font-heading font-semibold text-xl flex items-center">
      Intellecta<span className="text-secondary-dark ml-1">Simulation</span>
    </span>
  </Link>
</div>

        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="px-3 py-1 bg-primary bg-opacity-10 rounded-full">
              <span className="font-medium text-primary">Block: 124</span>
            </div>
            <div className="px-3 py-1 bg-success bg-opacity-10 rounded-full">
              <span className="font-medium text-success-dark">Semester: 2</span>
            </div>
          </div>
          
          <button className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100">
            <Bell size={20} />
          </button>
          
          <Link to="/settings" className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100">
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;