import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-glow-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 md:space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-glow-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <div className="relative bg-gradient-to-br from-glow-400 to-glow-600 p-2 md:p-2.5 rounded-xl shadow-glow text-white">
                <FileText size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-glow-600">
              PDF Glow
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-glow-600 font-medium transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-glow-600 font-medium transition-colors">Tools</a>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-green-100 shadow-sm">
              <ShieldCheck size={16} className="text-green-600" />
              <span className="font-semibold text-xs md:text-sm">No Login Required</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};