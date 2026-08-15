import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      className="bg-gray-800 text-white px-4 py-3 border-b border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">CPSpro</h1>
          <nav className="hidden md:flex space-x-6">
            <button className="hover:text-blue-300 transition-colors">File</button>
            <button className="hover:text-blue-300 transition-colors">View</button>
            <button className="hover:text-blue-300 transition-colors">Subjects</button>
            <button className="hover:text-blue-300 transition-colors">Templates</button>
            <button className="hover:text-blue-300 transition-colors">Analysis</button>
            <button className="hover:text-blue-300 transition-colors">Tools</button>
            <button className="hover:text-blue-300 transition-colors">Help</button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
