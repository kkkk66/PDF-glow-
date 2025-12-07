import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
  subLabel?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  multiple = false, 
  accept = "application/pdf",
  label = "Drop your files here",
  subLabel = "or click to browse"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      // Filter if needed based on accept prop, but simplified here
      onFilesSelected(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ''; // Reset
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        border-3 border-dashed rounded-3xl transition-all duration-300 cursor-pointer
        flex flex-col items-center justify-center py-10 md:py-16 px-4 text-center select-none
        ${isDragging 
          ? 'border-glow-500 bg-glow-50 scale-[1.02] shadow-pink-glow' 
          : 'border-gray-200 hover:border-glow-300 hover:bg-gray-50'
        }
      `}
    >
      <div className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 transition-transform ${isDragging ? 'scale-110' : ''}`}>
        <Upload className={`w-8 h-8 md:w-10 md:h-10 ${isDragging ? 'text-glow-600' : 'text-glow-500'}`} />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{label}</h3>
      <p className="text-gray-400 mb-6 text-sm md:text-base">{subLabel}</p>
      <button 
        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all w-full sm:w-auto pointer-events-none"
      >
        Select Files
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInput} 
        className="hidden" 
        accept={accept} 
        multiple={multiple} 
      />
    </div>
  );
};