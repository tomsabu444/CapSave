import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { ReactMediaRecorder } from "react-media-recorder";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  MenuItem,
  Select,
  LinearProgress,
} from "@mui/material";
import {
  PhotoCamera,
  Videocam,
  Replay,
  Save,
  Cameraswitch,
} from "@mui/icons-material";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const CaptureMediaPage = () => {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = mediaDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoInputs);
      if (videoInputs.length) setDeviceId(videoInputs[0].deviceId);
    };
    fetchDevices();
  }, []);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedPhoto(imageSrc);
    setMediaType("photo");
    setOpenPreview(true);
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpenPreview(false);
      setCapturedPhoto(null);
      setMediaType(null);
    }, 1000);
  };

  const handleRetake = () => {
    setOpenPreview(false);
    setCapturedPhoto(null);
    setMediaType(null);
  };

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col overflow-hidden">
      {/* Camera View */}
      <div className="flex-1 flex justify-center  overflow-hidden">
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
            {devices.map((device, idx) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${idx + 1}`}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-10">
          <IconButton
            onClick={capturePhoto}
            className="bg-white hover:bg-blue-100 shadow-xl rounded-full p-4"
          >
            <PhotoCamera fontSize="large" className="text-blue-600" />
          </IconButton>

          <ReactMediaRecorder
            video
            render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
              <>
                <IconButton
                  onClick={
                    status === "recording"
                      ? () => {
                          stopRecording();
                          setTimeout(() => {
                            setMediaType("video");
                            setOpenPreview(true);
                          }, 500);
                        }
                      : startRecording
                  }
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

                {/* Video Preview */}
                <Dialog
                  open={openPreview && mediaType === "video"}
                  onClose={() => setOpenPreview(false)}
                  maxWidth="sm"
                  fullWidth
                  PaperProps={{ className: "bg-gray-900 text-white rounded-lg" }}
                >
                  <DialogContent>
                    {mediaBlobUrl ? (
                      <video
                        controls
                        autoPlay
                        src={mediaBlobUrl}
                        className="w-full rounded-lg shadow"
                      />
                    ) : (
                      <LinearProgress />
                    )}
                  </DialogContent>
                  <DialogActions className="p-4 flex justify-between">
                    <Button onClick={handleRetake} variant="outlined" className="text-white border-white hover:bg-gray-800">
                      Retake
                    </Button>
                    <Button onClick={handleSave} variant="contained" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                      Save
                    </Button>
                  </DialogActions>
                  {isLoading && <LinearProgress />}
                </Dialog>
              </>
            )}
          />
        </div>
      </div>

      {/* Photo Preview */}
      <Dialog
        open={openPreview && mediaType === "photo"}
        onClose={() => setOpenPreview(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "bg-gray-900 text-white rounded-lg" }}
      >
        <DialogContent className="flex justify-center items-center">
          <img src={capturedPhoto} alt="Captured" className="w-full rounded-lg shadow" />
        </DialogContent>
        <DialogActions className="p-4 flex justify-between">
          <Button onClick={handleRetake} variant="outlined" className="text-white border-white hover:bg-gray-800">
            Retake
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </DialogActions>
        {isLoading && <LinearProgress />}
      </Dialog>
    </div>
  );
};

export default CaptureMediaPage;
