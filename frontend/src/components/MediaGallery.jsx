import React, { useState, Suspense, lazy } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import FullScreenView from "./FullScreenView";
import Loader from "./Loader";
function MediaPreview({ media, onClick }) {
  return (
    <div
      className="relative w-full aspect-square rounded-md overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {media.mediaType === "photo" ? (
        <img
          src={media.mediaUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <video
          src={media.mediaUrl}
          className="w-full h-full object-cover"
          controls
          preload="metadata"
        />
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white text-sm font-medium">View</span>
      </div>
    </div>
  );
}

function formatMonthKey(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDayKey(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function MediaGallery({ items, loading, error, remove }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  if (loading) {
    return <Loader />;
  }

  if (!items.length) {
    return (
      <p className="p-6 text-gray-500 dark:text-gray-400 text-center">
        No media in this album yet.
      </p>
    );
  }

  const grouped = {};
  items.forEach((media) => {
    const monthKey = formatMonthKey(media.createdAt);
    const dayKey = formatDayKey(media.createdAt);

    grouped[monthKey] = grouped[monthKey] || {};
    grouped[monthKey][dayKey] = grouped[monthKey][dayKey] || [];
    grouped[monthKey][dayKey].push(media);
  });

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([month, days]) => (
        <div key={month}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {month}
          </h1>

          {Object.entries(days).map(([day, mediaList]) => (
            <div key={day} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {day}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((m) => (
                  <div
                    key={m.mediaId}
                    className="relative bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <MediaPreview
                      media={m}
                      onClick={() => setSelectedMedia(m)}
                    />
                    <button
                      onClick={async () => {
                        try {
                          await remove(m.mediaId);
                          toast.success("Media deleted");
                        } catch (err) {
                          console.error(err);
                          toast.error(`Failed to delete media: ${err.message}`);
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-gray-800/50 dark:bg-gray-600/50 text-red-500 hover:text-red-600 rounded-full transition-colors duration-200"
                    >
                      <DeleteIcon fontSize="medium" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
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