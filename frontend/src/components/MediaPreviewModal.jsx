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

  // Handle background click only if not saving
  const handleBackgroundClick = (e) => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2 sm:px-4 backdrop-blur-sm"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Typography
          id="modal-title"
          variant="h6"
          className="mb-4 text-gray-900 dark:text-white"
        >
          {type === 'photo' ? 'Preview Photo' : 'Preview Video'}
        </Typography>

        {/* Preview */}
        <div className="mb-4 sm:mb-6">
          {type === 'photo' ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded-lg object-contain max-h-[40vh] sm:max-h-[50vh]"
            />
          ) : (
            <video
              src={previewUrl}
              className="w-full h-auto rounded-lg bg-black max-h-[40vh] sm:max-h-[50vh]"
              controls
            />
          )}
        </div>

        {step === 1 && (
          <div className="flex justify-between gap-2">
            <Button
              variant="outlined"
              size="medium"
              onClick={onClose}
              sx={{
                textTransform: 'none',
                flex: 1,
                py: 1,
                fontSize: '1rem',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={handleNext}
              sx={{
                textTransform: 'none',
                flex: 1,
                py: 1,
                fontSize: '1rem',
              }}
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
              <Typography
                color="error"
                variant="caption"
                className="block mb-2 text-center"
              >
                {error}
              </Typography>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outlined"
                size="medium"
                onClick={onClose}
                disabled={isSaving}
                sx={{
                  textTransform: 'none',
                  flex: 1,
                  py: 1,
                  fontSize: '1rem',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="medium"
                onClick={handleSave}
                disabled={isSaving}
                sx={{
                  textTransform: 'none',
                  flex: 1,
                  py: 1,
                  fontSize: '1rem',
                }}
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
  type: PropTypes.oneOf(['photo', 'video']).isRequired,
  previewUrl: PropTypes.string.isRequired,
  blob: PropTypes.oneOfType([PropTypes.instanceOf(Blob), PropTypes.instanceOf(File)])
    .isRequired,
  onClose: PropTypes.func.isRequired,
};