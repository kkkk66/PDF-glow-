import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, ArrowRight, Loader2, CheckCircle, Download, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { convertImagesToPdf, downloadPdfBlob } from '../utils/pdfHelpers';

export const JpgToPdf: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(event.target.files).map(file => ({
        id: Math.random().toString(36).substring(7),
        file: file as File,
        previewUrl: URL.createObjectURL(file as Blob)
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setErrorMessage(null);
      setStatus(MergeStatus.IDLE);
      event.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
        const newFiles = prev.filter(f => f.id !== id);
        const removed = prev.find(f => f.id === id);
        if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
        return newFiles;
    });
    setErrorMessage(null);
    setStatus(MergeStatus.IDLE);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    setFiles(prev => {
        const newFiles = [...prev];
        if (direction === 'left' && index > 0) {
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        } else if (direction === 'right' && index < newFiles.length - 1) {
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        }
        return newFiles;
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      const rawFiles = files.map(f => f.file);
      const pdfBytes = await convertImagesToPdf(rawFiles);
      
      setPdfData(pdfBytes);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during conversion.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (pdfData) {
      downloadPdfBlob(pdfData, `images-converted-${Date.now()}.pdf`);
    }
  };

  const handleReset = () => {
    files.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
    setStatus(MergeStatus.IDLE);
    setPdfData(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">JPG to PDF</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Convert Photos, JPG, and PNG images into a single PDF document.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                High Quality • Client-Side • Secure
              </span>
            </p>
          </div>

          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-green-500 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Images Converted!</h3>
              <p className="text-gray-500 mb-8">Your PDF document is ready to download.</p>
              
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
                  Convert New
                </button>
              </div>
            </div>
          ) : (
            <>
              {status === MergeStatus.ERROR && errorMessage && (
                <div className="mb-8 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-fade-in shadow-sm">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Conversion Failed</p>
                    <p className="text-sm opacity-90">{errorMessage}</p>
                  </div>
                  <button onClick={() => setStatus(MergeStatus.IDLE)} className="p-1 hover:bg-red-100 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}

              <div 
                className={`border-3 border-dashed rounded-3xl transition-all duration-300 ${
                  files.length > 0 
                    ? 'border-glow-200 bg-glow-50/50' 
                    : 'border-gray-200 hover:border-glow-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  {files.length === 0 ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <Upload className="text-glow-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Drop JPG/PNG images here</h3>
                      <p className="text-gray-400 mb-6">or click to browse your computer</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all"
                      >
                        Select Images
                      </button>
                    </>
                  ) : (
                     <div className="w-full max-w-4xl">
                        <div className="flex justify-between items-center mb-6 px-2">
                           <h3 className="font-bold text-gray-700">Selected Images ({files.length})</h3>
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="text-sm text-glow-600 hover:text-glow-700 font-medium hover:underline"
                           >
                             + Add more images
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                          {files.map((item, index) => (
                            <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white aspect-square animate-fade-in-up">
                              {item.previewUrl ? (
                                <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <ImageIcon className="text-gray-300" />
                                </div>
                              )}
                              
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                  <div className="flex gap-2">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); moveImage(index, 'left'); }}
                                        disabled={index === 0}
                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white disabled:opacity-30"
                                      >
                                          <ArrowLeft size={14} />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); moveImage(index, 'right'); }}
                                        disabled={index === files.length - 1}
                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white disabled:opacity-30"
                                      >
                                          <ArrowRight size={14} />
                                      </button>
                                  </div>
                                  <button 
                                    onClick={() => removeFile(item.id)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                  >
                                    <X size={16} />
                                  </button>
                              </div>
                              
                              {/* Order Badge */}
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                     </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/jpg" 
                    multiple 
                  />
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleConvert}
                    disabled={status === MergeStatus.PROCESSING}
                    className={`
                      relative group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all
                      ${status === MergeStatus.PROCESSING
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-glow-500 to-glow-600 text-white shadow-pink-glow hover:shadow-pink-glow-lg hover:scale-105 active:scale-100'
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
                        Convert to PDF
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
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