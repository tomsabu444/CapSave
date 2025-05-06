// src/components/MediaUploadModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import useAlbums from '../hooks/useAlbums';
import useMedia from '../hooks/useMedia';

export default function MediaUploadModal({ onClose }) {
  const { albums }           = useAlbums();
  const [albumId, setAlbumId] = useState('');
  const [file, setFile]       = useState(null);
  const [error, setError]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { upload } = useMedia(albumId);

  useEffect(() => {
    if (albums.length) setAlbumId(albums[0].albumId);
  }, [albums]);

  const handleUpload = async () => {
    if (!file)    return setError('Select a photo or video');
    if (!albumId) return setError('Choose an album');
    setError('');
    setSubmitting(true);
    try {
      await upload(file);
      onClose();
    } catch {
      setError('Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal content */}
      <div
        className="bg-gray-900 p-6 rounded-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Upload Photo / Video
        </h2>

        <TextField
          type="file"
          inputProps={{ accept: 'image/*,video/*' }}
          fullWidth
          onChange={(e) => setFile(e.target.files[0])}
        />

        <Select
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          fullWidth
          className="mt-4"
          variant="outlined"
          size="small"
        >
          {albums.map((a) => (
            <MenuItem key={a.albumId} value={a.albumId}>
              {a.albumName}
            </MenuItem>
          ))}
        </Select>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="mt-6 flex justify-end space-x-2">
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={submitting}
          >
            {submitting ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
}
