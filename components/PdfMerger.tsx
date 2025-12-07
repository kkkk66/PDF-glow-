import React, { useState, useRef } from 'react';
import { X, File as FileIcon, ArrowRight, Loader2, CheckCircle, Download, RefreshCw, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { mergePdfs, downloadPdfBlob } from '../utils/pdfHelpers';
import { FileUploader } from './FileUploader';

export const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [mergedPdfData, setMergedPdfData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (newFilesRaw: File[]) => {
    const newFiles: UploadedFile[] = newFilesRaw.map(file => ({
      id: Math.random().toString(36).substring(7),
      file: file
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setErrorMessage(null);
    setStatus(MergeStatus.IDLE);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setErrorMessage(null);
    setStatus(MergeStatus.IDLE);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setFiles(prev => {
        const newFiles = [...prev];
        if (direction === 'up' && index > 0) {
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        } else if (direction === 'down' && index < newFiles.length - 1) {
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        }
        return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      const rawFiles = files.map(f => f.file);
      const mergedBytes = await mergePdfs(rawFiles);
      
      setMergedPdfData(mergedBytes);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during merge.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (mergedPdfData) {
      downloadPdfBlob(mergedPdfData, `merged-pdf-glow-${Date.now()}.pdf`);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus(MergeStatus.IDLE);
    setMergedPdfData(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="p-6 md:p-12 relative z-10">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">Merge PDF Files</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
              Combine multiple PDFs into one unified document. 
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-xs mt-2 inline-block">
                100% Client-Side Processing
              </span>
            </p>
          </div>

          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 md:py-12 animate-fade-in">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-green-500 w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Files Merged Successfully!</h3>
              <p className="text-gray-500 mb-8 text-sm md:text-base">Your document is ready to download.</p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-glow-500 to-glow-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold shadow-pink-glow hover:shadow-pink-glow-lg transition-all transform hover:-translate-y-1"
                >
                  <Download size={20} />
                  Download PDF
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-600 px-6 py-3 md:px-6 md:py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <RefreshCw size={20} />
                  Merge New
                </button>
              </div>
            </div>
          ) : (
            <>
              {status === MergeStatus.ERROR && errorMessage && (
                <div className="mb-6 md:mb-8 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-fade-in shadow-sm">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Merge Failed</p>
                    <p className="text-sm opacity-90">{errorMessage}</p>
                  </div>
                  <button onClick={() => setStatus(MergeStatus.IDLE)} className="p-1 hover:bg-red-100 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}

              {files.length === 0 ? (
                <FileUploader 
                  onFilesSelected={handleFilesSelected} 
                  multiple={true}
                  label="Drop PDF files here"
                  subLabel="or click to browse your computer"
                />
              ) : (
                <div className="w-full max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-4 md:mb-6 px-2">
                        <h3 className="font-bold text-gray-700 text-sm md:text-base">Selected Files ({files.length})</h3>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-glow-600 hover:text-glow-700 font-medium hover:underline"
                        >
                          + Add more files
                        </button>
                        {/* Hidden input for adding more files */}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))} 
                          className="hidden" 
                          accept="application/pdf" 
                          multiple 
                        />
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-8">
                      {files.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm animate-slide-up group">
                          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => moveFile(index, 'up')} 
                                    disabled={index === 0}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                >
                                    <ArrowUp size={14} />
                                </button>
                                <button 
                                    onClick={() => moveFile(index, 'down')} 
                                    disabled={index === files.length - 1}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                >
                                    <ArrowDown size={14} />
                                </button>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileIcon className="text-red-500 w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="text-left overflow-hidden">
                              <p className="font-semibold text-gray-700 truncate text-sm md:text-base">{item.file.name}</p>
                              <p className="text-xs text-gray-400">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFile(item.id)}
                            className="p-1.5 md:p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors flex-shrink-0"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                </div>
              )}

              {files.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={handleMerge}
                    disabled={files.length < 2 || status === MergeStatus.PROCESSING}
                    className={`
                      relative group flex items-center justify-center gap-3 px-8 py-4 md:px-10 rounded-full font-bold text-base md:text-lg transition-all w-full sm:w-auto
                      ${files.length < 2 
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
                        Merge PDFs Now
                        <ArrowRight size={20} className={`transition-transform ${files.length >= 2 ? 'group-hover:translate-x-1' : ''}`} />
                      </>
                    )}
                  </button>
                </div>
              )}
              {files.length === 1 && (
                 <p className="text-center text-amber-500 text-xs md:text-sm mt-4 bg-amber-50 inline-block px-4 py-2 rounded-full mx-auto w-full max-w-md">
                   Please select at least one more file to merge.
                 </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};