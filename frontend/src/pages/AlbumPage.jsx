import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useAlbums from '../hooks/useAlbums';

export default function AlbumPage() {
  const navigate = useNavigate();
  const { albums, loading, error, add, rename, remove } = useAlbums();
  const [isNewOpen,     setIsNewOpen]     = useState(false);
  const [isRenameOpen,  setIsRenameOpen]  = useState(false);
  const [isDeleteOpen,  setIsDeleteOpen]  = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const totalItems = albums.reduce((sum, a) => sum + (a.count || 0), 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Albums</h1>
          <p className="text-sm text-gray-400">
            {albums.length} albums · {totalItems} total items
          </p>
        </div>
        <Button variant="contained" onClick={() => setIsNewOpen(true)}>
          Create Album
        </Button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">Error: {error.message}</p>}

      {/* Content */}
      {loading ? (
        <p className="text-gray-400">Loading albums…</p>
      ) : albums.length === 0 ? (
        <p className="text-gray-400 text-center mt-12">
          No albums found. Click “Create Album” to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((a) => (
            <div
              key={a._id}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => navigate(`/albums/${a._id}`)}
            >
              <img
                src={a.coverUrl}
                alt={a.albumName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {a.albumName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {a.count || 0} items · Updated {a.updatedAgo}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlbum(a);
                      setIsRenameOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" className="text-gray-300" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlbum(a);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" className="text-gray-300" />
                  </IconButton>
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
              await rename(selectedAlbum._id, name);
              setIsRenameOpen(false);
            }}
          />
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <ModalOverlay onClose={() => setIsDeleteOpen(false)}>
          <div className="bg-gray-900 p-6 rounded-lg w-80">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete Album
            </h2>
            <p className="text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedAlbum?.albumName}</span>?
              <br />
              This will remove all its media.
            </p>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={async () => {
                  await remove(selectedAlbum._id);
                  setIsDeleteOpen(false);
                }}
              >
                Delete
              </Button>
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// Form for Create & Rename
function AlbumForm({ title, initialName, onCancel, onSubmit }) {
  const [name, setName] = useState(initialName);
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
    <div className="bg-gray-900 p-6 rounded-lg w-80">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Album name"
        fullWidth
        variant="outlined"
        size="small"
        InputProps={{
          style: { backgroundColor: '#1f2937', color: '#fff' },
        }}
      />
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outlined" size="small" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" size="small" onClick={handle}>
          {title.startsWith('Create') ? 'Create' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
