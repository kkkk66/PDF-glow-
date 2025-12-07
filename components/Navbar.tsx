import React, { useState } from 'react';
import { FileText, ShieldCheck, Menu, X, BookOpen, Search, Map } from 'lucide-react';
import { SearchModal } from './SearchModal';

interface NavbarProps {
  onNavigate?: (view: string) => void;
  activeView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
      setIsMobileMenuOpen(false); // Close menu after click
    }
  };

  const isHomeActive = activeView === 'home';
  const isBlogActive = activeView === 'blog';
  const isToolsActive = !isHomeActive && !isBlogActive && activeView && !['privacy', 'terms', 'cookies', 'about', 'contact', 'help', 'report', 'sitemap'].includes(activeView);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-glow-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo Section */}
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavigation('home'); }} className="flex items-center space-x-2 md:space-x-3 group cursor-pointer select-none">
              <div className="relative">
                <div className="absolute inset-0 bg-glow-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <div className="relative bg-gradient-to-br from-glow-400 to-glow-600 p-2 md:p-2.5 rounded-xl shadow-glow text-white">
                  <FileText size={20} className="md:w-6 md:h-6" />
                </div>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-glow-600">
                PDF Glow
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <a 
                  href="#home"
                  onClick={(e) => { e.preventDefault(); handleNavigation('home'); }} 
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${isHomeActive ? 'bg-glow-50 text-glow-600 font-bold shadow-sm border border-glow-100' : 'text-gray-600 hover:text-glow-600 font-medium hover:bg-gray-50'}`}
                >
                  Home
                </a>
                <a 
                  href="#merge"
                  onClick={(e) => { e.preventDefault(); handleNavigation('merge'); }} 
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${isToolsActive ? 'bg-glow-50 text-glow-600 font-bold shadow-sm border border-glow-100' : 'text-gray-600 hover:text-glow-600 font-medium hover:bg-gray-50'}`}
                >
                  Tools
                </a>
                <a 
                  href="#blog"
                  onClick={(e) => { e.preventDefault(); handleNavigation('blog'); }} 
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${isBlogActive ? 'bg-glow-50 text-glow-600 font-bold shadow-sm border border-glow-100' : 'text-gray-600 hover:text-glow-600 font-medium hover:bg-gray-50'}`}
                >
                  Blog
                </a>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-glow-600 transition-colors"
                  title="Search tools & pages"
                >
                  <Search size={20} />
                </button>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
                <span className="font-semibold text-sm whitespace-nowrap">No Login Required</span>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search size={24} />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-fade-in-up">
            <div className="p-4 space-y-3">
               <a 
                  href="#home"
                  onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${isHomeActive ? 'bg-glow-50 text-glow-600' : 'hover:bg-gray-50 text-gray-700'}`}
               >
                  Home
               </a>
               <a 
                  href="#merge"
                  onClick={(e) => { e.preventDefault(); handleNavigation('merge'); }}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${isToolsActive ? 'bg-glow-50 text-glow-600' : 'hover:bg-gray-50 text-gray-700'}`}
               >
                  All Tools
               </a>
               <a 
                  href="#blog"
                  onClick={(e) => { e.preventDefault(); handleNavigation('blog'); }}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 ${isBlogActive ? 'bg-glow-50 text-glow-600' : 'hover:bg-gray-50 text-gray-700'}`}
               >
                  <BookOpen size={16} /> Blog & Tips
               </a>
               <a 
                  href="#sitemap"
                  onClick={(e) => { e.preventDefault(); handleNavigation('sitemap'); }}
                  className="block w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 hover:bg-gray-50 text-gray-700"
               >
                  <Map size={16} /> Sitemap
               </a>
               <div className="h-px bg-gray-100 my-2"></div>
               <div className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span className="font-semibold text-sm">No Login Required</span>
               </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={handleNavigation} 
      />
    </>
  );
};