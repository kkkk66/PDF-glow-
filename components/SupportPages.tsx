import React from 'react';
import { Mail, Phone, MessageCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const ContactUs: React.FC = () => (
  <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 my-8 animate-fade-in-up">
    <div className="text-center mb-10">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
        <Mail size={32} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500">We are here to help you with any questions or feedback.</p>
    </div>

    <div className="grid gap-6">
      {/* Email Card */}
      <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-glow-200 transition-colors">
        <div className="p-4 bg-white rounded-full shadow-sm text-glow-500">
          <Mail size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Us</p>
          <a href="mailto:pdfglow@gmail.com" className="text-xl font-bold text-gray-800 hover:text-glow-600 break-all">
            pdfglow@gmail.com
          </a>
          <p className="text-xs text-gray-400 mt-1">Tap to send email</p>
        </div>
      </div>

      {/* Phone Card */}
      <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-glow-200 transition-colors">
        <div className="p-4 bg-white rounded-full shadow-sm text-glow-500">
          <Phone size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Call Us</p>
          <a href="tel:6230919846" className="text-xl font-bold text-gray-800 hover:text-glow-600">
            +91 6230919846
          </a>
          <p className="text-xs text-gray-400 mt-1">Tap to call now</p>
        </div>
      </div>
    </div>
  </div>
);

export const HelpCenter: React.FC = () => (
  <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 my-8 animate-fade-in-up">
    <div className="text-center mb-10">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
        <MessageCircle size={32} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
      <p className="text-gray-500">Get instant support directly via WhatsApp.</p>
    </div>

    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 md:p-12 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Quick Assistance?</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Our support team is available on WhatsApp to answer your queries instantly. 
        Click the button below to start a chat.
      </p>
      
      <a 
        href="https://wa.me/916230919846" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:shadow-xl hover:bg-green-600 transition-all transform hover:-translate-y-1"
      >
        <MessageCircle size={24} />
        Chat on WhatsApp
      </a>
      
      <div className="mt-6 flex justify-center items-center gap-2 text-sm text-gray-500">
        <Phone size={14} /> <span>+91 6230919846</span>
      </div>
    </div>
  </div>
);

export const ReportIssue: React.FC = () => (
  <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 my-8 animate-fade-in-up">
    <div className="text-center mb-10">
      <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
      <p className="text-gray-500">Found a bug? Let us know so we can fix it immediately.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
        <a 
          href="mailto:pdfglow@gmail.com?subject=Bug Report - PDF Glow" 
          className="flex flex-col items-center justify-center p-8 border-2 border-gray-100 rounded-3xl hover:border-glow-200 hover:bg-glow-50 transition-all cursor-pointer group text-center"
        >
            <div className="p-4 bg-white rounded-full shadow-sm text-gray-400 group-hover:text-glow-500 mb-4 transition-colors">
              <Mail size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Report via Email</h3>
            <p className="text-sm text-gray-500">Send us details about the issue via email.</p>
            <span className="mt-4 text-glow-600 font-semibold flex items-center gap-1 text-sm">
              Send Email <ArrowRight size={16} />
            </span>
        </a>

        <a 
          href="https://wa.me/916230919846?text=Hi, I found an issue with PDF Glow app:" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-8 border-2 border-gray-100 rounded-3xl hover:border-green-200 hover:bg-green-50 transition-all cursor-pointer group text-center"
        >
            <div className="p-4 bg-white rounded-full shadow-sm text-gray-400 group-hover:text-green-500 mb-4 transition-colors">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Report via WhatsApp</h3>
            <p className="text-sm text-gray-500">Fastest way to report critical bugs.</p>
            <span className="mt-4 text-green-600 font-semibold flex items-center gap-1 text-sm">
              Chat Now <ArrowRight size={16} />
            </span>
        </a>
    </div>
  </div>
);