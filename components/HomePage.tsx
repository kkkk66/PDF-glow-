import React from 'react';
import { AdPlaceholder } from './AdPlaceholder';
import { Layers, Upload, Download, ArrowRight, Star, Shield, Zap, MousePointer2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <div className="text-center py-12 md:py-20 relative">
        <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6 animate-fade-in-up">
          <Star size={14} className="fill-pink-600" />
          <span>#1 Free PDF Tool</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          Manage Your PDFs <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-glow-500 to-purple-600">
            Like a Pro
          </span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Merge, Split, Compress, and Edit documents directly in your browser. 
          100% Free. No software to install. No file uploads.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onNavigate('merge')}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Now <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => {
              document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 transition-all"
          >
            How it Works
          </button>
        </div>
      </div>

      {/* 2. PRIMARY ADVERTISEMENT (Above Fold) */}
      <div className="my-12">
        <div className="text-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sponsored</span>
        </div>
        <AdPlaceholder className="h-[250px] shadow-sm bg-white" />
      </div>

      {/* 3. HOW TO USE SECTION (With "Screenshots") */}
      <div id="how-to-use" className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Use PDF Glow</h2>
          <p className="text-gray-500">Three simple steps to perfect documents.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-bl-2xl text-xl">01</div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Choose a Tool</h3>
              <p className="text-gray-500 text-sm">Select from our wide range of PDF tools like Merge, Split, or Compress.</p>
            </div>
            
            {/* Mockup Screenshot */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 aspect-[4/3] flex flex-col gap-2">
               <div className="w-full h-8 bg-white rounded-lg shadow-sm flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
               </div>
               <div className="flex-1 bg-white rounded-lg shadow-sm p-4 grid grid-cols-2 gap-2 content-center">
                  <div className="bg-blue-50 p-2 rounded-lg flex flex-col items-center justify-center gap-1 border border-blue-100">
                     <Layers size={16} className="text-blue-500" />
                     <div className="w-8 h-1 bg-blue-200 rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center justify-center gap-1 border border-gray-100">
                     <div className="w-4 h-4 bg-gray-300 rounded-md"></div>
                     <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="col-span-2 bg-pink-50 p-2 rounded-lg flex items-center justify-center border border-pink-100">
                     <MousePointer2 size={16} className="text-pink-500 absolute ml-4 mt-4 fill-pink-500" />
                  </div>
               </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 bg-pink-50 text-pink-600 font-bold px-4 py-2 rounded-bl-2xl text-xl">02</div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Files</h3>
              <p className="text-gray-500 text-sm">Drag & drop your files. They are processed instantly in your browser.</p>
            </div>
            
            {/* Mockup Screenshot */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 aspect-[4/3] flex items-center justify-center">
               <div className="w-full h-full bg-white rounded-lg border-2 border-dashed border-pink-200 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center">
                     <Upload size={20} className="text-pink-500" />
                  </div>
                  <div className="w-20 h-2 bg-gray-100 rounded-full"></div>
               </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 bg-green-50 text-green-600 font-bold px-4 py-2 rounded-bl-2xl text-xl">03</div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Download</h3>
              <p className="text-gray-500 text-sm">Get your new file instantly. No watermarks, no registration required.</p>
            </div>
            
            {/* Mockup Screenshot */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 aspect-[4/3] flex items-center justify-center relative">
               <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 w-3/4 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                     <Download size={16} className="text-green-600" />
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-2"></div>
                  <div className="w-1/2 h-2 bg-gray-100 rounded-full mx-auto"></div>
               </div>
               <div className="absolute -right-2 -bottom-2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">Success!</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SECONDARY ADVERTISEMENT (Mid Page) */}
      <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdPlaceholder className="h-[280px] bg-white shadow-sm" />
        <AdPlaceholder className="h-[280px] bg-white shadow-sm" />
      </div>

      {/* 5. WHY CHOOSE US */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-white text-center my-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
        <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Everyone Loves PDF Glow</h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <Shield className="w-10 h-10 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">100% Secure</h3>
                    <p className="text-gray-400 text-sm">Files never leave your device. We use browser-based technology.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Instant Speed</h3>
                    <p className="text-gray-400 text-sm">No uploading or downloading wait times. It happens instantly.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <Star className="w-10 h-10 text-pink-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                    <p className="text-gray-400 text-sm">Professional grade output without the premium price tag.</p>
                </div>
            </div>
        </div>
      </div>

      {/* 6. BOTTOM ADVERTISEMENT */}
      <div className="my-12">
        <AdPlaceholder className="h-[200px] bg-gray-50" />
      </div>

      {/* 7. CTA */}
      <div className="text-center pb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to get started?</h2>
        <div className="flex flex-wrap justify-center gap-4">
            <button 
                onClick={() => onNavigate('merge')}
                className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-pink-glow"
            >
                Merge PDF
            </button>
            <button 
                onClick={() => onNavigate('compress')}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md"
            >
                Compress PDF
            </button>
            <button 
                onClick={() => onNavigate('jpg')}
                className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600 transition-all shadow-md"
            >
                JPG to PDF
            </button>
        </div>
      </div>

    </div>
  );
};