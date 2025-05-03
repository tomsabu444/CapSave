import React, { useState } from "react";
import { useCamera } from "../hooks/useCamera";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";
import {
  PhotoCamera,
  Videocam,
  Replay,
  Save,
  Cameraswitch,
} from "@mui/icons-material";

const CaptureMediaPage = () => {
  const {
    videoRef,
    canvasRef,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    capturedPhoto,
    recordedVideoURL,
    capturePhoto,
    startRecording,
    stopRecording,
    recording,
    reset,
    isLoading,
    setIsLoading,
  } = useCamera();

  const [openPreview, setOpenPreview] = useState(false);
  const [mediaType, setMediaType] = useState(null); // 'photo' or 'video'

  const handleCapture = () => {
    capturePhoto();
    setMediaType('photo');
    setOpenPreview(true);
  };

  const handleVideo = () => {
    if (recording) {
      stopRecording();
      // Wait for video processing to complete before showing preview
      setTimeout(() => {
        setMediaType('video');
        setOpenPreview(true);
      }, 1000);
    } else {
      startRecording();
    }
  };

  const handleRetake = () => {
    setOpenPreview(false);
    setTimeout(() => {
      reset();
      setMediaType(null);
    }, 300); // Delay reset until dialog closes
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpenPreview(false);
      reset();
      setMediaType(null);
    }, 1000);
  };

  return (
    <div className="w-full h-fit justify-center items-center bg-gray-200 flex flex-col relative">
      {/* 60% Camera Area */}
      <div className="flex-1 mx-auto flex justify-center items-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-auto object-contain"
        />
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="hidden"
        />
      </div>

      {/* 40% Control Bar Area */}
      <div className="flex-shrink basis-2/5 w-full px-6 py-6 bg-gray-200 relative flex justify-between items-center">
        {/* Left: Camera Selector */}
        <div className="flex items-center gap-2">
          <Cameraswitch className="text-gray-700" />
          <Select
            value={selectedDeviceId || ""}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            size="small"
            className="bg-white text-black rounded-md shadow-sm w-40"
          >
            {devices.map((device, idx) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${idx + 1}`}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Center: Photo + Video Controls */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-10 items-center">
          {/* Photo Button */}
          <IconButton
            onClick={handleCapture}
            className="bg-white hover:bg-blue-100 shadow-xl rounded-full p-4"
            size="large"
            disabled={recording}
          >
            <PhotoCamera fontSize="large" className="text-blue-600" />
          </IconButton>

          {/* Video Button */}
          <IconButton
            onClick={handleVideo}
            className={`shadow-xl rounded-full p-4 ${
              recording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-white hover:bg-green-100"
            }`}
            size="large"
          >
            <Videocam 
              fontSize="large" 
              className={recording ? "text-white" : "text-green-600"} 
            />
            {recording && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </IconButton>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "bg-gray-900 text-white rounded-lg",
        }}
      >
        <DialogContent className="flex justify-center items-center">
          {mediaType === 'photo' && capturedPhoto && (
            <img src={capturedPhoto} alt="Captured" className="w-full rounded-lg shadow" />
          )}
          {mediaType === 'video' && recordedVideoURL && (
            <video
              controls
              autoPlay
              src={recordedVideoURL}
              className="w-full rounded-lg shadow"
              key={recordedVideoURL} // Force re-render when URL changes
            />
          )}
          {mediaType === 'video' && !recordedVideoURL && (
            <div className="p-8 text-center">
              <LinearProgress className="mb-4" />
              <p>Processing video...</p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4 flex justify-between">
          <Button
            onClick={handleRetake}
            variant="outlined"
            color="secondary"
            startIcon={<Replay />}
            className="text-white border-white hover:bg-gray-800"
          >
            Retake
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<Save />}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </DialogActions>
        {isLoading && <LinearProgress />}
      </Dialog>
    </div>
  );
};

export default CaptureMediaPage;  