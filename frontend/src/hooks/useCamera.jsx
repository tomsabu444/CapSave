import { useEffect, useRef, useState } from "react";

export const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Request permission and load cameras
  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Prompt permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length) setSelectedDeviceId(videoDevices[0].deviceId);
      } catch (err) {
        console.error("Camera permission error:", err);
        alert("Please allow camera access to use this feature.");
      }
    };
    loadDevices();
  }, []);

  // Start video stream
  useEffect(() => {
    const startStream = async () => {
      if (!selectedDeviceId) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } }
        });
        if (videoRef.current) {
          const oldStream = videoRef.current.srcObject;
          if (oldStream) oldStream.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Stream start error:", err);
        alert("Failed to access selected camera.");
      }
    };
    startStream();
  }, [selectedDeviceId]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL("image/png"));
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const recorder = new MediaRecorder(stream);
    setChunks([]);

    recorder.ondataavailable = e => {
      if (e.data.size > 0) setChunks(prev => [...prev, e.data]);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedVideoURL(URL.createObjectURL(blob));
    };

    recorder.start();
    setRecording(true);
    mediaRecorderRef.current = recorder;
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const reset = () => {
    setCapturedPhoto(null);
    setRecordedVideoURL(null);
  };

  return {
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
  };
};
