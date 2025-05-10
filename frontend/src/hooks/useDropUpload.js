import { useEffect, useState } from 'react';
import { validateFile } from '../utils/validateFile';

export default function useDropUpload({ onDrop }) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);

      const validFiles = files.filter((file) => {
        const { valid } = validateFile(file);
        return valid;
      });

      if (validFiles.length === 0) {
        console.warn('[DropUpload] All dropped files were invalid');
        return;
      }

      onDrop(validFiles);
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onDrop]);

  return { isDragging };
}
