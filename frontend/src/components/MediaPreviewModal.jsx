import React, { useState, useEffect } from "react";
import { IconButton, LinearProgress, Tooltip, Typography } from "@mui/material";
import { Replay, Save, ArrowForward, Cancel } from "@mui/icons-material";
import useAlbums from "../hooks/useAlbums";
import mediaApi from "../api/mediaApi";

export default function MediaPreviewModal({ type, previewUrl, blob, onClose }) {
  const { albums, add: addAlbum } = useAlbums();

  const [step, setStep] = useState(1);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (albums.length && !selectedAlbumId) {
      setSelectedAlbumId(albums[0].albumId);
    }
  }, [albums, selectedAlbumId]);

  const handleSave = async () => {
    setUploading(true);
    setUploadError("");

    try {
      let finalAlbumId = selectedAlbumId;

      // If creating a new album, create it first
      if (newAlbumName.trim()) {
        const created = await addAlbum(newAlbumName.trim());

        if (!created || !created.albumId) {
          setUploadError("Album creation failed.");
          setUploading(false);
          return;
        }

        finalAlbumId = created.albumId;
        setSelectedAlbumId(finalAlbumId); // Update the state with the new album ID
      }

      // Validate that we have an albumId to use
      if (!finalAlbumId) {
        setUploadError("No album selected. Please select or create an album.");
        setUploading(false);
        return;
      }

      // Convert blob to File object if needed
      const mediaFile = new File(
        [blob],
        `${type === 'photo' ? 'image' : 'video'}-${Date.now()}.${type === 'photo' ? 'png' : 'mp4'}`,
        { type: type === 'photo' ? 'image/png' : 'video/mp4' }
      );

      // Call the API directly instead of using the hook
      // This avoids the issue with the hook requiring albumId at initialization
      await mediaApi.upload(mediaFile, finalAlbumId);

      // Revoke preview URL if it was an object URL
      if (type === "video" && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      onClose(); // close and reset
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(`Upload failed: ${err.message || "Please try again."}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full max-w-lg rounded-xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Media Preview
            </h2>

            {type === "photo" ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full rounded-lg shadow mb-4 max-h-[60vh] object-contain"
              />
            ) : (
              <video
                controls
                autoPlay
                src={previewUrl}
                className="w-full rounded-lg shadow mb-4 max-h-[60vh]"
              />
            )}

            <div className="flex justify-center gap-6">
              <Tooltip title="Retake">
                <IconButton
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white p-3"
                >
                  <Replay className="text-white" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Next">
                <IconButton
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3"
                >
                  <ArrowForward className="text-white" />
                </IconButton>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Save to Album
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Choose Existing Album
              </label>
              <select
                value={selectedAlbumId}
                onChange={(e) => {
                  setSelectedAlbumId(e.target.value);
                  setNewAlbumName("");
                }}
                className="w-full text-sm rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none"
              >
                <option value="">-- Select Album --</option>
                {albums.map((a) => (
                  <option key={a.albumId} value={a.albumId}>
                    {a.albumName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Or Create New Album
              </label>
              <input
                type="text"
                value={newAlbumName}
                onChange={(e) => {
                  setNewAlbumName(e.target.value);
                  setSelectedAlbumId("");
                }}
                placeholder="Enter new album name"
                className="w-full text-sm rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
              />
            </div>

            {uploadError && (
              <Typography color="error" className="mb-2">
                {uploadError}
              </Typography>
            )}

            <div className="flex justify-center gap-6">
              <Tooltip title="Cancel">
                <IconButton
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white p-3"
                >
                  <Cancel className="text-white" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save to Album">
                <IconButton
                  onClick={handleSave}
                  disabled={
                    uploading || (!newAlbumName.trim() && !selectedAlbumId)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white p-3 disabled:opacity-50"
                >
                  <Save className="text-white" />
                </IconButton>
              </Tooltip>
            </div>

            {uploading && <LinearProgress className="w-full mt-4" />}
          </>
        )}
      </div>
    </div>
  );
}