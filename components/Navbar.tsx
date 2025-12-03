import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (view: string) => void;
  activeView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView }) => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToolsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('merge'); // Default to the first tool
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHomeActive = activeView === 'home';
  // Tools are active if not home and not one of the legal/support pages
  const isToolsActive = !isHomeActive && activeView && !['privacy', 'terms', 'cookies', 'about', 'contact', 'help', 'report'].includes(activeView);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-glow-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div onClick={handleHomeClick} className="flex items-center space-x-2 md:space-x-3 group cursor-pointer select-none">
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
            <div className="hidden md:flex items-center space-x-2">
              <a 
                href="#" 
                onClick={handleHomeClick} 
                className={`px-4 py-2 rounded-full transition-all duration-200 ${isHomeActive ? 'bg-glow-50 text-glow-600 font-bold shadow-sm border border-glow-100' : 'text-gray-600 hover:text-glow-600 font-medium hover:bg-gray-50'}`}
              >
                Home
              </a>
              <a 
                href="#" 
                onClick={handleToolsClick} 
                className={`px-4 py-2 rounded-full transition-all duration-200 ${isToolsActive ? 'bg-glow-50 text-glow-600 font-bold shadow-sm border border-glow-100' : 'text-gray-600 hover:text-glow-600 font-medium hover:bg-gray-50'}`}
              >
                Tools
              </a>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-green-100 shadow-sm">
              <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
              <span className="font-semibold text-xs md:text-sm whitespace-nowrap">No Login Required</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};