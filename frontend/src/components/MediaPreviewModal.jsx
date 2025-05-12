import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import useAlbums from '../hooks/useAlbums';
import mediaApi from '../api/mediaApi';
import AlbumSelectOrCreate from './AlbumSelectOrCreate';

export default function MediaPreviewModal({
  type,
  previewUrl,
  blob,
  onClose,
}) {
  const { albums, add: createAlbum } = useAlbums();

  const [step, setStep] = useState(1);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Pre-select first album if available when entering step 2
  useEffect(() => {
    if (step === 2 && albums.length > 0 && !selectedAlbumId) {
      setSelectedAlbumId(albums[0].albumId);
    }
  }, [step, albums, selectedAlbumId]);

  /** Advance from preview to album selection */
  const handleNext = () => {
    setError('');
    setStep(2);
  };

  /** Save into album: create album if needed, then upload blob */
  const handleSave = async () => {
    setError('');

    let targetAlbumId = selectedAlbumId;

    // 1. Create album if user entered name
    if (newAlbumName.trim()) {
      try {
        const result = await createAlbum(newAlbumName.trim());
        if (!result?.albumId) {
          throw new Error('No albumId returned');
        }
        targetAlbumId = result.albumId;
        setSelectedAlbumId(targetAlbumId);
        toast.success(`Album "${newAlbumName.trim()}" created`);
      } catch (err) {
        console.error('Album creation error:', err);
        return setError('Failed to create album. Try another name.');
      }
    }

    // 2. Validate album selection
    if (!targetAlbumId) {
      const msg = albums.length
        ? 'Select an existing album or enter a new one.'
        : 'No albums available. Please create one.';
      return setError(msg);
    }

    // 3. Perform upload
    setIsSaving(true);
    try {
      // If blob isn't a File, wrap it
      const file =
        blob instanceof File
          ? blob
          : new File([blob], `capture.${type === 'photo' ? 'jpg' : 'webm'}`, {
              type: blob.type || (type === 'photo' ? 'image/jpeg' : 'video/webm'),
            });

      await mediaApi.upload(file, targetAlbumId);
      toast.success('Saved to album!');
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white">
          {type === 'photo' ? 'Preview Photo' : 'Preview Video'}
        </Typography>

        {/* Preview */}
        <div className="mb-6">
          {type === 'photo' ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-[20vh] sm:h-auto rounded-lg object-contain"
            />
          ) : (
            <video
              src={previewUrl}
              className="w-full max-h-[20vh] sm:h-auto rounded-lg bg-black"
              controls
            />
          )}
        </div>

        {step === 1 && (
          <div className="flex justify-between space-x-2">
            <Button
              variant="outlined"
              size="small"
              onClick={onClose}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleNext}
              sx={{ textTransform: 'none' }}
            >
              Save
            </Button>
          </div>
        )}

        {step === 2 && (
          <>
            {/* Album selection/creation */}
            <AlbumSelectOrCreate
              albums={albums}
              selectedAlbumId={selectedAlbumId}
              newAlbumName={newAlbumName}
              onSelectAlbum={setSelectedAlbumId}
              onChangeNewAlbumName={setNewAlbumName}
            />

            {error && (
              <Typography color="error" variant="caption" className="block mb-2">
                {error}
              </Typography>
            )}

            <div className="flex justify-between space-x-2">
              <Button
                variant="outlined"
                size="small"
                onClick={onClose}
                disabled={isSaving}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleSave}
                disabled={isSaving}
                sx={{ textTransform: 'none' }}
              >
                {isSaving ? 'Saving…' : 'Save to Album'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

MediaPreviewModal.propTypes = {
  /** 'photo' or 'video' */
  type: PropTypes.oneOf(['photo', 'video']).isRequired,
  /** URL for preview display */
  previewUrl: PropTypes.string.isRequired,
  /** Blob or File to upload */
  blob: PropTypes.oneOfType([PropTypes.instanceOf(Blob), PropTypes.instanceOf(File)])
    .isRequired,
  /** Callback to close the modal */
  onClose: PropTypes.func.isRequired,
};
