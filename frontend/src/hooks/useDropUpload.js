import { useEffect, useState } from 'react';
import { validateFile } from '../utils/validateFile';
import { toast } from 'react-toastify';

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
      const validFiles = [];
      const rejectedFiles = [];

      files.forEach((file) => {
        const { valid, reason } = validateFile(file);
        if (valid) {
          validFiles.push(file);
        } else {
          rejectedFiles.push({ name: file.name, reason });
        }
      });

      if (rejectedFiles.length > 0) {
        const names = rejectedFiles.map(f => `"${f.name}"`).join(', ');
        toast.error(
          `Rejected ${rejectedFiles.length} file(s): ${names}`,
          { autoClose: 4000, pauseOnHover: true }
        );
      }

      if (validFiles.length > 0) {
        onDrop(validFiles);
      }
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
