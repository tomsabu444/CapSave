import React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import useMedia from '../hooks/useMedia';

export default function MediaGallery({ albumId }) {
  const { items, loading, error, remove } = useMedia(albumId);

  if (loading) {
    return <p className="text-gray-400">Loading media…</p>;
  }
  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }
  if (!items.length) {
    return <p className="text-gray-400">No media in this album yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((m) => (
        <div key={m.mediaId} className="relative group">
          {m.mediaType === 'photo' ? (
            <img
              src={m.mediaUrl}
              alt=""
              className="w-full h-32 object-cover rounded"
            />
          ) : (
            <video
              src={m.mediaUrl}
              className="w-full h-32 object-cover rounded"
              controls
            />
          )}
          <IconButton
            size="small"
            className="absolute top-1 right-1 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
            onClick={() => remove(m.mediaId)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
