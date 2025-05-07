import { useEffect, useState } from 'react';

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

      // Filter only images/videos
      const allowed = files.filter(file =>
        file.type.startsWith('image/') || file.type.startsWith('video/')
      );

      if (allowed.length === 0) {
        console.warn('[DropUpload] Ignored unsupported file types');
        return;
      }

      onDrop(allowed);
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
