import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAlbums from "../hooks/useAlbums";
import useMedia from "../hooks/useMedia";
import useDropUpload from "../hooks/useDropUpload";
import MediaGallery from "../components/MediaGallery";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { toast } from "react-toastify";

export default function MediaGalleryPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { albums, loading, error } = useAlbums();
  const {
    items,
    loading: mediaLoading,
    error: mediaError,
    upload,
    remove,
  } = useMedia(albumId);

  const { isDragging } = useDropUpload({
    onDrop: async (files) => {
      for (const file of files) {
        try {
          await upload(file);
          toast.success(`Uploaded: ${file.name}`);
        } catch (err) {
          console.error("Upload failed:", err.message);
          toast.error(`Failed to upload: ${file.name}`);
        }
      }
    },
  });

  if (loading) {
    return <p className="p-6 text-gray-500 dark:text-gray-400 text-center">Loading album…</p>;
  }

  const album = albums.find((a) => a.albumId === albumId);
  if (!album) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <p className="text-lg">Album not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600 border border-blue-500 rounded-lg text-sm"
        >
          Back to Albums
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-950 p-6 relative transition-all ${
        isDragging ? "ring-4 ring-blue-400 ring-opacity-50" : ""
      }`}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 bg-opacity-50 z-40 flex items-center justify-center pointer-events-none text-blue-700 dark:text-blue-200 font-semibold text-lg">
          Drop files to upload
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-600 flex items-center font-medium"
        >
          <ArrowBackIosNewIcon fontSize="small" className="mr-1" />
          <p className="text-lg"> Back </p>
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Drag & drop image/video into this album
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
        {album.albumName}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {album.count || 0} items • Created{" "}
        {new Date(album.createdAt).toLocaleDateString()}
      </p>

      <MediaGallery
        albumId={albumId}
        items={items}
        loading={mediaLoading}
        error={mediaError}
        remove={remove}
      />
    </div>
  );
}
