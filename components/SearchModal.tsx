
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, FileText, Layers, Scissors, Minimize2, Image, Images, RotateCw, Trash2, Stamp, PenTool, BookOpen, Shield, HelpCircle, Mail, Map, Hash, Grid, Unlock } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'Tools' | 'Pages' | 'Support';
}

const SEARCH_ITEMS: SearchItem[] = [
  // Tools
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: Layers, category: 'Tools' },
  { id: 'split', title: 'Split PDF', description: 'Extract pages from PDF', icon: Scissors, category: 'Tools' },
  { id: 'compress', title: 'Compress PDF', description: 'Reduce file size', icon: Minimize2, category: 'Tools' },
  { id: 'organize', title: 'Organize PDF', description: 'Reorder pages visually', icon: Grid, category: 'Tools' },
  { id: 'editor', title: 'Edit PDF', description: 'Draw, highlight, add text', icon: PenTool, category: 'Tools' },
  { id: 'word', title: 'PDF to Word', description: 'Convert PDF to editable DOCX', icon: FileText, category: 'Tools' },
  { id: 'jpg', title: 'JPG to PDF', description: 'Convert images to PDF', icon: Image, category: 'Tools' },
  { id: 'pdftojpg', title: 'PDF to JPG', description: 'Convert PDF pages to images', icon: Images, category: 'Tools' },
  { id: 'rotate', title: 'Rotate PDF', description: 'Rotate pages left or right', icon: RotateCw, category: 'Tools' },
  { id: 'delete', title: 'Delete Pages', description: 'Remove specific pages', icon: Trash2, category: 'Tools' },
  { id: 'unlock', title: 'Unlock PDF', description: 'Remove PDF password', icon: Unlock, category: 'Tools' },
  { id: 'watermark', title: 'Watermark', description: 'Add text stamp to PDF', icon: Stamp, category: 'Tools' },
  { id: 'pagenumbers', title: 'Page Numbers', description: 'Add page numbers to PDF', icon: Hash, category: 'Tools' },
  
  // Pages
  { id: 'blog', title: 'Blog & Tips', description: 'PDF guides and tutorials', icon: BookOpen, category: 'Pages' },
  { id: 'privacy', title: 'Privacy Policy', description: 'How we handle your data', icon: Shield, category: 'Pages' },
  { id: 'terms', title: 'Terms of Service', description: 'Usage agreement', icon: FileText, category: 'Pages' },
  { id: 'about', title: 'About Us', description: 'Our mission and story', icon: FileText, category: 'Pages' },
  { id: 'sitemap', title: 'Sitemap', description: 'List of all pages', icon: Map, category: 'Pages' },
  
  // Support
  { id: 'contact', title: 'Contact Us', description: 'Get in touch via Email or Phone', icon: Mail, category: 'Support' },
  { id: 'help', title: 'Help Center', description: 'WhatsApp Support', icon: HelpCircle, category: 'Support' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = SEARCH_ITEMS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onNavigate(id);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-slide-up">
        {/* Header / Input */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-100">
          <Search className="text-gray-400 w-6 h-6" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search for tools (e.g., merge, split, privacy)..." 
            className="flex-1 text-lg outline-none text-gray-800 placeholder:text-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-2 custom-scrollbar">
           {filteredItems.length === 0 ? (
             <div className="text-center py-12 text-gray-400">
               <p>No results found for "{query}"</p>
             </div>
           ) : (
             <div className="space-y-1">
               {filteredItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleSelect(item.id)}
                   className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                 >
                   <div className={`p-3 rounded-lg ${item.category === 'Tools' ? 'bg-glow-50 text-glow-600' : 'bg-gray-100 text-gray-600'}`}>
                     <item.icon size={20} />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                       {item.title}
                       <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                         {item.category}
                       </span>
                     </h4>
                     <p className="text-sm text-gray-500">{item.description}</p>
                   </div>
                   <ArrowRight size={16} className="text-gray-300 group-hover:text-glow-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                 </button>
               ))}
             </div>
           )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-3 text-xs text-gray-400 text-center border-t border-gray-100">
          Press ESC to close
        </div>
      </div>
      
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};
