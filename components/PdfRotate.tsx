import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, RotateCw, RotateCcw, Loader2, CheckCircle, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { rotatePdf, getPdfPreview, downloadPdfBlob } from '../utils/pdfHelpers';

export const PdfRotate: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [rotatedPdfData, setRotatedPdfData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile({
        id: Math.random().toString(36).substring(7),
        file: selectedFile
      });
      
      // Reset states
      setRotation(0);
      setStatus(MergeStatus.IDLE);
      setRotatedPdfData(null);
      setErrorMessage(null);
      
      // Generate preview
      const preview = await getPdfPreview(selectedFile);
      setPreviewUrl(preview);
      
      event.target.value = '';
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl('');
    setRotation(0);
    setStatus(MergeStatus.IDLE);
    setRotatedPdfData(null);
    setErrorMessage(null);
  };

  const rotateLeft = () => setRotation(prev => prev - 90);
  const rotateRight = () => setRotation(prev => prev + 90);

  const handleProcess = async () => {
    if (!file) return;
    
    // If no rotation needed, just warn or allow?
    if (rotation === 0) {
        // Maybe user just wants to re-save, allow it.
    }
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      const result = await rotatePdf(file.file, rotation);
      setRotatedPdfData(result);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during rotation.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (rotatedPdfData) {
      downloadPdfBlob(rotatedPdfData, `rotated-${file?.file.name}`);
    }
  };

  const handleReset = () => {
    removeFile();
  };
  
  // Cleanup preview URL on unmount
  useEffect(() => {
      return () => {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
      }
  }, [previewUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tool Card */}
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        {/* Glow Effects Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Rotate PDF Pages</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Correct the orientation of your PDF document permanently.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Simple • Fast • Client-Side
              </span>
            </p>
          </div>

          {/* Success State */}
          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-indigo-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Rotation Applied!</h3>
              <p className="text-gray-500 mb-8">Your document is ready.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <button 
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                  <Download size={20} />
                  Download PDF
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <RefreshCw size={20} />
                  Rotate Another
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
                    <p className="font-semibold text-sm">Rotation Failed</p>
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
                    ? 'border-indigo-200 bg-indigo-50/50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  {!file ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <RotateCw className="text-indigo-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Select PDF to Rotate</h3>
                      <p className="text-gray-400 mb-6">Fix upside down or sideways pages</p>
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
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <FileIcon className="text-indigo-500 w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-700 truncate max-w-[200px]">{file.file.name}</p>
                              <p className="text-sm text-gray-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            onClick={removeFile}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        {/* Preview and Controls */}
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative p-8 bg-gray-100 rounded-2xl border border-gray-200 shadow-inner">
                                {previewUrl ? (
                                    <div className="transition-transform duration-300 ease-out shadow-lg" style={{ transform: `rotate(${rotation}deg)` }}>
                                        <img src={previewUrl} alt="Preview" className="max-h-[300px] max-w-full rounded border border-gray-300 object-contain bg-white" />
                                    </div>
                                ) : (
                                    <div className="w-48 h-64 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-4">
                                <button
                                    onClick={rotateLeft}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all active:scale-95"
                                >
                                    <RotateCcw size={24} className="text-indigo-600" />
                                    <span className="text-xs font-bold text-gray-600">Left 90°</span>
                                </button>
                                
                                <button
                                    onClick={rotateRight}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all active:scale-95"
                                >
                                    <RotateCw size={24} className="text-indigo-600" />
                                    <span className="text-xs font-bold text-gray-600">Right 90°</span>
                                </button>
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
                    onClick={handleProcess}
                    disabled={status === MergeStatus.PROCESSING}
                    className={`
                      relative group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all
                      bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-100
                    `}
                  >
                    {status === MergeStatus.PROCESSING ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Rotating...
                      </>
                    ) : (
                      <>
                        Apply Rotation
                        <CheckCircle size={20} className="transition-transform group-hover:scale-110" />
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