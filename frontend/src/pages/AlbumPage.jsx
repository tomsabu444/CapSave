// src/pages/AlbumPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useAlbums from '../hooks/useAlbums';

export default function AlbumPage() {
  const navigate = useNavigate();
  const { albums, loading, error, add, rename, remove } = useAlbums();
  const [isNewOpen, setIsNewOpen]         = useState(false);
  const [isRenameOpen, setIsRenameOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen]   = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const totalItems = albums.reduce((sum, a) => sum + (a.count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Albums</h1>
          <p className="text-sm text-gray-500 mt-1">
            {albums.length} albums · {totalItems} items
          </p>
        </div>
        <button
          onClick={() => setIsNewOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Create Album
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 mb-6 text-sm">Error: {error.message}</p>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 text-center mt-16 text-lg">
          Loading albums…
        </p>
      ) : albums.length === 0 ? (
        <p className="text-gray-500 text-center mt-16 text-lg">
          No albums found. Click “Create Album” to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((a) => (
            <div
              key={a.albumId}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => navigate(`/albums/${a.albumId}`)}
            >
              {/* Cover */}
              <div className="w-full h-52 bg-gray-200">
                {a.coverUrl ? (
                  <img
                    src={a.coverUrl}
                    alt={a.albumName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Images
                  </div>
                )}
              </div>

              {/* Info row */}
              <div className="p-4 flex items-center justify-between">
                {/* Name + count */}
                <div className="flex items-center space-x-2 truncate">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {a.albumName}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {a.count || 0} items · Updated {a.updatedAgo}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex items-center space-x-2 ">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlbum(a);
                      setIsRenameOpen(true);
                    }}
                    className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlbum(a);
                      setIsDeleteOpen(true);
                    }}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Album Modal */}
      {isNewOpen && (
        <ModalOverlay onClose={() => setIsNewOpen(false)}>
          <AlbumForm
            title="Create New Album"
            initialName=""
            onCancel={() => setIsNewOpen(false)}
            onSubmit={async (name) => {
              await add(name);
              setIsNewOpen(false);
            }}
          />
        </ModalOverlay>
      )}

      {/* Rename Album Modal */}
      {isRenameOpen && (
        <ModalOverlay onClose={() => setIsRenameOpen(false)}>
          <AlbumForm
            title="Rename Album"
            initialName={selectedAlbum?.albumName || ''}
            onCancel={() => setIsRenameOpen(false)}
            onSubmit={async (name) => {
              await rename(selectedAlbum.albumId, name);
              setIsRenameOpen(false);
            }}
          />
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <ModalOverlay onClose={() => setIsDeleteOpen(false)}>
          <div className="bg-white p-6 rounded-xl w-80 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Album
            </h2>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedAlbum?.albumName}</span>?
              <br />
              This will remove all its media.
            </p>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await remove(selectedAlbum.albumId);
                  setIsDeleteOpen(false);
                }}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

// Modal overlay wrapper
function ModalOverlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// Form for Create & Rename
function AlbumForm({ title, initialName, onCancel, onSubmit }) {
  const [name, setName]   = useState(initialName);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialName);
    setError('');
  }, [initialName]);

  const handle = () => {
    if (!name.trim()) {
      setError('Album name cannot be empty.');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="bg-white p-6 rounded-xl w-80 shadow-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Album name"
        className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-900 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handle}
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm"
        >
          {title.startsWith('Create') ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  );
}
