import React from 'react';
import { Shield, FileText, Cookie, Info, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 my-8 animate-fade-in-up">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-green-100 text-green-600 rounded-xl">
        <Shield size={24} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
    </div>
    
    <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
      <p className="lead text-sm text-gray-400">Last Updated: October 2024</p>
      
      <h3 className="text-xl font-bold text-gray-800">1. Introduction</h3>
      <p>Welcome to PDF Glow. We prioritize your privacy above all else. Unlike other PDF tools, we have built our service to operate <strong>Client-Side</strong>.</p>

      <h3 className="text-xl font-bold text-gray-800">2. How We Process Your Files</h3>
      <p>When you use our tools (Merge, Split, Compress, etc.), your files <strong>never leave your device</strong>. They are processed locally within your web browser using WebAssembly technology. We do not upload, store, or view your documents on our servers.</p>

      <h3 className="text-xl font-bold text-gray-800">3. Data Collection</h3>
      <p>Since we do not upload your files, we collect <strong>zero</strong> data regarding the content of your documents. We may use anonymous analytics (like Google Analytics) to track general website usage (e.g., number of visitors), but this is never linked to your specific files.</p>

      <h3 className="text-xl font-bold text-gray-800">4. Advertising</h3>
      <p>We use third-party advertising companies (like Google AdSense) to serve ads when you visit our web application. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>

      <h3 className="text-xl font-bold text-gray-800">5. Contact</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:pdfglow@gmail.com" className="text-glow-600 font-medium">pdfglow@gmail.com</a>.</p>
    </div>
  </div>
);

export const TermsOfService: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 my-8 animate-fade-in-up">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
        <FileText size={24} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
    </div>

    <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
      <h3 className="text-xl font-bold text-gray-800">1. Acceptance of Terms</h3>
      <p>By accessing and using PDF Glow, you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h3 className="text-xl font-bold text-gray-800">2. Use of Service</h3>
      <p>PDF Glow provides free online PDF manipulation tools. You agree to use these tools only for lawful purposes. You are responsible for the content of the files you process.</p>

      <h3 className="text-xl font-bold text-gray-800">3. Disclaimer of Warranties</h3>
      <p>The service is provided "as is". While we strive for perfection, we cannot guarantee that the conversion will always be error-free. We are not liable for any data loss, although the risk is minimal due to our client-side architecture.</p>

      <h3 className="text-xl font-bold text-gray-800">4. Changes to Terms</h3>
      <p>We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
    </div>
  </div>
);

export const CookiePolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 my-8 animate-fade-in-up">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
        <Cookie size={24} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
    </div>

    <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
      <p>This policy explains how PDF Glow uses cookies and similar technologies.</p>

      <h3 className="text-xl font-bold text-gray-800">1. What are Cookies?</h3>
      <p>Cookies are small text files stored on your device when you visit a website. They help the website function properly and provide analytics info.</p>

      <h3 className="text-xl font-bold text-gray-800">2. How We Use Cookies</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Essential Cookies:</strong> Required for the website to work (e.g., remembering your session).</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how many users visit our site.</li>
        <li><strong>Advertising Cookies:</strong> Used by Google AdSense to show relevant ads.</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-800">3. Managing Cookies</h3>
      <p>You can choose to disable cookies through your browser settings, though this may affect some website functionality.</p>
    </div>
  </div>
);

export const AboutUs: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 my-8 animate-fade-in-up">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
        <Info size={24} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
    </div>

    <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
      <p className="text-lg leading-relaxed">
        Hello! We are a passionate team of <strong>Web Application Developers</strong> dedicated to building high-quality, accessible online tools.
      </p>

      <div className="bg-glow-50 border-l-4 border-glow-500 p-6 my-6 rounded-r-xl">
        <p className="italic text-gray-700 font-medium">
          "Hamara mission hai ki hum best PDF tools provide karein jo sabke liye 100% Free ho."
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
      <p>
        PDF Glow was created to solve a simple problem: processing PDF files should be fast, free, and secure. 
        Most online tools force you to upload private files to their servers. We changed that by using advanced browser technology.
      </p>
      <p>
        Hum abhi is web application ko or improve kar rahe hain. Naye features add kiye ja rahe hain taaki aapko best experience mile. 
        Hamari koshish hai ki sab kuch perfectly kaam kare (sab thik hai) aur aap bina kisi pareshani ke apne PDF tasks complete kar sakein.
      </p>

      <h3 className="text-xl font-bold text-gray-800">Contact Developers</h3>
      <p>
        We love feedback! If you have suggestions or want to report a bug, please reach out via our Support section below.
      </p>
      
      <div className="flex items-center gap-2 mt-4 text-glow-600">
        <Mail size={18} />
        <a href="mailto:pdfglow@gmail.com" className="font-medium hover:underline">pdfglow@gmail.com</a>
      </div>
    </div>
  </div>
);