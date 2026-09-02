import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

export default function LiveCameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError('');
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access webcam. Please verify camera permissions or upload a selfie file.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'live_selfie_capture.jpg', { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(blob);
          setCapturedImage({ file, previewUrl });
        }
      }, 'image/jpeg', 0.92);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage.file, capturedImage.previewUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-gov-primary rounded-sm max-w-lg w-full p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gov-border pb-3">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-gov-primary" />
            <h3 className="text-[16px] font-bold text-gov-primary">
              Live Biometric Capture & Liveness Check
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gov-muted hover:text-gov-danger p-1 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Capture View */}
        <div className="relative bg-slate-900 rounded-sm overflow-hidden aspect-video flex items-center justify-center border border-gov-border">
          {cameraError ? (
            <div className="p-4 text-center text-white space-y-2">
              <AlertCircle className="w-8 h-8 text-gov-saffron mx-auto" />
              <p className="text-[13px]">{cameraError}</p>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage.previewUrl}
              alt="Live Capture Snapshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Biometric Oval Guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-60 border-2 border-dashed border-gov-green/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  <span className="text-[11px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded">
                    Align Face Here
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11.5px] text-gov-muted font-mono">
            {capturedImage ? 'Snapshot captured. Confirm to attach.' : 'Look directly at the camera.'}
          </span>

          <div className="flex items-center space-x-2">
            {capturedImage ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="gov-btn-secondary text-[12.5px] py-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="gov-btn-primary text-[12.5px] py-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                disabled={!!cameraError}
                className="gov-btn-primary text-[13px] py-1.5 px-4"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
