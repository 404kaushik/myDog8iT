import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import { Upload, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onImageProcessed: (text: string) => void;
}

export default function ImageUpload({ onImageProcessed }: Props) {
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);

  const processImage = useCallback(async (file: File) => {
    setProcessingStatus('processing');
    setFileName(file.name);

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log(m),
      });

      if (text.trim()) {
        onImageProcessed(text);
        setProcessingStatus('idle');
      } else {
        setProcessingStatus('error');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingStatus('error');
    }
  }, [onImageProcessed]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processImage(acceptedFiles[0]);
    }
  }, [processImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB max file size
  });

  const clearFile = () => {
    setFileName(null);
    setProcessingStatus('idle');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div 
        {...getRootProps()}
        className={`
          w-full rounded-xl border-2 border-dashed transition-all duration-300
          ${isDragActive 
            ? 'border-teal-500 bg-teal-900/20' 
            : 'border-[#334155] bg-[#1e293b] hover:border-teal-500'}
          flex items-center justify-center p-2 md:p-4 cursor-pointer
        `}
      >
        <input {...getInputProps()} />
        {processingStatus === 'processing' ? (
          <div className="flex items-center text-gray-400 space-x-2">
            <div className="animate-spin">
              <FileText className="w-6 h-6" />
            </div>
            <span>Processing image...</span>
          </div>
        ) : processingStatus === 'error' ? (
          <div className="flex items-center text-red-400 space-x-2">
            <X className="w-6 h-6" />
            <span>Failed to extract text. Try another image.</span>
            <button 
              onClick={clearFile} 
              className="ml-2 text-sm text-white bg-red-500 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-teal-500" />
              <span className="text-gray-300 truncate max-w-[200px]">{fileName}</span>
            </div>
            <button 
              onClick={clearFile} 
              className="text-sm text-white bg-red-500 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Upload className="w-8 h-4 md:h-8 mb-2" />
            <p className="text-center text-xs md:text-base">
              {isDragActive 
                ? 'Drop the image here...' 
                : 'Drag & drop an image, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 5MB
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}