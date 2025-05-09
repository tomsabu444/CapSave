import React, { useState, useEffect, useRef } from 'react';
import useAlbums from '../hooks/useAlbums';
import useMedia from '../hooks/useMedia';
import { toast } from 'react-toastify';

export default function MediaUploadModal({ onClose }) {
  const { albums } = useAlbums();
  const [albumId, setAlbumId] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { upload } = useMedia(albumId);
  const fileInputRef = useRef(null); // ✅ ref for file input

  useEffect(() => {
    if (albums.length) setAlbumId(albums[0].albumId);
  }, [albums]);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleUpload = async () => {
    if (!file) return setError('Select a photo or video');
    if (!albumId) return setError('Choose an album');
    if (file.size > MAX_FILE_SIZE) {
      const msg = 'File size must be under 50MB';
      setError(msg);
      toast.error(msg);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null; // ✅ reset
      return;
    }

    setError('');
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

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size > MAX_FILE_SIZE) {
      const msg = 'Selected file exceeds 50MB';
      setError(msg);
      toast.error(msg);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null; // ✅ reset
    } else {
      setError('');
      setFile(selected);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upload Photo / Video
        </h2>

        <input
          type="file"
          ref={fileInputRef} // ✅ attach ref
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm"
        />

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

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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