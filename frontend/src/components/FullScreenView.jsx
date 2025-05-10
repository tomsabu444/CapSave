import React from 'react';

export default function FullScreenView({ media, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {media.mediaType === 'photo' ? (
          <img
            src={media.mediaUrl}
            alt=""
            className="max-w-full max-h-[90vh] object-contain"
          />
        ) : (
          <video
            src={media.mediaUrl}
            className="max-w-full max-h-[90vh] object-contain"
            controls
            autoPlay
          />
        )}
      </div>
    </div>
  );
}