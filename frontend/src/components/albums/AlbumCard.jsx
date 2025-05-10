import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AlbumCard({
  album,
  onOpen,
  onOpenRename,
  onOpenDelete,
}) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onClick={onOpen}
    >
      {/* Cover */}
      <div className="w-full h-52 bg-gray-200 dark:bg-gray-700">
        {album.coverUrl ? (
          album.coverType === "video" ? (
            <video
              src={album.coverUrl}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={album.coverUrl}
              alt={album.albumName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-300 text-sm">
            No Images
          </div>
        )}
      </div>

      {/* Info row */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {album.albumName}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {album.count || 0} items
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenRename();
            }}
            className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDelete();
            }}
            className="p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}
