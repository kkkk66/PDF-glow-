import React from 'react';
import { HelpCircle, Shield, Zap, Globe } from 'lucide-react';

export const SeoContent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-600">
      
      {/* Introduction Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose PDF Glow for Your Document Needs?</h2>
        <p className="mb-4 leading-relaxed">
          PDF Glow offers a comprehensive suite of online PDF tools designed for professionals, students, and businesses. 
          Unlike other platforms, we prioritize your privacy by processing all files <strong>directly in your browser</strong> (Client-Side). 
          This means your sensitive documents never leave your device and are never uploaded to a remote server.
        </p>
        <p className="leading-relaxed">
          Whether you need to merge multiple reports, split a large ebook, compress files for email, or convert images to PDF, 
          our tools are optimized for speed and reliability. No registration is required, and there are no hidden limits on file usage.
        </p>
      </div>

      {/* Features Grid for SEO */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-glow-500" />
            <h3 className="text-xl font-bold text-gray-800">100% Secure & Private</h3>
          </div>
          <p>We use advanced WebAssembly technology to handle PDF manipulation locally. Your data stays safe on your computer.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="text-glow-500" />
            <h3 className="text-xl font-bold text-gray-800">Lightning Fast</h3>
          </div>
          <p>No waiting for uploads or downloads. Processing happens instantly, saving you valuable time on every task.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="text-glow-500" />
            <h3 className="text-xl font-bold text-gray-800">Universal Compatibility</h3>
          </div>
          <p>Works perfectly on Windows, Mac, Linux, iPhone, and Android devices without installing any software.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <HelpCircle className="text-glow-500" />
                <h3 className="text-xl font-bold text-gray-800">Easy to Use</h3>
            </div>
            <p>Simple, intuitive interface designed for everyone. Merge, Split, or Edit PDFs with just a few clicks.</p>
        </div>
      </div>

      {/* FAQ Section - Crucial for AdSense "Valuable Inventory" */}
      <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Is PDF Glow really free?</h3>
            <p>Yes! All our tools including PDF Merge, Split, Compress, and Convert are completely free to use. We are supported by advertisements, allowing us to keep this service free for everyone.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Are my files saved on your server?</h3>
            <p>No. We use client-side technology. Your files are processed by your own browser and never transmitted to our servers. This ensures maximum privacy for your documents.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Can I use this on my mobile phone?</h3>
            <p>Absolutely. PDF Glow is fully responsive and works great on iOS and Android browsers. You can convert photos to PDF or compress files directly from your phone.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Is there a limit on file size?</h3>
            <p>Since files are processed on your device, the limit depends mostly on your device's memory (RAM). Most modern devices can handle very large PDFs without issues.</p>
          </div>
        </div>
      </div>

    </div>
  );
};