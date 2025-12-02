import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, ArrowRight, Loader2, CheckCircle, Download, RefreshCw, FolderDown, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { convertPdfToImages, createZip, downloadBlob } from '../utils/pdfHelpers';

export const PdfToJpg: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [images, setImages] = useState<{ filename: string; data: Uint8Array; preview: string }[]>([]);
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
      setImages([]);
      setErrorMessage(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setImages([]);
    setErrorMessage(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      const result = await convertPdfToImages(file.file);
      // Create previews for display
      const imagesWithPreview = result.map(img => ({
        ...img,
        preview: URL.createObjectURL(new Blob([img.data], { type: 'image/jpeg' }))
      }));
      setImages(imagesWithPreview);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during conversion.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownloadZip = async () => {
    if (images.length > 0) {
      const zipBlob = await createZip(images.map(({ filename, data }) => ({ filename, data })));
      downloadBlob(zipBlob, `converted-images-${Date.now()}.zip`);
    }
  };

  const handleDownloadSingle = (fileData: Uint8Array, filename: string) => {
    downloadBlob(new Blob([fileData], { type: 'image/jpeg' }), filename);
  };

  const handleReset = () => {
    // Cleanup preview URLs
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setImages([]);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tool Card */}
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        {/* Glow Effects Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">PDF to JPG</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Convert PDF pages into high-quality image files.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Extract Images • Client-Side • Secure
              </span>
            </p>
          </div>

          {/* Success State */}
          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-green-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Conversion Complete!</h3>
              <p className="text-gray-500 mb-8">Generated {images.length} images from your PDF.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md justify-center">
                <button 
                  onClick={handleDownloadZip}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-glow-500 to-glow-600 text-white px-8 py-4 rounded-xl font-semibold shadow-pink-glow hover:shadow-pink-glow-lg transition-all transform hover:-translate-y-1"
                >
                  <FolderDown size={20} />
                  Download All (ZIP)
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <RefreshCw size={20} />
                  Convert Another
                </button>
              </div>

              {/* Images Grid */}
              <div className="w-full">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <ImageIcon size={16} /> Extracted Images
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 aspect-[3/4] animate-fade-in-up">
                      <img src={img.preview} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => handleDownloadSingle(img.data, img.filename)}
                            className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors transform hover:scale-105"
                          >
                            <Download size={14} /> Save
                          </button>
                      </div>
                      
                      {/* Page Badge */}
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Page {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
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

              {/* Upload Area */}
              <div 
                className={`border-3 border-dashed rounded-3xl transition-all duration-300 ${
                  file 
                    ? 'border-glow-200 bg-glow-50/50' 
                    : 'border-gray-200 hover:border-glow-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  {!file ? (
                    <>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                        <Upload className="text-glow-500 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Drop your PDF file here</h3>
                      <p className="text-gray-400 mb-6">or click to browse your computer</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all"
                      >
                        Select PDF
                      </button>
                    </>
                  ) : (
                     <div className="w-full max-w-lg">
                        <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-slide-up">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <FileIcon className="text-red-500 w-6 h-6" />
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
                        <div className="mt-4 text-center">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-glow-600 hover:text-glow-700 font-medium hover:underline"
                            >
                                Change file
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

              {/* Action Bar */}
              {file && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleConvert}
                    disabled={status === MergeStatus.PROCESSING}
                    className={`
                      relative group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all
                      bg-gradient-to-r from-glow-500 to-glow-600 text-white shadow-pink-glow hover:shadow-pink-glow-lg hover:scale-105 active:scale-100
                    `}
                  >
                    {status === MergeStatus.PROCESSING ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Convert to Images
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
