import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, Hash, Loader2, CheckCircle, RefreshCw, Download, AlertCircle, ArrowDown } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { addPageNumbers, downloadPdfBlob } from '../utils/pdfHelpers';

export const PdfPageNumbers: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right' | 'top-center'>('bottom-center');
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [resultPdfData, setResultPdfData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      event.target.value = '';
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setResultPdfData(null);
    setErrorMessage(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      // Defaulting startNumber to 1 as the option was removed from UI
      const result = await addPageNumbers(file.file, position, 1);
      setResultPdfData(result);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (resultPdfData) {
      downloadPdfBlob(resultPdfData, `numbered-${file?.file.name}`);
    }
  };

  const handleReset = () => {
    removeFile();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Add Page Numbers</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Number your PDF pages instantly for professional reports and legal documents.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Customizable • Secure
              </span>
            </p>
          </div>

          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-green-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-500 mb-8">Page numbers added to your document.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-glow-500 to-glow-600 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
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
                      <p className="text-gray-400 mb-6">Add sequential numbers to your file</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all"
                      >
                        Select PDF File
                      </button>
                    </>
                  ) : (
                     <div className="w-full flex flex-col items-center">
                        {/* File Card */}
                        <div className="flex items-center justify-between w-full max-w-md bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-slide-up mb-8">
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

                        {/* Controls */}
                        <div className="w-full max-w-xs mb-8 text-left">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Position</label>
                                <div className="relative">
                                    <select 
                                        value={position} 
                                        onChange={(e) => setPosition(e.target.value as any)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="bottom-center">Bottom Center</option>
                                        <option value="bottom-right">Bottom Right</option>
                                        <option value="top-center">Top Center</option>
                                        <option value="top-right">Top Right</option>
                                    </select>
                                    <ArrowDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleProcess}
                            disabled={status === MergeStatus.PROCESSING}
                            className={`
                            w-full max-w-xs flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all
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
                                Add Page Numbers
                                <Hash size={20} className="transition-transform group-hover:scale-110" />
                            </>
                            )}
                        </button>
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