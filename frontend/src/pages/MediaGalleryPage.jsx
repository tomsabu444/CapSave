import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAlbums from '../hooks/useAlbums';
import MediaGallery from '../components/MediaGallery';

export default function MediaGalleryPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { albums, loading, error } = useAlbums();

  if (loading) {
    return <p className="p-6 text-gray-500 text-center">Loading album…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500 text-center">Error: {error.message}</p>;
  }

  const album = albums.find((a) => a.albumId === albumId);
  if (!album) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-lg">Album not found.</p>
        <button
          onClick={() => navigate('/albums')}
          className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Back to Albums
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-600 flex items-center text-sm font-medium transition-colors duration-200"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
        {album.albumName}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {album.count || 0} items • Created{' '}
        {new Date(album.createdAt).toLocaleDateString()}
      </p>

      <MediaGallery albumId={albumId} />
    </div>
  );
}