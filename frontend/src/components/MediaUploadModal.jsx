import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import useAlbums from '../hooks/useAlbums';
import useMedia from '../hooks/useMedia';
import { toast } from 'react-toastify';
import { validateFile, ALLOWED_TYPES, MAX_SIZE_MB } from '../utils/validateFile';

export default function MediaUploadModal({ onClose }) {
  const { albums } = useAlbums();
  const [albumId, setAlbumId] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { upload } = useMedia(albumId);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (albums.length) setAlbumId(albums[0].albumId);
  }, [albums]);

  const validateAndSetFile = (selectedFile) => {
    const { valid, reason } = validateFile(selectedFile);
    if (!valid) {
      setError(reason);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      return false;
    }

    setError('');
    setFile(selectedFile);
    return true;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return setError('Select a photo or video');
    if (!albumId) return setError('Choose an album');

    setSubmitting(true);
    try {
      await upload(file);
      toast.success('Media uploaded successfully');
      onClose();
    } catch {
      toast.error('Upload failed');
      setError('Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm sm:px-6 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Upload Photo / Video
        </h2>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-sm"
        />

        {error ? (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
            Max size: {MAX_SIZE_MB} MB. Allowed types: {ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}.
          </p>
        )}

        <select
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-sm mt-4"
        >
          {albums.map((a) => (
            <option key={a.albumId} value={a.albumId}>
              {a.albumName}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-between space-x-2">
          {/* Cancel */}
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
            disabled={submitting}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          {/* Upload */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleUpload}
            disabled={submitting}
            sx={{ textTransform: 'none' }}
          >
            {submitting ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
}