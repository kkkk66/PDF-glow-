import React, { useState, useRef } from 'react';
import { X, File as FileIcon, Scissors, Loader2, CheckCircle, RefreshCw, FolderDown, Download, AlertCircle } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { splitPdf, createZip, downloadBlob } from '../utils/pdfHelpers';
import { FileUploader } from './FileUploader';

export const PdfSplitter: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [splitFiles, setSplitFiles] = useState<{ filename: string; data: Uint8Array }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
        setFile({
            id: Math.random().toString(36).substring(7),
            file: files[0]
        });
        setStatus(MergeStatus.IDLE);
        setSplitFiles([]);
        setErrorMessage(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setSplitFiles([]);
    setErrorMessage(null);
  };

  const handleSplit = async () => {
    if (!file) return;
    
    setStatus(MergeStatus.PROCESSING);
    setErrorMessage(null);
    
    try {
      // 100% Client side coding. No AI.
      const result = await splitPdf(file.file);
      setSplitFiles(result);
      setStatus(MergeStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message || "An unexpected error occurred during split.");
      setStatus(MergeStatus.ERROR);
    }
  };

  const handleDownloadZip = async () => {
    if (splitFiles.length > 0) {
      const zipBlob = await createZip(splitFiles);
      downloadBlob(zipBlob, `split-pages-${Date.now()}.zip`);
    }
  };

  const handleDownloadSingle = (fileData: Uint8Array, filename: string) => {
    downloadBlob(fileData, filename);
  };

  const handleReset = () => {
    setFile(null);
    setStatus(MergeStatus.IDLE);
    setSplitFiles([]);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tool Card */}
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative">
        {/* Glow Effects Background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-glow-200 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Split PDF</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Extract every page from your PDF into separate files.
              <br/>
              <span className="text-glow-600 font-semibold bg-glow-50 px-2 py-0.5 rounded-full text-sm mt-2 inline-block">
                Secure Client-Side Processing
              </span>
            </p>
          </div>

          {/* Success State */}
          {status === MergeStatus.SUCCESS ? (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="text-green-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">PDF Split Successfully!</h3>
              <p className="text-gray-500 mb-8">Created {splitFiles.length} separate PDF files.</p>
              
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
                  Split Another
                </button>
              </div>

              {/* Individual Files List */}
              <div className="w-full max-w-2xl bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FileIcon size={16} /> Individual Pages
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {splitFiles.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-glow-300 transition-colors group">
                      <span className="text-sm text-gray-600 truncate max-w-[150px]">{f.filename}</span>
                      <button 
                        onClick={() => handleDownloadSingle(f.data, f.filename)}
                        className="text-glow-500 hover:text-glow-700 p-1.5 hover:bg-glow-50 rounded-md transition-colors"
                        title="Download Page"
                      >
                        <Download size={16} />
                      </button>
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
                    <p className="font-semibold text-sm">Split Failed</p>
                    <p className="text-sm opacity-90">{errorMessage}</p>
                  </div>
                  <button onClick={() => setStatus(MergeStatus.IDLE)} className="p-1 hover:bg-red-100 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Upload Area */}
              {!file ? (
                 <FileUploader onFilesSelected={handleFilesSelected} label="Drop PDF file here" />
              ) : (
                 <div className="w-full max-w-lg mx-auto">
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
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))}
                            className="hidden" 
                            accept="application/pdf" 
                        />
                    </div>
                 </div>
              )}

              {/* Action Bar */}
              {file && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleSplit}
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
                        Split into Pages
                        <Scissors size={20} className="transition-transform group-hover:-rotate-12" />
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