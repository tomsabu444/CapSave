import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import useAlbums from '../hooks/useAlbums';
import MediaGallery from '../components/MediaGallery';

export default function MediaGalleryPage() {
  const { albumId } = useParams();
  const navigate    = useNavigate();
  const { albums, loading, error } = useAlbums();

  if (loading) {
    return <p className="p-6 text-gray-400">Loading album…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Error: {error.message}</p>;
  }

  const album = albums.find(a => a._id === albumId);
  if (!album) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p>Album not found.</p>
        <Button 
          variant="outlined" 
          className="mt-4" 
          onClick={() => navigate('/albums')}
        >
          Back to Albums
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} className="mb-4">
        &larr; Back
      </Button>

      <h1 className="text-3xl font-bold text-white mb-2">
        {album.albumName}
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        {album.count || 0} items • Created {new Date(album.createdAt).toLocaleDateString()}
      </p>

      <MediaGallery albumId={albumId} />
    </div>
  );
}
