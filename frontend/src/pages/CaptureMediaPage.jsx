import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { ReactMediaRecorder } from "react-media-recorder";
import {
  IconButton,
  LinearProgress,
  Tooltip,
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

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "photo" | "video"
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [albumId, setAlbumId] = useState("");

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devicesList) => {
      const videoInputs = devicesList.filter((d) => d.kind === "videoinput");
      setDevices(videoInputs);
      if (videoInputs[0]) setDeviceId(videoInputs[0].deviceId);
    });
  }, []);

  useEffect(() => {
    if (albums.length && !albumId) {
      setAlbumId(albums[0].albumId);
    }
  }, [albums, albumId]);

  useEffect(() => {
    document.body.style.overflow = openPreview ? "hidden" : "";
  }, [openPreview]);

  const capturePhoto = () => {
    const img = webcamRef.current.getScreenshot();
    setCapturedPhoto(img);
    setMediaType("photo");
    setOpenPreview(true);
    setError("");
  };

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
        const res = await fetch(capturedPhoto);
        fileBlob = await res.blob();
      } else {
        const res = await fetch(mediaBlobUrl);
        fileBlob = await res.blob();
      }
      await mediaApi.upload(fileBlob, albumId);
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
    <div className="w-full h-full bg-gray-200 dark:bg-gray-950 flex flex-col overflow-hidden">
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
      <div className="flex-none px-6 py-4 mb-3 bg-gray-200 dark:bg-gray-950 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <Cameraswitch className="text-gray-700 dark:text-gray-300" />
          <select
            value={deviceId || ""}
            onChange={(e) => setDeviceId(e.target.value)}
            className="text-sm w-40 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {devices.map((d, idx) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-10">
          {/* Capture Photo */}
          <Tooltip title="Capture Photo">
            <IconButton
              className="bg-white hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900 shadow-xl rounded-full p-4"
              onClick={capturePhoto}
            >
              <PhotoCamera fontSize="large" className="text-blue-600 dark:text-blue-300" />
            </IconButton>
          </Tooltip>

          {/* Record Video */}
          <ReactMediaRecorder
            video
            render={({ status, startRecording, stopRecording, mediaBlobUrl: url }) => {
              useEffect(() => {
                if (url) setMediaBlobUrl(url);
              }, [url]);

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
                    className={`relative shadow-xl rounded-full p-4 transition-colors ${
                      status === "recording"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-green-600"
                    }`}
                  >
                    <Videocam fontSize="large" className="text-blue-600 dark:text-blue-300" />
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

      {/* Custom Preview Modal */}
      {openPreview && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
          onClick={handleRetake}
        >
          <div
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full max-w-lg rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaType === "photo" ? (
              <img src={capturedPhoto} alt="Preview" className="w-full rounded-lg shadow mb-4" />
            ) : (
              <video
                controls
                autoPlay
                src={mediaBlobUrl}
                className="w-full rounded-lg shadow mb-4"
              />
            )}

            <div className="w-full mb-4">
              <label htmlFor="album" className="block text-sm font-medium mb-1">
                Select Album to Save:
              </label>
              <select
                id="album"
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                className="w-full text-sm rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {albums.map((a) => (
                  <option key={a.albumId} value={a.albumId}>
                    {a.albumName}
                  </option>
                ))}
              </select>
            </div>

            {error && <Typography color="error" className="mb-2">{error}</Typography>}

            <div className="flex justify-center gap-6">
              <Tooltip title="Retake">
                <IconButton
                  onClick={handleRetake}
                  className="bg-red-600 hover:bg-red-700 text-white p-3"
                >
                  <Replay className="text-blue-400"/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Save">
                <IconButton
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 disabled:opacity-50"
                >
                  <Save className="text-green-600" />
                </IconButton>
              </Tooltip>
            </div>

            {isLoading && <LinearProgress className="w-full mt-4" />}
          </div>
        </div>
      )}
    </div>
  );
}
