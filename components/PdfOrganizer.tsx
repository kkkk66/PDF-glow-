import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, Layers, Loader2, CheckCircle, RefreshCw, Download, AlertCircle, ZoomIn, Trash2 } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { getPdfPagePreviews, reorderPdfPages, downloadPdfBlob } from '../utils/pdfHelpers';

interface PageItem {
  originalIndex: number;
  previewUrl: string;
  id: string;
}

export const PdfOrganizer: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [resultPdfData, setResultPdfData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [zoomedPage, setZoomedPage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ref to track pages for cleanup to avoid stale closures in useEffect
  const pagesRef = useRef<PageItem[]>([]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile({
        id: Math.random().toString(36).substring(7),
        file: selectedFile
      });
      
      setStatus(MergeStatus.IDLE);
      setResultPdfData(null);
      setErrorMessage(null);
      
      // Cleanup previous pages
      pages.forEach(p => URL.revokeObjectURL(p.previewUrl));
      setPages([]);
      
      setIsLoadingPreviews(true);
      try {
        const previews = await getPdfPagePreviews(selectedFile);
        
        const newPages = previews.map((url, index) => ({
            originalIndex: index,
            previewUrl: url,
            id: `page-${index}-${Math.random().toString(36).substring(2, 9)}`
        }));
        setPages(newPages);
        
        if (newPages.length === 0) {
           setErrorMessage("No pages found or preview generation failed completely.");
        }
      } catch (e) {
          console.error(e);
          setErrorMessage("Failed to load PDF pages. The file might be corrupted or password protected.");
      } finally {
        setIsLoadingPreviews(false);
      }

      event.target.value = '';
    }
  };

  const removeFile = () => {
    // Cleanup URLs
    pages.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setFile(null);
    setPages([]);
    setStatus(MergeStatus.IDLE);
    setResultPdfData(null);
    setErrorMessage(null);
  };

  const removePage = (indexToRemove: number) => {
    setPages(prev => {
        const pageToRemove = prev[indexToRemove];
        if (pageToRemove) {
            URL.revokeObjectURL(pageToRemove.previewUrl);
        }
        return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
        setDraggedItem(index);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); 
    if (draggedItem === null) return;
    if (draggedItem === index) return;

    const newPages = [...pages];
    const item = newPages[draggedItem];
    
    newPages.splice(draggedItem, 1);
    newPages.splice(index, 0, item);
    
    setPages(newPages);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedItem(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    if (pages.length === 0) {
      setErrorMessage("You cannot save an empty PDF.");
      setStatus(MergeStatus.ERROR);
      return;
    }
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      const newOrder = pages.map(p => p.originalIndex);
      const result = await reorderPdfPages(file.file, newOrder);
      setResultPdfData(result);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "Failed to reorder PDF.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (resultPdfData) {
      downloadPdfBlob(resultPdfData, `organized-${file?.file.name}`);
    }
  };

  const handleReset = () => {
    removeFile();
  };

  // Cleanup on unmount using the ref to access latest state
  useEffect(() => {
    return () => {
      pagesRef.current.forEach(p => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Organize PDF Pages</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Drag to reorder. Click trash icon to delete.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Interactive • Visual • Secure
              </span>
            </p>
          </div>

          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-green-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">PDF Organized!</h3>
              <p className="text-gray-500 mb-8">Your new document order is saved.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-gradient-to-r from-glow-500 to-glow-600 text-white px-8 py-4 rounded-xl font-semibold shadow-pink-glow hover:shadow-pink-glow-lg transition-all transform hover:-translate-y-1"
                >
                  <Download size={20} />
                  Download PDF
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-white border-2 border-gray-100 text-gray-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <RefreshCw size={20} />
                  Start Over
                </button>
              </div>
            </div>
          ) : (
            <>
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
              
              {status === MergeStatus.IDLE && errorMessage && pages.length === 0 && (
                <div className="mb-8 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-amber-700 animate-fade-in shadow-sm">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Preview Error</p>
                    <p className="text-sm opacity-90">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div 
                className={`border-3 border-dashed rounded-3xl transition-all duration-300 ${
                  file 
                    ? 'border-purple-200 bg-purple-50/20' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                {!file ? (
                   <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <Layers className="text-purple-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Select PDF to Organize</h3>
                      <p className="text-gray-400 mb-6">Sort, reorder, and rearrange pages</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all"
                      >
                        Select PDF File
                      </button>
                   </div>
                ) : (
                   <div className="w-full p-6">
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-slide-up mb-6 max-w-2xl mx-auto">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileIcon className="text-purple-500 w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 truncate max-w-[200px]">{file.file.name}</p>
                              <p className="text-xs text-gray-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={removeFile} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                            <X size={20} />
                          </button>
                      </div>

                      {isLoadingPreviews ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin text-glow-500 w-10 h-10 mb-4" />
                            <p className="text-gray-500">Generating page previews...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {pages.map((page, index) => (
                                <div 
                                    key={page.id}
                                    draggable={true}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={handleDrop}
                                    className={`
                                        relative group cursor-move bg-white p-2 rounded-lg border-2 shadow-sm transition-all duration-200
                                        ${draggedItem === index ? 'opacity-50 border-purple-400 scale-95' : 'border-gray-100 hover:border-purple-300 hover:shadow-md'}
                                    `}
                                >
                                    <div className="aspect-[2/3] relative bg-gray-50 rounded overflow-hidden mb-2 flex items-center justify-center pointer-events-none">
                                        {page.previewUrl ? (
                                             <img src={page.previewUrl} alt={`Page ${index + 1}`} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-xs text-gray-400 text-center p-2">Preview Unavailable</span>
                                        )}
                                        
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                                            {page.previewUrl && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setZoomedPage(page.previewUrl); }}
                                                    className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                                                    title="Zoom"
                                                >
                                                    <ZoomIn size={14} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removePage(index); }}
                                                className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600"
                                                title="Delete Page"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-1 pointer-events-none">
                                        <span className="text-xs font-bold text-gray-400">Page {index + 1}</span>
                                        <span className="text-xs text-gray-300">Src: {page.originalIndex + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
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

              {file && !isLoadingPreviews && pages.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleProcess}
                    disabled={status === MergeStatus.PROCESSING || pages.length === 0}
                    className={`
                      relative group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all
                      ${(status === MergeStatus.PROCESSING || pages.length === 0)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-pink-glow hover:shadow-pink-glow-lg hover:scale-105 active:scale-100'
                      }
                    `}
                  >
                    {status === MergeStatus.PROCESSING ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Save Organized PDF
                        <Layers size={20} className="transition-transform group-hover:scale-110" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Zoom Modal */}
          {zoomedPage && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setZoomedPage(null)}>
                  <div className="relative max-w-4xl max-h-[90vh]">
                      <img src={zoomedPage} alt="Zoomed Page" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
                      <button className="absolute -top-12 right-0 text-white hover:text-gray-300">
                          <X size={32} />
                      </button>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};