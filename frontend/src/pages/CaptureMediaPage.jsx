import React, { useState } from "react";
import { useCamera } from "../hooks/useCamera";
import {
  Select,
  MenuItem,
  Button,
  Alert,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { PhotoCamera, Videocam, Save, Replay } from "@mui/icons-material";

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

  const [alert, setAlert] = useState("");

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAlert("Media saved successfully (simulated)");
    }, 1500);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h2 className="text-lg font-semibold">Capture Media</h2>

      <div>
        <label>Select Camera:</label>
        <Select
          fullWidth
          value={selectedDeviceId || ""}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          size="small"
        >
          {devices.map((device, idx) => (
            <MenuItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${idx + 1}`}
            </MenuItem>
          ))}
        </Select>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-lg border rounded"
      />

      <div className="flex gap-3 flex-wrap justify-center">
        <IconButton onClick={capturePhoto} color="primary">
          <PhotoCamera />
        </IconButton>
        {!recording ? (
          <IconButton onClick={startRecording} color="success">
            <Videocam />
          </IconButton>
        ) : (
          <IconButton onClick={stopRecording} color="error">
            <Videocam />
          </IconButton>
        )}
      </div>

      {(capturedPhoto || recordedVideoURL) && (
        <div className="space-y-4">
          {capturedPhoto && (
            <img src={capturedPhoto} alt="Captured" className="rounded border" />
          )}
          {recordedVideoURL && (
            <video
              controls
              src={recordedVideoURL}
              className="w-full max-w-lg rounded border"
            />
          )}

          <div className="flex gap-4 flex-wrap">
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Replay />}
              onClick={reset}
            >
              Retake
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {isLoading && <LinearProgress />}
      {alert && <Alert severity="success" onClose={() => setAlert("")}>{alert}</Alert>}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CaptureMediaPage;
