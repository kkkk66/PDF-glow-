import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export const InstallPwa: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Detect Installable Event (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also show for iOS if not in standalone mode
    if (isIosDevice && !window.matchMedia('(display-mode: standalone)').matches) {
        // Delay slightly for better UX
        setTimeout(() => setShowBanner(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-glow-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
             <Download size={24} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base">Install PDF Glow</p>
            <p className="text-xs text-gray-400">
                {isIOS ? 'Add to Home Screen for fullscreen' : 'Install app for offline access'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            {isIOS ? (
                <div className="text-xs text-gray-400 font-medium bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    Tap <Share size={14} /> then "Add to Home Screen"
                </div>
            ) : (
                <button 
                    onClick={handleInstall}
                    className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-md"
                >
                    Install
                </button>
            )}
            <button 
                onClick={() => setShowBanner(false)}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-all"
            >
                <X size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};