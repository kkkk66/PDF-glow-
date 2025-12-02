import React from 'react';
import { Heart, Mail, Phone, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    if (onNavigate) {
        onNavigate(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-4">PDF Glow</h4>
                <p className="text-sm text-gray-500">
                    Professional, secure, and free online PDF tools. 
                    Built for privacy, powered by performance.
                </p>
            </div>
            
            <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-4">Tools</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                    <li><a href="#" onClick={(e) => handleNav(e, 'merge')} className="hover:text-glow-600">Merge PDF</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'split')} className="hover:text-glow-600">Split PDF</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'compress')} className="hover:text-glow-600">Compress PDF</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'pdftojpg')} className="hover:text-glow-600">PDF to JPG</a></li>
                </ul>
            </div>

            <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-4">Support</h4>
                <ul className="text-sm text-gray-500 space-y-4">
                    <li className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                            <Mail size={14} /> Contact Us
                        </span>
                        <a href="mailto:pdfglow@gmail.com" className="hover:text-glow-600 break-all pl-6">
                            pdfglow@gmail.com
                        </a>
                        <a href="tel:6230919846" className="hover:text-glow-600 pl-6">
                            +91 6230919846
                        </a>
                    </li>
                    <li>
                        <a 
                            href="https://wa.me/916230919846" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-glow-600 flex items-center gap-2 font-medium"
                        >
                            <MessageCircle size={14} className="text-green-500" />
                            Help Center (WhatsApp)
                        </a>
                    </li>
                    <li>
                        <a href="mailto:pdfglow@gmail.com?subject=Report%20an%20Issue" className="hover:text-glow-600">
                            Report an Issue
                        </a>
                    </li>
                </ul>
            </div>

            <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                    <li><a href="#" onClick={(e) => handleNav(e, 'privacy')} className="hover:text-glow-600">Privacy Policy</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'terms')} className="hover:text-glow-600">Terms of Service</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'cookies')} className="hover:text-glow-600">Cookie Policy</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'about')} className="hover:text-glow-600">About Us</a></li>
                </ul>
            </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">© 2024 PDF Glow. All rights reserved.</p>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-2 md:mt-0">
                Made with <Heart size={14} className="text-red-400 fill-red-400" /> for the web
            </p>
        </div>
      </div>
    </footer>
  );
};