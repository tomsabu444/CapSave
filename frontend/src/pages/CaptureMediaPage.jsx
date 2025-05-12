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
  Mic,
} from "@mui/icons-material";

import MediaPreviewModal from "../components/MediaPreviewModal";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CaptureMediaPage() {
  const webcamRef = useRef(null);

  // Camera devices
  const [videoDevices, setVideoDevices] = useState([{ deviceId: "off", label: "Off" }]);
  const [videoDeviceId, setVideoDeviceId] = useState("");

  // Mic devices + availability
  const [audioDevices, setAudioDevices] = useState([{ deviceId: "off", label: "Off" }]);
  const [audioDeviceId, setAudioDeviceId] = useState("off");
  const [audioAvailable, setAudioAvailable] = useState(true);

  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [cameraError, setCameraError] = useState("");
  const [mediaData, setMediaData] = useState(null); // { type, blob, previewUrl }

  useEffect(() => {
    const checkDevices = async () => {
      // First try video+audio
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // got both perms
        stream.getTracks().forEach((t) => t.stop());
        setAudioAvailable(true);

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videos = devices.filter((d) => d.kind === "videoinput");
        const audios = devices.filter((d) => d.kind === "audioinput");

        setVideoDevices(videos);
        if (videos[0]) setVideoDeviceId(videos[0].deviceId);

        // prepend an "Off" option
        setAudioDevices([{ deviceId: "off", label: "Off" }, ...audios]);
        setAudioDeviceId(audios[0]?.deviceId || "off");
      } catch (err) {
        console.warn("getUserMedia(video+audio) failed:", err);

        // Fallback: try video-only
        try {
          const vidStream = await navigator.mediaDevices.getUserMedia({ video: true });
          vidStream.getTracks().forEach((t) => t.stop());
          setCameraAvailable(true);
          setAudioAvailable(false);

          const devices = await navigator.mediaDevices.enumerateDevices();
          const videos = devices.filter((d) => d.kind === "videoinput");

          setVideoDevices(videos);
          if (videos[0]) setVideoDeviceId(videos[0].deviceId);

          // only the "Off" option remains
          setAudioDevices([{ deviceId: "off", label: "Off" }]);
          setAudioDeviceId("off");
        } catch (err2) {
          console.error("getUserMedia(video) also failed:", err2);
          setCameraAvailable(false);
          setCameraError(
            err2.name === "NotAllowedError"
              ? "Camera access was denied."
              : "Unable to access camera."
          );
        }
      }
    };

    checkDevices();
  }, []);

  // disable page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = mediaData ? "hidden" : "";
  }, [mediaData]);

  const capturePhoto = async () => {
    const base64 = webcamRef.current.getScreenshot();
    if (!base64) return;
    const blob = await (await fetch(base64)).blob();
    setMediaData({ type: "photo", blob, previewUrl: base64 });
  };

  const handleVideoCapture = (videoBlob) => {
    if (!videoBlob) return;
    const previewUrl = URL.createObjectURL(videoBlob);
    setMediaData({ type: "video", blob: videoBlob, previewUrl });
  };

  const handleRetake = () => {
    if (mediaData?.type === "video") {
      URL.revokeObjectURL(mediaData.previewUrl);
    }
    setMediaData(null);
  };

  return (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Device selectors */}
      <div className="flex-none px-4 py-3 bg-gray-200 dark:bg-gray-950 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Cameraswitch className="text-gray-700 dark:text-gray-300" />
          <select
            value={videoDeviceId}
            onChange={(e) => setVideoDeviceId(e.target.value)}
            className="text-sm rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none"
          >
            {videoDevices.map((d, i) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Mic className="text-gray-700 dark:text-gray-300" />
          <select
            value={audioDeviceId}
            onChange={(e) => setAudioDeviceId(e.target.value)}
            disabled={!audioAvailable}
            className="text-sm rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none disabled:opacity-50"
          >
            {audioDevices.map((d, i) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Microphone ${i + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera View (muted preview) */}
      <div className="flex-1 flex justify-center items-center overflow-hidden px-2">
        {cameraAvailable ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            muted
            videoConstraints={{
              ...videoConstraints,
              deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
            }}
            screenshotFormat="image/png"
            className="w-[95%] h-auto max-h-[90vh] object-contain rounded-md"
          />
        ) : (
          <div className="w-[95%] h-[70vh] border-2 border-gray-400 dark:border-gray-600 rounded-md flex items-center justify-center text-center text-gray-600 dark:text-gray-300 px-4">
            {cameraError || "No camera available on this device."}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-none px-4 py-3 bg-gray-200 dark:bg-gray-950 flex justify-center items-center gap-6">
        {/* Photo */}
        <Tooltip title="Capture Photo">
          <IconButton
            onClick={capturePhoto}
            disabled={!cameraAvailable}
            className="bg-white hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900 shadow-xl rounded-full p-4"
          >
            <PhotoCamera fontSize="large" className="text-blue-600 dark:text-blue-300" />
          </IconButton>
        </Tooltip>

        {/* Video */}
        <ReactMediaRecorder
          video={{
            ...videoConstraints,
            deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
          }}
          audio={
            audioDeviceId === "off"
              ? false
              : { deviceId: { exact: audioDeviceId } }
          }
          mimeType="video/mp4"
          onStop={(blobUrl, blob) => handleVideoCapture(blob)}
          render={({ status, startRecording, stopRecording }) => (
            <Tooltip title={status === "recording" ? "Stop Recording" : "Start Recording"}>
              <IconButton
                onClick={() => (status === "recording" ? stopRecording() : startRecording())}
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
          )}
        />
      </div>

      {/* Preview Modal */}
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