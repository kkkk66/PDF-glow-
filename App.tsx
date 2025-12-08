import React, { useState, useEffect } from 'react';
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
import { PdfPageNumbers } from './components/PdfPageNumbers';
import { PdfOrganizer } from './components/PdfOrganizer';
import { BlogPage } from './components/BlogPage';
import { ToolContent } from './components/ToolContent';
import { Footer } from './components/Footer';
import { AdPlaceholder } from './components/AdPlaceholder';
import { SeoContent } from './components/SeoContent';
import { InstallPwa } from './components/InstallPwa';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicy, TermsOfService, CookiePolicy, AboutUs } from './components/LegalPages';
import { ContactUs, HelpCenter, ReportIssue } from './components/SupportPages';
import { Sitemap } from './components/Sitemap';
import { Layers, Scissors, Minimize2, FileText, Image, Images, RotateCw, Trash2, Stamp, PenTool, ArrowLeft, Hash, Grid } from 'lucide-react';

// Define all possible views
type ViewState = 
  | 'home' | 'blog'
  | 'merge' | 'split' | 'compress' | 'word' | 'jpg' | 'pdftojpg' | 'rotate' | 'delete' | 'watermark' | 'editor' | 'pagenumbers' | 'organize'
  | 'privacy' | 'terms' | 'cookies' | 'about'
  | 'contact' | 'help' | 'report' | 'sitemap';

// --- ROUTE CONFIGURATION ---
// Central source of truth for URL structure
export const ROUTES: Record<ViewState, string> = {
  home: '/',
  blog: '/blog',
  merge: '/tools/merge-pdf',
  split: '/tools/split-pdf',
  compress: '/tools/compress-pdf',
  organize: '/tools/organize-pdf',
  editor: '/tools/edit-pdf',
  word: '/tools/pdf-to-word',
  jpg: '/tools/jpg-to-pdf',
  pdftojpg: '/tools/pdf-to-jpg',
  rotate: '/tools/rotate-pdf',
  delete: '/tools/delete-pdf-pages',
  watermark: '/tools/add-watermark',
  pagenumbers: '/tools/page-numbers',
  privacy: '/privacy-policy',
  terms: '/terms-of-service',
  cookies: '/cookie-policy',
  about: '/about-us',
  contact: '/contact-us',
  help: '/help-center',
  report: '/report-issue',
  sitemap: '/sitemap'
};

function App() {
  // Helper to determine view from current window location path
  const getPathView = (): ViewState => {
    const path = window.location.pathname;
    
    // Find the view key that matches the current path
    const view = (Object.keys(ROUTES) as ViewState[]).find(key => ROUTES[key] === path);
    
    // Default to home if no match found
    return view || 'home';
  };

  const [activeView, setActiveView] = useState<ViewState>(getPathView);

  // Sync with browser history and Update Page Title (Critical for SEO/AdSense)
  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getPathView());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    
    // Also handle initial load to handle redirects/rewrites correctly
    setActiveView(getPathView());

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update Page Title and Meta dynamically based on active view
  useEffect(() => {
    const titles: Record<string, string> = {
      home: "PDF Glow - Free Online PDF Tools | Merge, Split, Edit & Compress",
      blog: "PDF Tips & Tricks Blog - PDF Glow",
      merge: "Merge PDF Files Free Online - Combine PDFs - PDF Glow",
      split: "Split PDF Files Online - Extract Pages Free - PDF Glow",
      compress: "Compress PDF Online - Reduce File Size Free - PDF Glow",
      word: "Convert PDF to Word (DOCX) Free - PDF Glow",
      jpg: "Convert JPG Images to PDF Online - PDF Glow",
      pdftojpg: "Convert PDF to JPG Images High Quality - PDF Glow",
      editor: "Edit PDF Online Free - Draw & Add Text - PDF Glow",
      rotate: "Rotate PDF Pages Online - PDF Glow",
      delete: "Delete PDF Pages Online - PDF Glow",
      watermark: "Add Watermark to PDF Free - PDF Glow",
      pagenumbers: "Add Page Numbers to PDF Online - PDF Glow",
      organize: "Organize PDF Pages - Reorder & Sort Online - PDF Glow",
      privacy: "Privacy Policy - PDF Glow",
      terms: "Terms of Service - PDF Glow",
      about: "About Us - PDF Glow",
      cookies: "Cookie Policy - PDF Glow",
      sitemap: "Sitemap - Site Directory | PDF Glow"
    };
    
    document.title = titles[activeView] || "PDF Glow - Professional PDF Tools";
    
    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        if (activeView === 'home') {
            metaDesc.setAttribute('content', "Secure, free, and fast online PDF tools. Merge, split, compress, edit, and convert PDFs entirely in your browser.");
        } else if (titles[activeView]) {
            metaDesc.setAttribute('content', `Use PDF Glow's ${activeView} tool to manage your documents securely. Client-side processing ensures 100% privacy.`);
        }
    }
    
    // Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', `https://pdf-glow.vercel.app${ROUTES[activeView]}`);

  }, [activeView]);

  // Navigate function using History API
  const handleNavigate = (view: string) => {
    const targetView = view as ViewState;
    if (ROUTES[targetView]) {
      window.history.pushState({}, '', ROUTES[targetView]);
      setActiveView(targetView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const tools = [
    { id: 'merge', label: 'Merge', icon: Layers, fullLabel: 'Merge PDFs' },
    { id: 'split', label: 'Split', icon: Scissors, fullLabel: 'Split PDF' },
    { id: 'compress', label: 'Compress', icon: Minimize2, fullLabel: 'Compress PDF' },
    { id: 'organize', label: 'Organize', icon: Grid, fullLabel: 'Organize PDF' },
    { id: 'editor', label: 'Edit', icon: PenTool, fullLabel: 'Edit PDF' },
    { id: 'word', label: 'To Word', icon: FileText, fullLabel: 'PDF to Word' },
    { id: 'jpg', label: 'JPG to PDF', icon: Image, fullLabel: 'JPG to PDF' },
    { id: 'pdftojpg', label: 'PDF to JPG', icon: Images, fullLabel: 'PDF to JPG' },
    { id: 'rotate', label: 'Rotate', icon: RotateCw, fullLabel: 'Rotate PDF' },
    { id: 'delete', label: 'Delete', icon: Trash2, fullLabel: 'Delete Pages' },
    { id: 'watermark', label: 'Watermark', icon: Stamp, fullLabel: 'Watermark' },
    { id: 'pagenumbers', label: 'Numbers', icon: Hash, fullLabel: 'Page Numbers' },
  ];

  const isToolView = tools.some(t => t.id === activeView);
  const isHomeView = activeView === 'home';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative selection:bg-pink-200 selection:text-pink-900">
      
      {/* Monetization & Compliance Components */}
      <InstallPwa />
      <CookieConsent />

      <Navbar onNavigate={handleNavigate} activeView={activeView} />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-gradient-to-b from-pink-100/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          
          {/* Back to Home Button (Visible on all pages except Home) */}
          {!isHomeView && (
            <div className="mb-6 animate-fade-in flex justify-between items-center">
              <a 
                href="/"
                onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
                className="flex items-center gap-2 text-gray-500 hover:text-glow-600 font-medium transition-colors"
              >
                <ArrowLeft size={20} /> Back to Home
              </a>
            </div>
          )}

          {/* Render Home Page */}
          {activeView === 'home' && <HomePage onNavigate={handleNavigate} />}
          
          {/* Render Blog Page */}
          {activeView === 'blog' && <BlogPage />}

          {/* Render Tool Switcher (Only visible when a tool is active, for quick switching) */}
          {isToolView && (
            <div className="mb-10 -mx-4 px-4 md:mx-0 md:px-0 animate-slide-up">
               <div className="flex md:flex-wrap md:justify-center gap-2 overflow-x-auto pb-4 md:pb-0 snap-x hide-scrollbar">
                  {tools.map((tool) => (
                    <a 
                      key={tool.id}
                      href={ROUTES[tool.id as ViewState]}
                      onClick={(e) => { e.preventDefault(); handleNavigate(tool.id); }}
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
                    </a>
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
            {activeView === 'pagenumbers' && <PdfPageNumbers />}
            {activeView === 'organize' && <PdfOrganizer />}
            
            {/* Legal Pages */}
            {activeView === 'privacy' && <PrivacyPolicy />}
            {activeView === 'terms' && <TermsOfService />}
            {activeView === 'cookies' && <CookiePolicy />}
            {activeView === 'about' && <AboutUs />}

            {/* Support Pages */}
            {activeView === 'contact' && <ContactUs />}
            {activeView === 'help' && <HelpCenter />}
            {activeView === 'report' && <ReportIssue />}
            
            {/* Sitemap */}
            {activeView === 'sitemap' && <Sitemap onNavigate={handleNavigate} />}
          </div>
          
          {/* Tool Specific SEO Content (Crucial for AdSense) */}
          {isToolView && <ToolContent toolId={activeView} />}

          {/* Footer Ad & Content (Visible on all pages except Home) */}
          {!isHomeView && (
            <>
                <div className="max-w-4xl mx-auto mt-12">
                    <AdPlaceholder className="h-32" />
                </div>
            </>
          )}
        </div>
      </main>
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;