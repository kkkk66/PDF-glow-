import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, Minimize2, Loader2, CheckCircle, RefreshCw, Download, Settings, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { compressPdf, downloadBlob } from '../utils/pdfHelpers';

type CompressionLevel = 'recommended' | 'extreme';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [compressedPdfData, setCompressedPdfData] = useState<Uint8Array | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile({
        id: Math.random().toString(36).substring(7),
        file: selectedFile
      });
      setOriginalSize(selectedFile.size);
      event.target.value = '';
      setStatus(MergeStatus.IDLE);
      setCompressedPdfData(null);
      setErrorMessage(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setCompressedPdfData(null);
    setErrorMessage(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      // Configuration based on level - TUNED FOR BETTER REDUCTION & READABILITY
      // Recommended: 0.7 quality (better for text), 1.0 scale (72DPI)
      // Extreme: 0.5 quality, 0.7 scale (Low Res)
      const quality = compressionLevel === 'recommended' ? 0.7 : 0.5;
      const scale = compressionLevel === 'recommended' ? 1.0 : 0.7;

      const result = await compressPdf(file.file, quality, scale);
      
      setCompressedPdfData(result);
      setCompressedSize(result.byteLength);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during compression.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (compressedPdfData) {
      downloadBlob(compressedPdfData, `compressed-${file?.file.name}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setCompressedPdfData(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setErrorMessage(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100);
    return Math.max(0, savings);
  };

  const isEffective = compressedSize < originalSize;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tool Card */}
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        {/* Glow Effects Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-glow-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Compress PDF</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Reduce the file size of your PDFs while maintaining quality.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Secure Client-Side Processing
              </span>
            </p>
          </div>

          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              {isEffective ? (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle className="text-green-500 w-8 h-8" />
                  </div>
              ) : (
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <AlertTriangle className="text-amber-500 w-8 h-8" />
                  </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {isEffective ? 'PDF Compressed!' : 'Already Optimized'}
              </h3>
              
              {/* Stats Card */}
              <div className="bg-gray-50 rounded-xl p-6 w-full max-w-md border border-gray-200 mb-8 mt-4">
                 <div className="flex justify-between items-center mb-4">
                    <div className="text-left">
                       <p className="text-xs text-gray-400 uppercase font-semibold">Original Size</p>
                       <p className="font-medium text-gray-700">{formatSize(originalSize)}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-gray-400 uppercase font-semibold">
                           {isEffective ? 'Compressed Size' : 'Final Size'}
                       </p>
                       <p className={`font-bold ${isEffective ? 'text-green-600' : 'text-gray-700'}`}>
                           {formatSize(compressedSize)}
                       </p>
                    </div>
                 </div>
                 
                 {isEffective ? (
                     <>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${100 - calculateSavings()}%` }}></div>
                        </div>
                        <p className="text-center text-sm font-semibold text-green-600">
                            Reduced by {calculateSavings()}%
                        </p>
                     </>
                 ) : (
                     <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-center">
                         <p className="text-sm text-amber-700 font-medium">
                             This file is already highly compressed. <br/>
                             We kept the original to preserve quality.
                         </p>
                     </div>
                 )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                {isEffective && (
                    <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-glow-500 to-glow-600 text-white px-8 py-4 rounded-xl font-semibold shadow-pink-glow hover:shadow-pink-glow-lg transition-all transform hover:-translate-y-1"
                    >
                    <Download size={20} />
                    Download PDF
                    </button>
                )}
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <RefreshCw size={20} />
                  {isEffective ? 'Compress Another' : 'Try Another File'}
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
                    <p className="font-semibold text-sm">Compression Failed</p>
                    <p className="text-sm opacity-90">{errorMessage}</p>
                  </div>
                  <button onClick={() => setStatus(MergeStatus.IDLE)} className="p-1 hover:bg-red-100 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Information Banner about Rasterization */}
              {!file && (
                <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-blue-700">
                    <Info size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">How compression works</p>
                        <p className="text-sm opacity-90">
                            To achieve maximum size reduction securely in your browser, this tool converts PDF pages into optimized images (flattening). 
                            <span className="font-bold"> Note: Text in the output PDF may not be selectable.</span>
                        </p>
                    </div>
                </div>
              )}

              {/* Upload Area */}
              <div 
                className={`border-3 border-dashed rounded-3xl transition-all duration-300 ${
                  file 
                    ? 'border-glow-200 bg-glow-50/50' 
                    : 'border-gray-200 hover:border-glow-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  {!file ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <Upload className="text-glow-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Select PDF to Compress</h3>
                      <p className="text-gray-400 mb-6">Optimize for Web, Email, or Storage</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all"
                      >
                        Select PDF File
                      </button>
                    </>
                  ) : (
                     <div className="w-full max-w-lg">
                        <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-slide-up mb-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <FileIcon className="text-red-500 w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 truncate max-w-[200px]">{file.file.name}</p>
                              <p className="text-sm text-gray-400">{formatSize(originalSize)}</p>
                            </div>
                          </div>
                          <button 
                            onClick={removeFile}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Compression Settings */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-left">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Settings size={14} /> Compression Level
                            </h4>
                            
                            <div className="space-y-3">
                                <label className={`
                                    flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all
                                    ${compressionLevel === 'recommended' 
                                        ? 'border-glow-500 bg-glow-50' 
                                        : 'border-gray-100 hover:border-gray-200'}
                                `}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'recommended' ? 'border-glow-500' : 'border-gray-300'}`}>
                                            {compressionLevel === 'recommended' && <div className="w-2.5 h-2.5 rounded-full bg-glow-500"></div>}
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-800 block">Standard Compression</span>
                                            <span className="text-xs text-gray-500">Good balance for most documents (Recommended)</span>
                                        </div>
                                    </div>
                                    <input 
                                        type="radio" 
                                        name="compression" 
                                        className="hidden" 
                                        checked={compressionLevel === 'recommended'} 
                                        onChange={() => setCompressionLevel('recommended')} 
                                    />
                                </label>

                                <label className={`
                                    flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all
                                    ${compressionLevel === 'extreme' 
                                        ? 'border-glow-500 bg-glow-50' 
                                        : 'border-gray-100 hover:border-gray-200'}
                                `}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${compressionLevel === 'extreme' ? 'border-glow-500' : 'border-gray-300'}`}>
                                            {compressionLevel === 'extreme' && <div className="w-2.5 h-2.5 rounded-full bg-glow-500"></div>}
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-800 block">Extreme Compression</span>
                                            <span className="text-xs text-gray-500">Low resolution, maximum size reduction</span>
                                        </div>
                                    </div>
                                    <input 
                                        type="radio" 
                                        name="compression" 
                                        className="hidden" 
                                        checked={compressionLevel === 'extreme'} 
                                        onChange={() => setCompressionLevel('extreme')} 
                                    />
                                </label>
                            </div>
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

              {/* Action Bar */}
              {file && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleCompress}
                    disabled={status === MergeStatus.PROCESSING}
                    className={`
                      relative group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all
                      bg-gradient-to-r from-glow-500 to-glow-600 text-white shadow-pink-glow hover:shadow-pink-glow-lg hover:scale-105 active:scale-100
                    `}
                  >
                    {status === MergeStatus.PROCESSING ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      <>
                        Compress PDF
                        <Minimize2 size={20} className="transition-transform group-hover:scale-110" />
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