import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('pdfglow_cookie_consent');
    if (!consent) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pdfglow_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // We still hide it, but we don't store the 'accepted' flag
    // In a real app, you would disable tracking scripts here
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-xl border border-glow-200 shadow-2xl rounded-2xl p-6 md:flex md:items-center md:justify-between gap-6 ring-1 ring-black/5">
        <div className="flex items-start gap-4 mb-6 md:mb-0">
          <div className="p-3 bg-glow-100 text-glow-600 rounded-xl flex-shrink-0">
             <Cookie size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">We value your privacy</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies. 
              Read our <a href="#cookies" className="text-glow-600 underline hover:text-glow-700">Cookie Policy</a>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
           <button 
             onClick={handleDecline}
             className="flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
           >
             Decline
           </button>
           <button 
             onClick={handleAccept}
             className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-glow-500 to-glow-600 shadow-lg shadow-glow-200 hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
           >
             Accept Cookies
           </button>
        </div>
      </div>
    </div>
  );
};