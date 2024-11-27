'use client'
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';

interface Props {
  onImageProcessed: (text: string) => void;
}

export default function ImageUpload({ onImageProcessed }: Props) {
  const processImage = async (file: File) => {
    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      onImageProcessed(text);
      
      await worker.terminate();
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      processImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-200 rounded-xl p-6 
                 text-center cursor-pointer hover:border-gray-300 transition-all"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-sm text-gray-500">Drop the image here...</p>
      ) : (
        <p className="text-sm text-gray-500">
          Drag & drop an image, or click to select
        </p>
      )}
    </div>
  );
}