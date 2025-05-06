// src/pages/CaptureMediaPage.jsx
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { ReactMediaRecorder } from "react-media-recorder";
import {
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  LinearProgress,
  Tooltip,
  Button,
  Typography,
} from "@mui/material";
import {
  PhotoCamera,
  Videocam,
  Replay,
  Save,
  Cameraswitch,
} from "@mui/icons-material";

import useAlbums from "../hooks/useAlbums";
import mediaApi from "../api/mediaApi";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CaptureMediaPage() {
  const webcamRef = useRef(null);
  const { albums } = useAlbums();
  
  const [devices, setDevices]         = useState([]);
  const [deviceId, setDeviceId]       = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [mediaBlobUrl, setMediaBlobUrl]   = useState(null);
  const [mediaType, setMediaType]     = useState(null); // "photo" | "video"
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState("");

  const [albumId, setAlbumId]         = useState("");

  // load cameras + default album
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devicesList) => {
      const videoInputs = devicesList.filter(d => d.kind === "videoinput");
      setDevices(videoInputs);
      if (videoInputs[0]) setDeviceId(videoInputs[0].deviceId);
    });
  }, []);

  useEffect(() => {
    if (albums.length && !albumId) {
      setAlbumId(albums[0]._id);
    }
  }, [albums, albumId]);

  // Capture a photo
  const capturePhoto = () => {
    const img = webcamRef.current.getScreenshot();
    setCapturedPhoto(img);
    setMediaType("photo");
    setOpenPreview(true);
    setError("");
  };

  // Handle Save for both photo & video
  const handleSave = async () => {
    if (!albumId) {
      setError("Please select an album");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      let fileBlob;
      if (mediaType === "photo") {
        // DataURL to Blob
        const res = await fetch(capturedPhoto);
        fileBlob = await res.blob();
      } else {
        // videoBlobUrl to Blob
        const res = await fetch(mediaBlobUrl);
        fileBlob = await res.blob();
      }
      // upload to backend
      await mediaApi.upload(fileBlob, albumId);
      // reset
      setOpenPreview(false);
      setCapturedPhoto(null);
      setMediaBlobUrl(null);
      setMediaType(null);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setOpenPreview(false);
    setCapturedPhoto(null);
    setMediaBlobUrl(null);
    setMediaType(null);
    setError("");
  };

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col overflow-hidden">

      {/* Camera View */}
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{
            ...videoConstraints,
            deviceId: deviceId ? { exact: deviceId } : undefined,
          }}
          className="w-[90%] h-[90%] object-contain"
        />
      </div>

      {/* Control Bar */}
      <div className="flex-none px-6 py-4 mb-3 bg-gray-200 flex items-center justify-between relative">
        {/* Camera Selector */}
        <div className="flex items-center gap-2">
          <Cameraswitch className="text-gray-700" />
          <Select
            value={deviceId || ""}
            onChange={(e) => setDeviceId(e.target.value)}
            size="small"
            className="bg-white text-black rounded-md shadow-sm w-40"
          >
            {devices.map((d, idx) => (
              <MenuItem key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${idx + 1}`}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-10">
          {/* Capture Photo */}
          <Tooltip title="Capture Photo">
            <IconButton
              onClick={capturePhoto}
              className="bg-white hover:bg-blue-100 shadow-xl rounded-full p-4"
            >
              <PhotoCamera fontSize="large" className="text-blue-600" />
            </IconButton>
          </Tooltip>

          {/* Capture Video */}
          <ReactMediaRecorder
            video
            render={({ status, startRecording, stopRecording, mediaBlobUrl: url }) => {
              // store the blob URL for later
              useEffect(() => { if (url) setMediaBlobUrl(url); }, [url]);

              return (
                <Tooltip title={status === "recording" ? "Stop Recording" : "Start Recording"}>
                  <IconButton
                    onClick={() => {
                      if (status === "recording") {
                        stopRecording();
                        setMediaType("video");
                        setOpenPreview(true);
                      } else {
                        startRecording();
                      }
                    }}
                    className={`relative shadow-xl rounded-full p-4 ${
                      status === "recording"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white hover:bg-green-100 text-green-600"
                    }`}
                  >
                    <Videocam fontSize="large" />
                    {status === "recording" && (
                      <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-400 animate-ping" />
                    )}
                  </IconButton>
                </Tooltip>
              );
            }}
          />
        </div>
      </div>

      {/* Preview & Save Dialog */}
      <Dialog
        open={openPreview}
        onClose={handleRetake}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "bg-gray-900 text-white rounded-lg" }}
      >
        <DialogContent className="flex flex-col items-center justify-center gap-4">
          {mediaType === "photo" ? (
            <img
              src={capturedPhoto}
              alt="Preview"
              className="w-full rounded-lg shadow"
            />
          ) : (
            <video
              controls
              autoPlay
              src={mediaBlobUrl}
              className="w-full rounded-lg shadow"
            />
          )}

          {/* Album selector */}
          <div className="w-full mt-2">
            <Typography>Select Album to Save:</Typography>
            <Select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              fullWidth
              className="bg-white text-black rounded mt-1"
              size="small"
            >
              {albums.map((a) => (
                <MenuItem key={a._id} value={a._id}>
                  {a.albumName}
                </MenuItem>
              ))}
            </Select>
          </div>

          {error && <Typography color="error">{error}</Typography>}

          <div className="flex justify-center gap-8 mt-4">
            <Tooltip title="Retake">
              <IconButton
                onClick={handleRetake}
                className="bg-red-600 hover:bg-red-700 text-white p-3"
              >
                <Replay />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white p-3"
              >
                <Save />
              </IconButton>
            </Tooltip>
          </div>
          {isLoading && <LinearProgress className="w-full mt-2" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
