import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3">
      <div className="mx-auto px-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} IntellectaSim. All rights reserved.
        </div>
        <div className="text-xs text-gray-400">
          Blockchain Block: 124 | Simulation Time: 2:45:32
        </div>
      </div>
    </footer>
  );
};

export default Footer;