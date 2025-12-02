import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PdfMerger } from './components/PdfMerger';
import { PdfSplitter } from './components/PdfSplitter';
import { PdfCompressor } from './components/PdfCompressor';
import { PdfToWord } from './components/PdfToWord';
import { JpgToPdf } from './components/JpgToPdf';
import { PdfToJpg } from './components/PdfToJpg';
import { PdfRotate } from './components/PdfRotate';
import { PdfDeletePages } from './components/PdfDeletePages';
import { PdfWatermark } from './components/PdfWatermark';
import { PdfEditor } from './components/PdfEditor';
import { Footer } from './components/Footer';
import { AdPlaceholder } from './components/AdPlaceholder';
import { SeoContent } from './components/SeoContent';
import { PrivacyPolicy, TermsOfService, CookiePolicy, AboutUs } from './components/LegalPages';
import { ContactUs, HelpCenter, ReportIssue } from './components/SupportPages';
import { Layers, Scissors, Minimize2, FileText, Image, Images, RotateCw, Trash2, Stamp, PenTool, ArrowLeft } from 'lucide-react';

// Define all possible views
type ViewState = 
  | 'merge' | 'split' | 'compress' | 'word' | 'jpg' | 'pdftojpg' | 'rotate' | 'delete' | 'watermark' | 'editor'
  | 'privacy' | 'terms' | 'cookies' | 'about'
  | 'contact' | 'help' | 'report';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('merge');

  const tools = [
    { id: 'merge', label: 'Merge', icon: Layers, fullLabel: 'Merge PDFs' },
    { id: 'split', label: 'Split', icon: Scissors, fullLabel: 'Split PDF' },
    { id: 'compress', label: 'Compress', icon: Minimize2, fullLabel: 'Compress PDF' },
    { id: 'editor', label: 'Edit', icon: PenTool, fullLabel: 'Edit PDF' },
    { id: 'word', label: 'To Word', icon: FileText, fullLabel: 'PDF to Word' },
    { id: 'jpg', label: 'JPG to PDF', icon: Image, fullLabel: 'JPG to PDF' },
    { id: 'pdftojpg', label: 'PDF to JPG', icon: Images, fullLabel: 'PDF to JPG' },
    { id: 'rotate', label: 'Rotate', icon: RotateCw, fullLabel: 'Rotate PDF' },
    { id: 'delete', label: 'Delete', icon: Trash2, fullLabel: 'Delete Pages' },
    { id: 'watermark', label: 'Watermark', icon: Stamp, fullLabel: 'Watermark' },
  ];

  const isToolView = tools.some(t => t.id === activeView);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative selection:bg-pink-200 selection:text-pink-900">
      
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-gradient-to-b from-pink-100/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          
          {/* If we are on a support/legal page, show a back button to tools */}
          {!isToolView && (
            <div className="mb-6 animate-fade-in">
              <button 
                onClick={() => setActiveView('merge')}
                className="flex items-center gap-2 text-gray-500 hover:text-glow-600 font-medium transition-colors"
              >
                <ArrowLeft size={20} /> Back to Tools
              </button>
            </div>
          )}

          {/* Header/Hero Section - Only show on Tool Views */}
          {isToolView && (
            <div className="text-center mb-8 md:mb-12 relative z-10 animate-fade-in">
              <span className="inline-block py-1 px-3 rounded-full bg-pink-50 text-pink-600 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 border border-pink-100">
                Powerful & Secure
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-6">
                The Professional <br className="md:hidden" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-400 drop-shadow-sm">
                  PDF Tool
                </span>
              </h1>
              <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
                Fast, client-side PDF tools. No server uploads—your data stays 100% on your device.
              </p>
            </div>
          )}

          {/* Top Advertisement Slot */}
          <div className="max-w-4xl mx-auto">
            <AdPlaceholder className="h-24 md:h-32 mb-8" />
          </div>

          {/* Responsive Tool Switcher - Only show on Tool Views */}
          {isToolView && (
            <div className="mb-10 -mx-4 px-4 md:mx-0 md:px-0 animate-slide-up">
               <div className="flex md:flex-wrap md:justify-center gap-2 overflow-x-auto pb-4 md:pb-0 snap-x hide-scrollbar">
                  {tools.map((tool) => (
                    <button 
                      key={tool.id}
                      onClick={() => setActiveView(tool.id as any)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 snap-center
                        ${activeView === tool.id
                          ? 'bg-white text-glow-600 shadow-md transform scale-105 border border-glow-100' 
                          : 'bg-white/40 text-gray-500 hover:text-gray-700 hover:bg-white border border-transparent'
                        }
                      `}
                    >
                      <tool.icon size={18} />
                      <span className="md:hidden">{tool.label}</span>
                      <span className="hidden md:inline">{tool.fullLabel}</span>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="min-h-[500px]">
            {activeView === 'merge' && <PdfMerger />}
            {activeView === 'split' && <PdfSplitter />}
            {activeView === 'compress' && <PdfCompressor />}
            {activeView === 'editor' && <PdfEditor />}
            {activeView === 'word' && <PdfToWord />}
            {activeView === 'jpg' && <JpgToPdf />}
            {activeView === 'pdftojpg' && <PdfToJpg />}
            {activeView === 'rotate' && <PdfRotate />}
            {activeView === 'delete' && <PdfDeletePages />}
            {activeView === 'watermark' && <PdfWatermark />}
            
            {/* Legal Pages */}
            {activeView === 'privacy' && <PrivacyPolicy />}
            {activeView === 'terms' && <TermsOfService />}
            {activeView === 'cookies' && <CookiePolicy />}
            {activeView === 'about' && <AboutUs />}

            {/* Support Pages */}
            {activeView === 'contact' && <ContactUs />}
            {activeView === 'help' && <HelpCenter />}
            {activeView === 'report' && <ReportIssue />}
          </div>

          {/* Middle Advertisement Slot */}
          <div className="max-w-4xl mx-auto mt-12">
            <AdPlaceholder className="h-64" />
          </div>
          
          {/* SEO Content - Only show on Home/Tool views */}
          {isToolView && <SeoContent />}

          {/* Features Grid - Only show on Home/Tool views */}
          {isToolView && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center max-w-5xl mx-auto">
               <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">100% Secure</h3>
                  <p className="text-gray-500 text-sm">Files never leave your browser. All processing happens locally on your machine.</p>
               </div>
               <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-pink-500">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Blazing Fast</h3>
                  <p className="text-gray-500 text-sm">Optimized pure-code algorithms ensure instant results without waiting for uploads.</p>
               </div>
               <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-500">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">High Quality</h3>
                  <p className="text-gray-500 text-sm">Maintains the original quality of your documents with precise merging and splitting.</p>
               </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer onNavigate={(view) => setActiveView(view as any)} />
    </div>
  );
}

export default App;