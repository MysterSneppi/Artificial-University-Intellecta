import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlayCircle, BarChart2, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Simulation', path: '/simulation', icon: <PlayCircle size={20} /> },
    { name: 'Statistics', path: '/statistics', icon: <BarChart2 size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-light">
          <div className="flex items-center">
            <span className="text-white font-heading font-semibold text-xl">
              Intellecta<span className="text-secondary">Sim</span>
            </span>
          </div>
          <button 
            onClick={closeSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-primary-light md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary-light text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-primary-light'
                    }`
                  }
                  onClick={closeSidebar}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;