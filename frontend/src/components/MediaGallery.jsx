import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FullScreenView from './FullScreenView';

function MediaPreview({ media, onClick }) {
  return (
    <div
      className="relative w-full aspect-square rounded-md overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {media.mediaType === 'photo' ? (
        <img
          src={media.mediaUrl}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <video
          src={media.mediaUrl}
          className="w-full h-full object-cover"
          controls
        />
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white text-sm font-medium">View</span>
      </div>
    </div>
  );
}

export default function MediaGallery({ albumId ,items, loading, error, remove }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  if (loading) {
    return <p className="p-6 text-gray-500 text-center">Loading media…</p>;
  }
  if (error) {
    return <p className="p-6 text-red-500 text-center">Error: {error.message}</p>;
  }
  if (!items.length) {
    return (
      <p className="p-6 text-gray-500 text-center">
        No media in this album yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((m) => ( 
        <div
          key={m.mediaId}
          className="relative bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <MediaPreview media={m} onClick={() => setSelectedMedia(m)} />
          <button
            onClick={() => remove(m.mediaId)}
            className="absolute top-2 right-2 p-1 bg-gray-800/50 text-red-500 hover:text-red-600 rounded-full transition-colors duration-200"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      ))}
      {selectedMedia && (
        <FullScreenView
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}