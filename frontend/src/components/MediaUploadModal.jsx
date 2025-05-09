import React, { useState, useEffect, useRef } from 'react';
import useAlbums from '../hooks/useAlbums';
import useMedia from '../hooks/useMedia';
import { toast } from 'react-toastify';
import { validateFile, ALLOWED_TYPES } from '../utils/validateFile';

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
    if (!validateAndSetFile(file)) return;

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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm sm:px-6 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upload Photo / Video
        </h2>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm"
        />

        {error ? (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        ) : (
          <p className="text-gray-400 text-xs mt-2">
            Max size: 50MB. Allowed types: {ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}.
          </p>
        )}

        <select
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm mt-4"
        >
          {albums.map((a) => (
            <option key={a.albumId} value={a.albumId}>
              {a.albumName}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={submitting}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
          >
            {submitting ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}