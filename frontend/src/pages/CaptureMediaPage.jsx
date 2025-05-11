import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { ReactMediaRecorder } from "react-media-recorder";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PhotoCamera,
  Videocam,
  Cameraswitch,
} from "@mui/icons-material";

import MediaPreviewModal from "../components/MediaPreviewModal";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CaptureMediaPage() {
  const webcamRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [cameraError, setCameraError] = useState("");

  const [mediaData, setMediaData] = useState(null); // { type, blob, previewUrl }

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const devicesList = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devicesList.filter((d) => d.kind === "videoinput");
        setDevices(videoInputs);
        if (videoInputs[0]) setDeviceId(videoInputs[0].deviceId);
        setCameraAvailable(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error("Camera error:", err);
        setCameraAvailable(false);

        if (err.name === "NotAllowedError") {
          setCameraError("Camera access was denied. Please allow access in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError("Unable to access camera. Please check your browser settings.");
        }
      }
    };

    checkCamera();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mediaData ? "hidden" : "";
  }, [mediaData]);

  const capturePhoto = async () => {
    const base64 = webcamRef.current.getScreenshot();
    if (!base64) return;

    const blob = await (await fetch(base64)).blob();
    setMediaData({
      type: "photo",
      blob,
      previewUrl: base64,
    });
  };

  const handleVideoCapture = (videoBlob) => {
    const previewUrl = URL.createObjectURL(videoBlob);
    setMediaData({
      type: "video",
      blob: videoBlob,
      previewUrl,
    });
  };

  const handleRetake = () => {
    if (mediaData?.type === "video" && mediaData?.previewUrl) {
      URL.revokeObjectURL(mediaData.previewUrl);
    }
    setMediaData(null);
  };

  return (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Camera View */}
      <div className="flex-1 flex justify-center items-center overflow-hidden px-2">
        {cameraAvailable ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={{
              ...videoConstraints,
              deviceId: deviceId ? { exact: deviceId } : undefined,
            }}
            className="w-[95%] h-auto max-h-[90vh] object-contain rounded-md"
          />
        ) : (
          <div className="w-[95%] h-[70vh] border-2 border-gray-400 dark:border-gray-600 rounded-md flex items-center justify-center text-center text-gray-600 dark:text-gray-300 px-4">
            {cameraError || "No camera available on this device."}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex-none px-4 py-3 bg-gray-200 dark:bg-gray-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cameraswitch className="text-gray-700 dark:text-gray-300" />
          <select
            value={deviceId || ""}
            onChange={(e) => setDeviceId(e.target.value)}
            className="text-sm w-40 rounded-md shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none"
          >
            {devices.map((d, idx) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center items-center gap-6 mx-auto">
          {/* Capture Photo */}
          <Tooltip title="Capture Photo">
            <IconButton
              className="bg-white hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900 shadow-xl rounded-full p-4"
              onClick={capturePhoto}
              disabled={!cameraAvailable}
            >
              <PhotoCamera fontSize="large" className="text-blue-600 dark:text-blue-300" />
            </IconButton>
          </Tooltip>

          {/* Record Video */}
          <ReactMediaRecorder
            video
            render={({ status, startRecording, stopRecording, mediaBlobUrl, mediaBlob }) => {
              useEffect(() => {
                if (status === "stopped" && mediaBlob) {
                  handleVideoCapture(mediaBlob);
                }
              }, [status, mediaBlob]);

              return (
                <Tooltip title={status === "recording" ? "Stop Recording" : "Start Recording"}>
                  <IconButton
                    onClick={() => {
                      if (status === "recording") {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    }}
                    disabled={!cameraAvailable}
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

      {/* Media Preview Modal */}
      {mediaData && (
        <MediaPreviewModal
          type={mediaData.type}
          previewUrl={mediaData.previewUrl}
          blob={mediaData.blob}
          onClose={handleRetake}
        />
      )}
    </div>
  );
}
