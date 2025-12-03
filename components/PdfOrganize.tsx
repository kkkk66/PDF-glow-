import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, LayoutGrid, Loader2, CheckCircle, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { getPdfPagePreviews, reorderPdfPages, downloadPdfBlob } from '../utils/pdfHelpers';

interface PageItem {
  originalIndex: number;
  previewUrl: string;
}

export const PdfOrganize: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [reorderedPdfData, setReorderedPdfData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState<boolean>(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile({
        id: Math.random().toString(36).substring(7),
        file: selectedFile
      });
      
      setStatus(MergeStatus.IDLE);
      setReorderedPdfData(null);
      setErrorMessage(null);
      setPages([]);
      
      // Generate previews
      setIsLoadingPreviews(true);
      try {
        const previewUrls = await getPdfPagePreviews(selectedFile);
        const pageItems = previewUrls.map((url, index) => ({
          originalIndex: index,
          previewUrl: url
        }));
        setPages(pageItems);
      } catch (err) {
        setErrorMessage("Failed to load PDF pages.");
      }
      setIsLoadingPreviews(false);
      
      event.target.value = '';
    }
  };

  const removeFile = () => {
    setFile(null);
    setPages(prev => {
        prev.forEach(p => URL.revokeObjectURL(p.previewUrl));
        return [];
    });
    setStatus(MergeStatus.IDLE);
    setReorderedPdfData(null);
    setErrorMessage(null);
  };

  // Drag and Drop Logic
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    // Reorder the array temporarily for visual feedback
    const newPages = [...pages];
    const draggedItem = newPages[draggedItemIndex];
    
    // Remove dragged item
    newPages.splice(draggedItemIndex, 1);
    // Insert at new position
    newPages.splice(index, 0, draggedItem);
    
    setPages(newPages);
    setDraggedItemIndex(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedItemIndex(null);
  };

  const handleProcess = async () => {
    if (!file || pages.length === 0) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      // Extract the new order of indices
      const newOrder = pages.map(p => p.originalIndex);
      const result = await reorderPdfPages(file.file, newOrder);
      setReorderedPdfData(result);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during reordering.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (reorderedPdfData) {
      downloadPdfBlob(reorderedPdfData, `organized-${file?.file.name}`);
    }
  };

  const handleReset = () => {
    removeFile();
  };
  
  // Cleanup preview URLs
  useEffect(() => {
      return () => {
          pages.forEach(p => URL.revokeObjectURL(p.previewUrl));
      }
  }, []); // Only on unmount for safety, or we can rely on removeFile

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tool Card */}
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        {/* Glow Effects Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Organize PDF</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Drag and drop page thumbnails to rearrange your document order.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Visual Reordering • Easy • Secure
              </span>
            </p>
          </div>

          {/* Success State */}
          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-violet-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">PDF Organized!</h3>
              <p className="text-gray-500 mb-8">Your pages have been reordered successfully.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                  <Download size={20} />
                  Download PDF
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <RefreshCw size={20} />
                  Start Over
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {status === MergeStatus.ERROR && errorMessage && (
                <div className="mb-8 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-fade-in shadow-sm">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Operation Failed</p>
                    <p className="text-sm opacity-90">{errorMessage}</p>
                  </div>
                  <button onClick={() => setStatus(MergeStatus.IDLE)} className="p-1 hover:bg-red-100 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Upload Area */}
              <div 
                className={`border-3 border-dashed rounded-3xl transition-all duration-300 ${
                  file 
                    ? 'border-violet-200 bg-violet-50/30' 
                    : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  {!file ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <LayoutGrid className="text-violet-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Select PDF to Organize</h3>
                      <p className="text-gray-400 mb-6">Reorder pages by dragging them</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all"
                      >
                        Select PDF File
                      </button>
                    </>
                  ) : (
                     <div className="w-full">
                        {/* File Header */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-slide-up mb-6 max-w-2xl mx-auto">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileIcon className="text-violet-500 w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 truncate max-w-[200px]">{file.file.name}</p>
                              <p className="text-xs text-gray-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            onClick={removeFile}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        {/* Page Grid */}
                        {isLoadingPreviews ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="animate-spin text-glow-500 w-10 h-10 mb-4" />
                                <p className="text-gray-500">Generating page previews...</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-center text-sm text-gray-500 mb-6 bg-violet-50 inline-block px-4 py-1 rounded-full mx-auto">
                                    Tip: Drag and drop pages to change their order
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar px-2 select-none">
                                    {pages.map((page, index) => (
                                        <div 
                                            key={index} // Ideally should be unique ID, but index works for swapping visual
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={handleDrop}
                                            className={`
                                                relative group cursor-move rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-[2/3] bg-white shadow-sm
                                                ${draggedItemIndex === index 
                                                    ? 'opacity-50 border-dashed border-violet-400 scale-95' 
                                                    : 'border-gray-200 hover:border-violet-300 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            <img src={page.previewUrl} alt={`Page ${page.originalIndex + 1}`} className="w-full h-full object-contain pointer-events-none" />
                                            
                                            {/* Page Number Badge */}
                                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                                                {index + 1}
                                            </div>
                                            
                                            {/* Original Page Indicator (Optional) */}
                                            <div className="absolute bottom-2 right-2 bg-gray-100/90 text-gray-500 text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                Orig: {page.originalIndex + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                     </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="application/pdf" 
                  />
                </div>
              </div>

              {/* Action Bar */}
              {file && !isLoadingPreviews && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleProcess}
                    disabled={status === MergeStatus.PROCESSING}
                    className={`
                      relative group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all
                      ${status === MergeStatus.PROCESSING
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-100'
                      }
                    `}
                  >
                    {status === MergeStatus.PROCESSING ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Reordering...
                      </>
                    ) : (
                      <>
                        Save Organized PDF
                        <LayoutGrid size={20} className="transition-transform group-hover:scale-110" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};