// src/components/MediaUploadModal.jsx

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

import useAlbums from "../hooks/useAlbums";
import mediaApi from "../api/mediaApi";
import AlbumSelectOrCreate from "./AlbumSelectOrCreate";
import {
  validateFile,
  ALLOWED_TYPES,
  MAX_SIZE_MB,
} from "../utils/validateFile";

export default function MediaUploadModal({ onClose }) {
  const { albums, add: createAlbum } = useAlbums();

  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  // Pre-select first album if available
  useEffect(() => {
    if (albums.length > 0 && !selectedAlbumId) {
      setSelectedAlbumId(albums[0].albumId);
    }
  }, [albums, selectedAlbumId]);

  /** Validate file size/type and update state */
  const handleFileChange = (e) => {
    const chosen = e.target.files[0];
    if (!chosen) return;

    const { valid, reason } = validateFile(chosen);
    if (!valid) {
      setError(reason);
      setFile(null);
      fileInputRef.current.value = null;
    } else {
      setError("");
      setFile(chosen);
    }
  };

  /** Main upload handler: create album if needed, then upload */
  const handleUpload = async () => {
    setError("");

    if (!file) {
      return setError("Please select a photo or video first.");
    }

    let targetAlbumId = selectedAlbumId;

    // 1. If user entered a new album name, create it
    if (newAlbumName.trim()) {
      try {
        const result = await createAlbum(newAlbumName.trim());
        if (!result?.albumId) {
          throw new Error("Album creation returned no ID");
        }
        targetAlbumId = result.albumId;
        setSelectedAlbumId(targetAlbumId);
        toast.success(`Album "${newAlbumName.trim()}" created`);
      } catch (err) {
        console.error("Album creation error:", err);
        return setError("Album creation failed. Please choose another name.");
      }
    }

    // 2. Ensure we have an album ID to upload into
    if (!targetAlbumId) {
      const msg = albums.length
        ? "Select an existing album or enter a new one."
        : "No albums available. Please create one.";
      return setError(msg);
    }

    // 3. Perform the upload via mediaApi
    setIsUploading(true);
    try {
      await mediaApi.upload(file, targetAlbumId);
      toast.success("Media uploaded successfully");
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      setError(`Upload failed: ${err.message || "Try again later."}`);
    } finally {
      setIsUploading(false);
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
          Upload Photo / Video
        </Typography>

        {/* File input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full mb-2 py-2 px-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                     rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none"
        />

        {/* Validation or usage hint */}
        {error ? (
          <Typography color="error" variant="caption" className="block mb-2">
            {error}
          </Typography>
        ) : (
          <Typography
            variant="caption"
            className="block mb-2 text-gray-500 dark:text-gray-400"
          >
            Max size: {MAX_SIZE_MB} MB. Allowed types:{" "}
            {ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}.
          </Typography>
        )}

        {/* Unified album selection / creation component */}
        <AlbumSelectOrCreate
          albums={albums}
          selectedAlbumId={selectedAlbumId}
          newAlbumName={newAlbumName}
          onSelectAlbum={setSelectedAlbumId}
          onChangeNewAlbumName={setNewAlbumName}
        />

        {/* Action buttons */}
        <div className="flex justify-between space-x-2">
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
            disabled={isUploading}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleUpload}
            disabled={isUploading}
            sx={{ textTransform: "none" }}
          >
            {isUploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}

MediaUploadModal.propTypes = {
  /** Callback to close the modal */
  onClose: PropTypes.func.isRequired,
};
