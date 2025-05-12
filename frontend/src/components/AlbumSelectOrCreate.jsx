import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

export default function AlbumSelectOrCreate({
  albums,
  selectedAlbumId,
  newAlbumName,
  onSelectAlbum,
  onChangeNewAlbumName,
}) {
  return (
    <div className="mb-6">
      <Typography variant="subtitle2" className="mb-1 text-gray-900 dark:text-gray-100">
        {albums.length ? 'Choose Existing Album' : 'No albums available'}
      </Typography>
      <select
        value={selectedAlbumId}
        onChange={e => {
          onSelectAlbum(e.target.value);
          // clear any new-album name when user picks dropdown
          onChangeNewAlbumName('');
        }}
        disabled={!albums.length}
        className="w-full py-2 px-3 mb-4 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none"
      >
        {albums.length
          ? albums.map(a => (
              <option key={a.albumId} value={a.albumId}>
                {a.albumName}
              </option>
            ))
          : <option value="" disabled>No albums</option>
        }
      </select>

      <Typography variant="subtitle2" className="mb-1 text-gray-900 dark:text-gray-100">
        Or Create New Album
      </Typography>
      <input
        type="text"
        placeholder="Enter new album name"
        value={newAlbumName}
        onChange={e => {
          onChangeNewAlbumName(e.target.value);
          // clear dropdown when typing a new name
          onSelectAlbum('');
        }}
        className="w-full py-2 px-3 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none"
      />
    </div>
  );
}

AlbumSelectOrCreate.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.shape({
    albumId: PropTypes.string.isRequired,
    albumName: PropTypes.string.isRequired,
  })).isRequired,
  selectedAlbumId: PropTypes.string.isRequired,
  newAlbumName: PropTypes.string.isRequired,
  onSelectAlbum: PropTypes.func.isRequired,
  onChangeNewAlbumName: PropTypes.func.isRequired,
};
