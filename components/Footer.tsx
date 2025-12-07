import React from 'react';
import { Heart, Mail, MessageCircle, ShieldCheck } from 'lucide-react';

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
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    PDF Glow
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Professional, secure, and free online PDF tools. 
                    Built for privacy, powered by performance.
                </p>
                <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold">100% Secure & Encrypted</span>
                </div>
            </div>
            
            <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-4">Tools</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                    <li><a href="#" onClick={(e) => handleNav(e, 'merge')} className="hover:text-glow-600 transition-colors">Merge PDF</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'split')} className="hover:text-glow-600 transition-colors">Split PDF</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'compress')} className="hover:text-glow-600 transition-colors">Compress PDF</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'pdftojpg')} className="hover:text-glow-600 transition-colors">PDF to JPG</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'organize')} className="hover:text-glow-600 transition-colors">Organize PDF</a></li>
                </ul>
            </div>

            <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-4">Support</h4>
                <ul className="text-sm text-gray-500 space-y-4">
                    <li className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                            <Mail size={14} /> Contact Us
                        </span>
                        <a href="mailto:pdfglow@gmail.com" className="hover:text-glow-600 break-all pl-6 transition-colors">
                            pdfglow@gmail.com
                        </a>
                    </li>
                    <li>
                        <a 
                            href="https://wa.me/916230919846" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-glow-600 flex items-center gap-2 font-medium transition-colors"
                        >
                            <MessageCircle size={14} className="text-green-500" />
                            Help Center (WhatsApp)
                        </a>
                    </li>
                    <li>
                        <a href="mailto:pdfglow@gmail.com?subject=Report%20an%20Issue" className="hover:text-glow-600 transition-colors">
                            Report an Issue
                        </a>
                    </li>
                </ul>
            </div>

            <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                <ul className="text-sm text-gray-500 space-y-2">
                    <li><a href="#" onClick={(e) => handleNav(e, 'privacy')} className="hover:text-glow-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'terms')} className="hover:text-glow-600 transition-colors">Terms of Service</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'cookies')} className="hover:text-glow-600 transition-colors">Cookie Policy</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'about')} className="hover:text-glow-600 transition-colors">About Us</a></li>
                    <li><a href="#" onClick={(e) => handleNav(e, 'sitemap')} className="hover:text-glow-600 transition-colors">Sitemap</a></li>
                </ul>
            </div>
        </div>
        
        {/* Disclaimer for AdSense Trust */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-xs text-gray-400 leading-relaxed text-justify md:text-center border border-gray-100">
            <strong>Disclaimer:</strong> PDF Glow is a free online tool. To ensure the privacy and security of our users, all file processing (merging, splitting, compressing, etc.) is performed locally within the user's web browser via WebAssembly technology. We do not upload, store, or view your files on our servers. While we strive for accuracy, users are responsible for verifying their output files.
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