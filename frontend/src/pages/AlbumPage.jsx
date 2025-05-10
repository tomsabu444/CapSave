import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAlbums from '../hooks/useAlbums';
import AlbumCard from '../components/albums/AlbumCard';
import AlbumForm from '../components/albums/AlbumForm';
import ModalOverlay from '../components/ModalOverlay';
import { toast } from 'react-toastify';

export default function AlbumPage() {
  const navigate = useNavigate();
  const { albums, loading, error, add, rename, remove } = useAlbums();
  const [modal, setModal] = useState({ type: null, album: null });

  const closeModal = () => setModal({ type: null, album: null });
  const totalItems = albums.reduce((sum, a) => sum + (a.count || 0), 0);

  return (
    <div className="h-full text-gray-900 dark:text-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Albums</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {albums.length} albums · {totalItems} items
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Create Album
        </button>
      </div>

      {/* Error */}
      {/* {error && <p className="text-red-500 mb-6 text-sm">Error: {error.message}</p>} */}

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-16 text-lg">Loading albums…</p>
      ) : albums.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-16 text-lg">
          No albums found. Click “Create Album” to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((a) => (
            <AlbumCard
              key={a.albumId}
              album={a}
              onOpenRename={() => setModal({ type: 'rename', album: a })}
              onOpenDelete={() => setModal({ type: 'delete', album: a })}
              onOpen={() => navigate(`/albums/${a.albumId}`)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal.type === 'create' && (
        <ModalOverlay onClose={closeModal}>
          <AlbumForm
            title="Create New Album"
            initialName=""
            onCancel={closeModal}
            onSubmit={async (name) => {
              try {
                await add(name);
                toast.success('Album created');
                closeModal();
              } catch (err) {
                toast.error(`Failed to create album: ${err.message}`);
              }
            }}
          />
        </ModalOverlay>
      )}

      {modal.type === 'rename' && (
        <ModalOverlay onClose={closeModal}>
          <AlbumForm
            title="Rename Album"
            initialName={modal.album?.albumName || ''}
            onCancel={closeModal}
            onSubmit={async (name) => {
              try {
                await rename(modal.album.albumId, name);
                toast.info('Album renamed');
                closeModal();
              } catch (err) {
                toast.error(`Failed to rename album: ${err.message}`);
              }
            }}
          />
        </ModalOverlay>
      )}

      {modal.type === 'delete' && (
        <ModalOverlay onClose={closeModal}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Delete Album</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{modal.album?.albumName}</span>?
              <br />
              This will remove all its media.
            </p>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await remove(modal.album.albumId);
                    toast.success('Album deleted');
                    closeModal();
                  } catch (err) {
                    toast.error(`Failed to delete album: ${err.message}`);
                  }
                }}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
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
