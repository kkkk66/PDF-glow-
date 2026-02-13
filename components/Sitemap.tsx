
import React from 'react';
import { Layers, Scissors, Minimize2, FileText, Image, Images, RotateCw, Trash2, Stamp, PenTool, BookOpen, Shield, HelpCircle, Mail, Map, ArrowRight, Hash, Grid, Unlock } from 'lucide-react';
import { ROUTES } from '../App';

interface SitemapProps {
  onNavigate: (view: string) => void;
}

export const Sitemap: React.FC<SitemapProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, href: string, view: string) => {
    e.preventDefault();
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    {
      title: "PDF Manipulation Tools",
      description: "Core utilities to manage PDF structure.",
      items: [
        { label: "Merge PDF", view: "merge", href: ROUTES.merge, icon: Layers, desc: "Combine multiple PDF documents into a single unified file." },
        { label: "Split PDF", view: "split", href: ROUTES.split, icon: Scissors, desc: "Extract specific pages or split a document into individual pages." },
        { label: "Compress PDF", view: "compress", href: ROUTES.compress, icon: Minimize2, desc: "Reduce file size while maintaining document quality." },
        { label: "Organize PDF", view: "organize", href: ROUTES.organize, icon: Grid, desc: "Rearrange, sort, and reorder pages visually." },
        { label: "Rotate PDF", view: "rotate", href: ROUTES.rotate, icon: RotateCw, desc: "Permanently rotate PDF pages 90, 180, or 270 degrees." },
        { label: "Delete Pages", view: "delete", href: ROUTES.delete, icon: Trash2, desc: "Remove unwanted pages from your PDF document." },
        { label: "Add Page Numbers", view: "pagenumbers", href: ROUTES.pagenumbers, icon: Hash, desc: "Add sequential page numbers to your document." },
      ]
    },
    {
      title: "Converters & Editing",
      description: "Transform and modify your documents.",
      items: [
        { label: "PDF to Word", view: "word", href: ROUTES.word, icon: FileText, desc: "Convert PDF documents to editable Microsoft Word (.docx) files." },
        { label: "JPG to PDF", view: "jpg", href: ROUTES.jpg, icon: Image, desc: "Convert images (JPG, PNG) into a PDF document." },
        { label: "PDF to JPG", view: "pdftojpg", href: ROUTES.pdftojpg, icon: Images, desc: "Extract pages from a PDF and save them as high-quality images." },
        { label: "Edit PDF", view: "editor", href: ROUTES.editor, icon: PenTool, desc: "Add text, highlights, and drawings to your PDF." },
        { label: "Unlock PDF", view: "unlock", href: ROUTES.unlock, icon: Unlock, desc: "Remove passwords and security restrictions." },
        { label: "Watermark", view: "watermark", href: ROUTES.watermark, icon: Stamp, desc: "Stamp text watermarks on your document for security." },
      ]
    },
    {
      title: "Resources & Support",
      description: "Helpful guides and legal information.",
      items: [
        { label: "Blog & Tips", view: "blog", href: ROUTES.blog, icon: BookOpen, desc: "Tutorials and articles about PDF management." },
        { label: "Help Center", view: "help", href: ROUTES.help, icon: HelpCircle, desc: "Get support via WhatsApp or Email." },
        { label: "Contact Us", view: "contact", href: ROUTES.contact, icon: Mail, desc: "Reach out to our team." },
        { label: "Privacy Policy", view: "privacy", href: ROUTES.privacy, icon: Shield, desc: "Learn how we protect your data." },
        { label: "Terms of Service", view: "terms", href: ROUTES.terms, icon: Shield, desc: "Terms and conditions of use." },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 animate-fade-in">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-glow-100 text-glow-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm transform rotate-3 hover:rotate-6 transition-transform">
            <Map size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Site Directory</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Explore all the tools and resources available on PDF Glow. 
            Everything is free and secure.
        </p>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                    <p className="text-gray-500">{section.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.items.map((item, i) => (
                        <a 
                            key={i} 
                            href={item.href}
                            onClick={(e) => handleNav(e, item.href, item.view)}
                            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100 cursor-pointer"
                        >
                            <div className="p-3 bg-gray-100 text-gray-500 rounded-xl group-hover:bg-glow-50 group-hover:text-glow-600 transition-colors">
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-glow-600 transition-colors flex items-center gap-2">
                                    {item.label}
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
