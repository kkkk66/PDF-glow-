import React from 'react';

interface AdPlaceholderProps {
  slot?: string;
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className = "" }) => {
  return (
    <div className={`w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 p-4 my-6 overflow-hidden min-h-[100px] ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-widest mb-1">Advertisement</span>
      <span className="text-xs opacity-60">Google AdSense Space</span>
      {/* 
        NOTE: When you get AdSense approval, replace this entire component's return with your actual AdSense code:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
    </div>
  );
};