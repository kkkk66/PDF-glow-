
import React, { useEffect, useRef } from 'react';

interface AdPlaceholderProps {
  slot?: string;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  client?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  slot = "1234567890", 
  client = "ca-pub-XXXXXXXXXXXXXXXX", // Replace with your actual Publisher ID
  className = "",
  format = "auto"
}) => {
  const adRef = useRef<HTMLModElement>(null);

  // Determine if we should show the real ad or the placeholder
  // Safely check for dev environment
  const isDev = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || 
                (typeof import.meta !== 'undefined' && import.meta.env?.DEV);
                
  const isDefaultClient = client === "ca-pub-XXXXXXXXXXXXXXXX";
  const showAd = !isDev && !isDefaultClient;

  useEffect(() => {
    // Only execute if window is defined (client-side) and we are supposed to show an ad
    if (typeof window === 'undefined' || !showAd) return;

    // Prevent pushing if component is not mounted or slot is already filled
    // AdSense sets 'data-ad-status' attribute when filled
    if (adRef.current && !adRef.current.getAttribute('data-ad-status')) {
      try {
         // Ensure adsbygoogle array exists
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // Ignore "All 'ins' elements... already have ads" error
        // This is common in SPAs/React when re-rendering
        // console.warn("AdSense push ignored");
      }
    }
  }, [showAd]); // Run when showAd status is determined

  return (
    <div className={`w-full flex justify-center my-6 overflow-hidden ${className}`}>
      {showAd ? (
         <ins 
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
         />
      ) : (
        <div className="w-full bg-gray-50 border border-gray-200 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 p-4 min-h-[150px]">
            <span className="text-[10px] font-bold uppercase tracking-widest mb-1 bg-gray-200 px-2 py-0.5 rounded text-gray-500">Ad Space</span>
            <span className="text-xs opacity-60">Google AdSense Area</span>
            <span className="text-[10px] text-gray-300 mt-2">
                {isDev ? '(Development Mode)' : '(Set Client ID to Activate)'}
            </span>
        </div>
      )}
    </div>
  );
};

// Add type definition for window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
