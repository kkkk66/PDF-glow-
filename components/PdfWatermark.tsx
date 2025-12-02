import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, Stamp, Loader2, CheckCircle, RefreshCw, Download, AlertCircle, Settings } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { addWatermark, getPdfPreview, downloadPdfBlob } from '../utils/pdfHelpers';

export const PdfWatermark: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [text, setText] = useState<string>('CONFIDENTIAL');
  const [opacity, setOpacity] = useState<number>(0.3);
  const [size, setSize] = useState<number>(60);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [watermarkedPdfData, setWatermarkedPdfData] = useState<Uint8Array | null>(null);
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
      setWatermarkedPdfData(null);
      setErrorMessage(null);
      
      const preview = await getPdfPreview(selectedFile);
      setPreviewUrl(preview);
      
      event.target.value = '';
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setStatus(MergeStatus.IDLE);
    setWatermarkedPdfData(null);
    setErrorMessage(null);
  };

  const handleProcess = async () => {
    if (!file || !text) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      const result = await addWatermark(file.file, text, opacity, size);
      setWatermarkedPdfData(result);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during watermarking.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (watermarkedPdfData) {
      downloadPdfBlob(watermarkedPdfData, `watermarked-${file?.file.name}`);
    }
  };

  const handleReset = () => {
    removeFile();
  };

  useEffect(() => {
    return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Add Watermark</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Stamp text over your PDF pages to protect your intellectual property.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Customizable • Secure
              </span>
            </p>
          </div>

          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-teal-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Watermark Added!</h3>
              <p className="text-gray-500 mb-8">Your document has been updated.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
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
                    ? 'border-teal-200 bg-teal-50/30' 
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  {!file ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <Stamp className="text-teal-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Select PDF</h3>
                      <p className="text-gray-400 mb-6">Add "Confidential", "Draft", or Custom Text</p>
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
                        <div className="w-full md:w-1/2 p-4">
                             <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-slide-up mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileIcon className="text-teal-500 w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                    <p className="font-bold text-gray-700 truncate max-w-[150px]">{file.file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button onClick={removeFile} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Watermark Text</label>
                                    <input 
                                        type="text" 
                                        value={text} 
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                        placeholder="E.g. CONFIDENTIAL"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Opacity ({Math.round(opacity * 100)}%)</label>
                                    <input 
                                        type="range" 
                                        min="0.1" 
                                        max="1" 
                                        step="0.1"
                                        value={opacity} 
                                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Text Size ({size}px)</label>
                                    <input 
                                        type="range" 
                                        min="20" 
                                        max="150" 
                                        step="5"
                                        value={size} 
                                        onChange={(e) => setSize(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                    />
                                </div>
                            </div>

                             <button 
                                onClick={handleProcess}
                                disabled={status === MergeStatus.PROCESSING || !text}
                                className={`
                                w-full mt-8 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all
                                ${(status === MergeStatus.PROCESSING || !text)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-100'
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
                                    Add Watermark
                                    <Stamp size={20} className="transition-transform group-hover:scale-110" />
                                </>
                                )}
                            </button>
                        </div>

                        {/* Right: Preview */}
                        <div className="w-full md:w-1/2 p-4 bg-gray-100 rounded-2xl flex items-center justify-center min-h-[400px]">
                            {previewUrl ? (
                                <div className="relative shadow-lg max-w-full">
                                    <img src={previewUrl} alt="Preview" className="max-h-[400px] w-auto bg-white rounded border border-gray-300" />
                                    {/* Visual Simulation of Watermark Overlay */}
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                                    >
                                        <div 
                                            style={{ 
                                                transform: 'rotate(-45deg)',
                                                opacity: opacity,
                                                fontSize: `${size / 2}px`, // approximate scale for preview
                                                color: '#888',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {text}
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                        Preview
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Loader2 className="animate-spin mb-2" />
                                    <span className="text-sm">Loading Preview...</span>
                                </div>
                            )}
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