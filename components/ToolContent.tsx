
import React from 'react';
import { HelpCircle, Shield, Zap, Info, FileText, CheckCircle2 } from 'lucide-react';

interface ToolContentProps {
  toolId: string;
}

const contentMap: Record<string, {
  title: string;
  description: string;
  steps: string[];
  features: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
}> = {
  merge: {
    title: "How to Merge PDF Files Online for Free",
    description: "Combining multiple PDF documents into a single file is essential for organizing reports, invoices, and study materials. PDF Glow offers a secure, fast, and free solution to merge PDFs directly in your browser without uploading files to a server.",
    steps: [
      "Select your PDF files by clicking the upload button or dragging them into the drop zone.",
      "Arrange the files in your desired order using the Up/Down arrows.",
      "Click the 'Merge PDFs Now' button to process the files instantly.",
      "Download your unified PDF document immediately."
    ],
    features: [
      { title: "100% Privacy", desc: "Your files are processed using client-side technology. No server uploads mean zero risk of data leakage." },
      { title: "Unlimited Files", desc: "Merge as many files as your device memory allows. We don't impose artificial limits on file count." },
      { title: "Order Customization", desc: "Easily drag and reorder your documents before merging to ensure the perfect sequence." }
    ],
    faq: [
      { q: "Is it safe to merge confidential documents?", a: "Yes, absolutely. Unlike other sites, PDF Glow processes files locally on your device. Your data never travels over the internet." },
      { q: "Do I need to install software?", a: "No. This tool works entirely in your web browser (Chrome, Safari, Edge, Firefox) on Windows, Mac, or Linux." },
      { q: "Can I merge PDF files on mobile?", a: "Yes, our tool is fully responsive and works great on iPhone and Android devices." }
    ]
  },
  split: {
    title: "Split PDF Files - Extract Pages Instantly",
    description: "Need to separate a large PDF into individual pages or remove specific sections? Our Split PDF tool allows you to burst a PDF document into separate files for every single page.",
    steps: [
      "Upload the PDF file you want to split.",
      "Click 'Split into Pages' to begin the extraction process.",
      "Wait a moment while your browser processes the file.",
      "Download all pages as a convenient ZIP file or download specific pages individually."
    ],
    features: [
      { title: "Instant Extraction", desc: "Split large documents in seconds without waiting for upload or download queues." },
      { title: "ZIP Download", desc: "Get all your extracted pages in one single ZIP archive for easy file management." },
      { title: "Quality Preservation", desc: "We maintain the original quality and formatting of every single page." }
    ],
    faq: [
      { q: "Will the quality of my PDF decrease?", a: "No. The splitting process extracts existing pages exactly as they are without re-encoding." },
      { q: "Can I split password-protected PDFs?", a: "For security reasons, you must remove the password before processing the file." }
    ]
  },
  compress: {
    title: "Compress PDF - Reduce File Size Online",
    description: "Large PDF files can be difficult to email or upload to web portals. Our PDF Compressor reduces file size by optimizing images and structure, making your documents easier to share.",
    steps: [
      "Choose the PDF file you wish to compress.",
      "Select your compression level (Recommended or Extreme).",
      "Click 'Compress PDF' and watch the size shrink.",
      "Download your optimized, smaller PDF file."
    ],
    features: [
      { title: "Smart Optimization", desc: "We intelligently reduce image resolution and quality to save space while keeping text readable." },
      { title: "Visual Verification", desc: "See exactly how much space you saved with our compression stats." },
      { title: "Browser-Based", desc: "Compression happens on your CPU, ensuring your sensitive data stays private." }
    ],
    faq: [
      { q: "How does compression work?", a: "We convert complex vector pages into optimized images. This drastically reduces size but may make text unselectable." },
      { q: "Is 'Extreme' compression legible?", a: "Yes, but images may look pixelated. Use 'Recommended' for professional documents." }
    ]
  },
  organize: {
    title: "Organize PDF Pages - Reorder, Sort, and Rearrange",
    description: "Easily rearrange the page order of your PDF file. Just drag and drop pages to fix scanning errors or improve document flow.",
    steps: [
      "Upload your PDF document.",
      "Wait for the page previews to load.",
      "Drag and drop the thumbnails to your desired order.",
      "Click 'Save Organized PDF' to download the new file."
    ],
    features: [
      { title: "Visual Interface", desc: "See thumbnails of every page so you know exactly what you are moving." },
      { title: "Drag & Drop", desc: "Intuitive sorting mechanism that works like moving apps on your phone." },
      { title: "Secure Processing", desc: "All reorganization happens in your browser memory. No upload required." }
    ],
    faq: [
      { q: "Can I delete pages here?", a: "This tool focuses on reordering. Use the 'Delete Pages' tool to remove content permanently." },
      { q: "Is there a page limit?", a: "We recommend files under 100 pages for the best performance in the browser." }
    ]
  },
  word: {
    title: "Convert PDF to Word (DOCX) - Editable Documents",
    description: "Transform static PDF documents into editable Word files. Our converter extracts text from your PDF and rebuilds it into a standard .docx format compatible with Microsoft Word, Google Docs, and more.",
    steps: [
      "Upload your PDF document.",
      "Click 'Convert to Word' to start the text extraction engine.",
      "The tool analyzes text coordinates and layout.",
      "Download your new .docx file and start editing."
    ],
    features: [
      { title: "Text Recovery", desc: "Excellent for recovering text from reports, essays, or contracts." },
      { title: "Universal Format", desc: "Outputs standard DOCX files that work everywhere." },
      { title: "Free & Fast", desc: "No daily limits or email registration required." }
    ],
    faq: [
      { q: "Does it keep images?", a: "Currently, this tool focuses on text extraction to ensure the document is editable." },
      { q: "Can I convert scanned PDFs?", a: "This tool works best with standard PDFs. Scanned images (without OCR) may not convert correctly." }
    ]
  },
  jpg: {
    title: "Convert JPG/PNG Images to PDF",
    description: "Turn your photos, screenshots, or scans into a professional multi-page PDF document. This is perfect for submitting receipts, ID cards, or assignment photos.",
    steps: [
      "Select one or multiple images (JPG or PNG).",
      "Reorder the images using the arrow buttons.",
      "Click 'Convert to PDF' to combine them.",
      "Download your single PDF file containing all images."
    ],
    features: [
      { title: "Multi-Image Support", desc: "Combine dozens of images into one file." },
      { title: "No Watermarks", desc: "Your resulting PDF is clean and professional." },
      { title: "Client-Side Privacy", desc: "Your personal photos are processed locally and never uploaded." }
    ],
    faq: [
      { q: "What image formats are supported?", a: "We support standard JPG, JPEG, and PNG files." },
      { q: "Is there a limit on photos?", a: "Technically no, but very large numbers of high-res photos may slow down your browser." }
    ]
  },
  pdftojpg: {
    title: "Convert PDF to JPG Images",
    description: "Extract every page of a PDF document as a high-quality JPG image. Useful for sharing specific pages on social media or using them in presentations.",
    steps: [
      "Upload the PDF you want to convert.",
      "The tool processes every page individually.",
      "Preview the extracted images in the gallery.",
      "Download specific images or get them all in a ZIP file."
    ],
    features: [
      { title: "High Resolution", desc: "We render pages at high DPI for crisp images." },
      { title: "Bulk Download", desc: "Save time by downloading all pages at once via ZIP." },
      { title: "Instant Preview", desc: "See the images before you download them." }
    ],
    faq: [
      { q: "Can I use this on mobile?", a: "Yes, it's a great way to view PDF pages as images on your phone gallery." }
    ]
  },
  pagenumbers: {
    title: "Add Page Numbers to PDF Online",
    description: "Insert sequential page numbering into your PDF documents. Essential for organizing legal briefs, thesis papers, and corporate reports after merging multiple files.",
    steps: [
      "Upload your PDF document.",
      "Select the position for the numbers (e.g., Bottom Right, Bottom Center).",
      "Choose the starting number (default is 1).",
      "Click 'Add Page Numbers' to process and download."
    ],
    features: [
      { title: "Flexible Positioning", desc: "Place numbers exactly where you need them: header or footer." },
      { title: "Custom Start", desc: "Start counting from any number, perfect for appending to existing documents." },
      { title: "Professional Look", desc: "Uses standard Helvetica font for a clean, business-ready appearance." }
    ],
    faq: [
      { q: "Can I change the font style?", a: "Currently, we use a standard professional font to ensure compatibility across all devices." },
      { q: "Does it work on large files?", a: "Yes, the tool processes every page efficiently on your device." }
    ]
  },
  unlock: {
    title: "Unlock PDF - Remove Password Security",
    description: "Unlock password-protected PDF files instantly. Remove owner restrictions and user passwords so you can edit, print, or copy text from your documents freely.",
    steps: [
      "Select your password-protected PDF file.",
      "Enter the password (if required to open the file).",
      "Click 'Unlock PDF' to decrypt the document.",
      "Download the new version with all restrictions removed."
    ],
    features: [
      { title: "Decryption Engine", desc: "Removes standard PDF encryption including RC4 and AES." },
      { title: "Instant Unlock", desc: "No upload waiting time. Decryption happens on your device CPU." },
      { title: "Secure Handling", desc: "Your password is never sent to any server. It stays in your browser memory." }
    ],
    faq: [
      { q: "Can it crack unknown passwords?", a: "No. You typically need to know the password to open the file first. This tool is for removing known passwords permanently." },
      { q: "Is it safe?", a: "Yes. Since it runs client-side, your password and document remain private." }
    ]
  }
};

export const ToolContent: React.FC<ToolContentProps> = ({ toolId }) => {
  const content = contentMap[toolId];

  // If no specific content exists, don't render anything (or render generic)
  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 pb-12 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
        
        {/* Title & Description */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          {content.description}
        </p>

        {/* How To Steps */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Info className="text-glow-500" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-4">
            {content.steps.map((step, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-glow-50 text-glow-600 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 border border-glow-100">
                  {index + 1}
                </div>
                <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {content.features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
               {index === 0 && <Shield className="text-glow-500 mb-3" size={24} />}
               {index === 1 && <Zap className="text-yellow-500 mb-3" size={24} />}
               {index === 2 && <CheckCircle2 className="text-green-500 mb-3" size={24} />}
               <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
               <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div>
           <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <HelpCircle className="text-glow-500" />
            Common Questions
          </h3>
          <div className="space-y-6">
            {content.faq.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-bold text-gray-700 mb-2">{item.q}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
