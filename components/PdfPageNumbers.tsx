import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, Hash, Loader2, CheckCircle, RefreshCw, Download, AlertCircle, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, LayoutTemplate } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { addPageNumbers, downloadPdfBlob } from '../utils/pdfHelpers';

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center' | 'top-left';

export const PdfPageNumbers: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [numberedPdfData, setNumberedPdfData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile({
        id: Math.random().toString(36).substring(7),
        file: selectedFile
      });
      event.target.value = '';
      setStatus(MergeStatus.IDLE);
      setNumberedPdfData(null);
      setErrorMessage(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setNumberedPdfData(null);
    setErrorMessage(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      const result = await addPageNumbers(file.file, position);
      setNumberedPdfData(result);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred while adding page numbers.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (numberedPdfData) {
      downloadPdfBlob(numberedPdfData, `numbered-${file?.file.name}`);
    }
  };

  const handleReset = () => {
    removeFile();
  };

  // Helper to render visual position selector
  const PositionBox = ({ pos, label, icon: Icon }: { pos: Position, label: string, icon: any }) => (
    <button
        onClick={() => setPosition(pos)}
        className={`
            flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all h-24
            ${position === pos 
                ? 'border-glow-500 bg-glow-50 text-glow-700' 
                : 'border-gray-100 hover:border-glow-200 hover:bg-gray-50 text-gray-500'
            }
        `}
    >
        <div className="mb-2">
            <Icon size={20} />
        </div>
        <span className="text-xs font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tool Card */}
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        {/* Glow Effects Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Add Page Numbers</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Insert page numbers into your document instantly.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Professional • Customizable
              </span>
            </p>
          </div>

          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-orange-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Numbers Added!</h3>
              <p className="text-gray-500 mb-8">Your document has been updated.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
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

              <div 
                className={`border-3 border-dashed rounded-3xl transition-all duration-300 ${
                  file 
                    ? 'border-orange-200 bg-orange-50/30' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  {!file ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <Hash className="text-orange-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Select PDF</h3>
                      <p className="text-gray-400 mb-6">Add numbering to all pages</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all"
                      >
                        Select PDF File
                      </button>
                    </>
                  ) : (
                     <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                        {/* Left: Controls */}
                        <div className="w-full p-4">
                             <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-slide-up mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileIcon className="text-orange-500 w-5 h-5" />
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

                            <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Select Position</h4>
                            
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {/* Top Row */}
                                <PositionBox pos="top-left" label="Top Left" icon={ArrowLeft} />
                                <PositionBox pos="top-center" label="Top Center" icon={ArrowUp} />
                                <PositionBox pos="top-right" label="Top Right" icon={ArrowRight} />
                                
                                {/* Bottom Row */}
                                <PositionBox pos="bottom-left" label="Bottom Left" icon={ArrowLeft} />
                                <PositionBox pos="bottom-center" label="Bottom Center" icon={ArrowDown} />
                                <PositionBox pos="bottom-right" label="Bottom Right" icon={ArrowRight} />
                            </div>

                             <button 
                                onClick={handleProcess}
                                disabled={status === MergeStatus.PROCESSING}
                                className={`
                                w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all
                                ${status === MergeStatus.PROCESSING
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-100'
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
                                    Add Numbers
                                    <LayoutTemplate size={20} className="transition-transform group-hover:scale-110" />
                                </>
                                )}
                            </button>
                        </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};