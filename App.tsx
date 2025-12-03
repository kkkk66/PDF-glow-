import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
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
import { InstallPwa } from './components/InstallPwa';
import { PrivacyPolicy, TermsOfService, CookiePolicy, AboutUs } from './components/LegalPages';
import { ContactUs, HelpCenter, ReportIssue } from './components/SupportPages';
import { Layers, Scissors, Minimize2, FileText, Image, Images, RotateCw, Trash2, Stamp, PenTool, ArrowLeft, Home } from 'lucide-react';

// Define all possible views
type ViewState = 
  | 'home'
  | 'merge' | 'split' | 'compress' | 'word' | 'jpg' | 'pdftojpg' | 'rotate' | 'delete' | 'watermark' | 'editor'
  | 'privacy' | 'terms' | 'cookies' | 'about'
  | 'contact' | 'help' | 'report';

function App() {
  // DEFAULT VIEW IS HOME
  const [activeView, setActiveView] = useState<ViewState>('home');

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
  const isHomeView = activeView === 'home';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative selection:bg-pink-200 selection:text-pink-900">
      
      {/* Mobile App Install Banner */}
      <InstallPwa />

      <Navbar onNavigate={(view) => setActiveView(view as any)} activeView={activeView} />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-gradient-to-b from-pink-100/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          
          {/* Back to Home Button (Visible on all pages except Home) */}
          {!isHomeView && (
            <div className="mb-6 animate-fade-in flex justify-between items-center">
              <button 
                onClick={() => setActiveView('home')}
                className="flex items-center gap-2 text-gray-500 hover:text-glow-600 font-medium transition-colors"
              >
                <ArrowLeft size={20} /> Back to Home
              </button>
            </div>
          )}

          {/* Render Home Page */}
          {activeView === 'home' && <HomePage onNavigate={(view) => setActiveView(view)} />}

          {/* Render Tool Switcher (Only visible when a tool is active, for quick switching) */}
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

          {/* Render Active Tool Content */}
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

          {/* Footer Ad & Content (Visible on all pages except Home, because Home has its own) */}
          {!isHomeView && (
            <>
                <div className="max-w-4xl mx-auto mt-12">
                    <AdPlaceholder className="h-32" />
                </div>
                {/* SEO Content only on tool views to aid relevance */}
                {isToolView && <SeoContent />}
            </>
          )}
        </div>
      </main>
      
      <Footer onNavigate={(view) => setActiveView(view as any)} />
    </div>
  );
}

export default App;