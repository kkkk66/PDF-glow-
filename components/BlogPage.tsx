import React, { useState } from 'react';
import { BookOpen, User, Calendar, ArrowRight, Shield, Zap, ChevronLeft, Clock, Tag } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  content: React.ReactNode;
}

export const BlogPage: React.FC = () => {
  const [activePost, setActivePost] = useState<number | null>(null);

  const articles: BlogPost[] = [
    {
      id: 1,
      title: "Why Client-Side PDF Processing is the Safest Option",
      excerpt: "In an age of data breaches, uploading sensitive documents to servers is risky. Learn why browser-based PDF tools like PDF Glow are the future of privacy.",
      date: "Oct 15, 2024",
      readTime: "5 min read",
      author: "Security Team",
      category: "Security",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
                When you use most online PDF tools, you are forced to upload your file to a remote server. 
                The server processes the file and sends it back to you. While many reputable services promise to delete files after an hour, 
                you are still trusting a third party with your sensitive data. This creates a potential vulnerability in your data security chain.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">The Client-Side Revolution</h3>
            <p>
                <strong>Client-Side Processing</strong> changes the game completely. By utilizing advanced WebAssembly (Wasm) technology, 
                modern browsers can now handle complex computational tasks—like merging, splitting, and compressing PDFs—directly on your device.
            </p>
            <p>
                With PDF Glow, your file never leaves your computer. The code travels to your data, not the other way around. 
                This means even we, the developers of PDF Glow, cannot see your documents.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-xl">
                <h4 className="font-bold text-blue-900 mb-2">Key Security Benefit</h4>
                <p className="text-blue-800">
                    If you disconnect your internet after loading PDF Glow, the tools will still work! 
                    This proves that no data is being sent to the cloud.
                </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">Why Professionals Choose Local Processing</h3>
            <ul className="list-disc pl-6 space-y-3 marker:text-glow-500">
                <li><strong>GDPR & HIPAA Compliance:</strong> Since data isn't transmitted, you don't need to worry about cross-border data transfer regulations.</li>
                <li><strong>Corporate Secrets:</strong> Safe for handling contracts, financial reports, and legal documents.</li>
                <li><strong>Instant Speed:</strong> You don't have to wait for a 50MB file to upload on a slow connection. Processing starts immediately.</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">Conclusion</h3>
            <p>
                As web technologies evolve, the need for server-side processing diminishes. 
                PDF Glow is at the forefront of this shift, providing professional-grade tools without the privacy compromise. 
                Next time you need to merge a contract, choose the secure, client-side option.
            </p>
        </div>
      )
    },
    {
      id: 2,
      title: "How to Reduce PDF File Size for Email Attachments",
      excerpt: "Struggling to email a large PDF report? Discover simple techniques to compress your documents without losing readability or important details.",
      date: "Oct 12, 2024",
      readTime: "4 min read",
      author: "Tech Support",
      category: "Productivity",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
                We've all been there: you finish an important report, hit send, and get the dreaded "Attachment size exceeds limit" error. 
                Most email providers (Gmail, Outlook) limit attachments to 25MB. High-resolution scans and image-heavy reports often exceed this easily.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">Why are PDFs so big?</h3>
            <p>
                PDFs are containers. They can hold fonts, images, vector graphics, and even other files. 
                The most common culprit for bloated file sizes is <strong>uncompressed images</strong>. 
                A single high-resolution photo from a modern phone can be 5-10MB. If your PDF has five of them, you are already over the limit.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">3 Ways to Compress PDFs</h3>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">1. Lower Image DPI</h4>
                    <p className="text-sm">Converting 300 DPI (Print Quality) images to 72 or 150 DPI (Screen Quality) drastically reduces size with little visible difference on screens.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">2. Remove Metadata</h4>
                    <p className="text-sm">PDFs store hidden data like edit history, thumbnails, and unused fonts. Stripping this saves space.</p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">Using PDF Glow's Compressor</h3>
            <p>
                Our <strong>Compress PDF</strong> tool automates this process. We use an algorithm that:
            </p>
            <ol className="list-decimal pl-6 space-y-3 marker:font-bold marker:text-gray-900">
                <li>Analyzes every page of your document.</li>
                <li>Identifies large images.</li>
                <li>Re-encodes them to efficient JPEG format.</li>
                <li>Rebuilds the PDF structure.</li>
            </ol>
            <p className="mt-4">
                This often results in 50% to 90% size reduction, making your file ready for email instantly.
            </p>
        </div>
      )
    },
    {
      id: 3,
      title: "5 Free Tools Every Student Needs for Assignments",
      excerpt: "Managing assignments, notes, and research papers can be chaotic. Here are the top 5 PDF utilities that simplify student life.",
      date: "Oct 08, 2024",
      readTime: "3 min read",
      author: "Education Team",
      category: "Education",
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
                University life involves handling hundreds of digital documents. From lecture slides to scanned textbook chapters, 
                keeping everything organized is half the battle. Here is how PDF Glow helps students stay on top of their workload.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">1. PDF Merge: Organize Lecture Notes</h3>
            <p>
                Don't keep 15 separate files for "Week 1", "Week 2", etc. Use the <strong>Merge Tool</strong> to combine all your semester notes into one master subject file. 
                It makes searching (Ctrl+F) for exam topics much easier.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">2. JPG to PDF: Submit Handwritten Homework</h3>
            <p>
                Professors often require digital submissions for math or physics homework. 
                Instead of submitting 5 separate photos, simply take pictures of your pages, drag them into our <strong>JPG to PDF</strong> tool, 
                and download a single, professional-looking document.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">3. Split PDF: Extract Readings</h3>
            <p>
                If your professor assigns "Chapter 4" from a massive 500-page textbook PDF, don't carry the whole file around. 
                Use <strong>Split PDF</strong> to extract just the pages you need for this week's reading.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8">Conclusion</h3>
            <p>
                Efficiency is key to surviving college. Using the right tools saves you time and frustration, letting you focus on studying (or sleeping!).
            </p>
        </div>
      )
    }
  ];

  const activeArticle = activePost ? articles.find(a => a.id === activePost) : null;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in min-h-screen">
      
      {activeArticle ? (
        // SINGLE POST VIEW
        <div className="animate-slide-up">
            <button 
                onClick={() => setActivePost(null)}
                className="group flex items-center gap-2 text-gray-500 hover:text-glow-600 font-medium mb-8 transition-colors px-4 md:px-0"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to all articles
            </button>

            <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/50 p-8 md:p-12 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                        <span className="bg-glow-50 text-glow-600 px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Tag size={14} /> {activeArticle.category}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> {activeArticle.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} /> {activeArticle.readTime}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {activeArticle.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{activeArticle.author}</p>
                            <p className="text-xs text-gray-500">Author</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 max-w-3xl mx-auto">
                    {activeArticle.content}
                </div>

                <div className="bg-gray-50 p-8 md:p-12 text-center border-t border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoyed this article?</h3>
                    <p className="text-gray-500 mb-6">Check out our free PDF tools to put these tips into practice.</p>
                    <button 
                        onClick={() => {
                             setActivePost(null);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                             window.location.hash = 'merge';
                        }}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all"
                    >
                        Try PDF Tools
                    </button>
                </div>
            </article>
        </div>
      ) : (
        // BLOG LIST VIEW
        <>
            <div className="text-center py-12 px-4">
                <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <BookOpen size={14} />
                <span>Resources & Guides</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                PDF Glow <span className="text-glow-600">Blog</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Expert insights on document management, security, and productivity tips to help you get the most out of your PDFs.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16 px-4">
                {articles.map((article, index) => (
                <div 
                    key={article.id} 
                    className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-glow-200 transition-all duration-300 group cursor-pointer flex flex-col items-start ${index === 0 ? 'md:col-span-2 bg-gradient-to-br from-white to-glow-50/20' : ''}`}
                    onClick={() => {
                        setActivePost(article.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 w-full">
                        <span className="text-glow-600 bg-glow-50 px-3 py-1.5 rounded-lg border border-glow-100 group-hover:bg-glow-100 transition-colors">
                            {article.category}
                        </span>
                        <span className="flex items-center gap-1 ml-auto"><Calendar size={12} /> {article.date}</span>
                    </div>
                    
                    <h2 className={`font-bold text-gray-900 mb-4 group-hover:text-glow-600 transition-colors ${index === 0 ? 'text-3xl' : 'text-xl'}`}>
                        {article.title}
                    </h2>
                    
                    <p className="text-gray-500 mb-6 leading-relaxed flex-grow">
                        {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between w-full mt-auto pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User size={14} />
                            </div>
                            <span>{article.author}</span>
                        </div>
                        <span className="text-glow-600 font-semibold flex items-center gap-2 text-sm group-hover:translate-x-1 transition-transform">
                            Read Article <ArrowRight size={16} />
                        </span>
                    </div>
                </div>
                ))}
            </div>
            
            {/* Trust Signals for Blog */}
            <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white text-center mb-16 mx-4">
                <h3 className="text-2xl font-bold mb-8">Why trust our guides?</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-4">
                        <Shield className="w-10 h-10 text-green-400 mx-auto mb-4" />
                        <h4 className="font-bold text-lg mb-2">Security Experts</h4>
                        <p className="text-sm text-gray-400">Content reviewed by web security professionals.</p>
                    </div>
                    <div className="p-4">
                        <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                        <h4 className="font-bold text-lg mb-2">Tested Workflows</h4>
                        <p className="text-sm text-gray-400">We verify every tool and technique we recommend.</p>
                    </div>
                    <div className="p-4">
                        <BookOpen className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                        <h4 className="font-bold text-lg mb-2">Always Free</h4>
                        <p className="text-sm text-gray-400">Democratizing access to knowledge and tools.</p>
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
};