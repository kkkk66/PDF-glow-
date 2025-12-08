import React, { useEffect, useRef } from 'react';

interface AdProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

export const HighPerformanceAd: React.FC<AdProps> = ({ adKey, width, height, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      // Clear previous content
      adRef.current.innerHTML = '';

      const container = document.createElement('div');
      
      // Script 1: Configuration
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.text = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;

      // Script 2: Invocation
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

      // Append scripts safely
      container.appendChild(confScript);
      container.appendChild(invokeScript);
      
      adRef.current.appendChild(container);
    }
  }, [adKey, width, height]);

  return (
    <div className={`flex justify-center items-center overflow-hidden my-6 ${className}`}>
      <div 
        ref={adRef} 
        style={{ width: width, height: height }}
        className="bg-gray-50 flex justify-center items-center"
      >
        {/* Ad will be injected here */}
      </div>
    </div>
  );
};