import React from 'react';
import { Shield, FileText, Cookie, Info, Mail, CheckCircle, Users, Globe } from 'lucide-react';

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
      <p>You can choose to disable cookies through your browser settings, though this may affect some website functionality. You can also accept or decline cookies via our banner.</p>
    </div>
  </div>
);

export const AboutUs: React.FC = () => (
  <div className="max-w-4xl mx-auto animate-fade-in-up">
    
    {/* Hero Section */}
    <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="relative z-10">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Info size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">About PDF Glow</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                We are a dedicated team of developers and privacy advocates with a simple mission: 
                <span className="text-gray-900 font-semibold"> To make PDF tools free, secure, and accessible to everyone.</span>
            </p>
        </div>
    </div>

    {/* Content Grid */}
    <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="text-glow-500" />
                Our Story
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
                PDF Glow was born from a frustration with existing online tools. Most services require you to upload your sensitive documents to their servers, creating privacy risks and delays.
            </p>
            <p className="text-gray-600 leading-relaxed">
                We asked: <em>"Why can't the browser handle this?"</em>
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
                Using cutting-edge WebAssembly technology, we built a platform where all processing happens <strong>Client-Side</strong>. Your files stay on your device, ensuring maximum security and lightning-fast performance.
            </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                Why Trust Us?
            </h3>
            <ul className="space-y-4">
                <li className="flex gap-3">
                    <Shield className="text-gray-400 flex-shrink-0" size={20} />
                    <span className="text-gray-600 text-sm"><strong>Privacy First:</strong> We physically cannot see your files. They never leave your computer.</span>
                </li>
                <li className="flex gap-3">
                    <Users className="text-gray-400 flex-shrink-0" size={20} />
                    <span className="text-gray-600 text-sm"><strong>Community Driven:</strong> Built based on feedback from students and professionals.</span>
                </li>
                <li className="flex gap-3">
                    <CheckCircle className="text-gray-400 flex-shrink-0" size={20} />
                    <span className="text-gray-600 text-sm"><strong>100% Free:</strong> We are supported by ads so we can keep this tool free forever.</span>
                </li>
            </ul>
        </div>
    </div>

    {/* Contact Section */}
    <div className="bg-gray-900 text-white p-8 md:p-12 rounded-3xl text-center">
        <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
        <p className="text-gray-400 mb-8">Have a suggestion or found a bug? We'd love to hear from you.</p>
        <div className="flex justify-center items-center gap-2 text-lg">
            <Mail className="text-glow-400" />
            <a href="mailto:pdfglow@gmail.com" className="font-bold hover:text-glow-400 transition-colors">pdfglow@gmail.com</a>
        </div>
    </div>
  </div>
);