"use client";

import { useRef, useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as tf from '@tensorflow/tfjs';

interface CameraFeedProps {
  onScan: (imageData: string, predictions?: any[]) => void;
  scanning: boolean;
}

export default function CameraFeed({ onScan, scanning }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string>("");
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  useEffect(() => {
    async function loadModel() {
      try {
        // Replace this URL with your actual YOLO model URL
        const loadedModel = await tf.loadGraphModel('/model/model.json');
        setModel(loadedModel);
      } catch (err) {
        console.error('Failed to load model:', err);
        setError("Failed to load AI model");
      }
    }
    loadModel();
  }, []);

  useEffect(() => {
    async function setupCamera() {
      try {
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setError("");
        }
      } catch (err) {
        setError("Camera access denied. Please enable camera permissions.");
        setHasPermission(false);
      }
    }
    setupCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const preprocessImage = async (imageData: ImageData) => {
    const tensor = tf.browser.fromPixels(imageData)
      .resizeNearestNeighbor([416, 416]) // YOLO typically expects 416x416
      .expandDims(0)
      .toFloat()
      .div(255.0);
    return tensor;
  };

  const detectObjects = async (tensor: tf.Tensor) => {
    if (!model) return null;
    const predictions = await model.predict(tensor) as tf.Tensor;
    return predictions;
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !model) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the current frame
    ctx.drawImage(video, 0, 0);
    
    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    try {
      // Preprocess the image
      const tensor = await preprocessImage(imageData);
      
      // Run detection
      const predictions = await detectObjects(tensor);
      
      // Get base64 image
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Send results back
      onScan(imageDataUrl, predictions?.arraySync());
      
      // Cleanup
      tensor.dispose();
      predictions?.dispose();
    } catch (err) {
      console.error('Detection error:', err);
      setError("Failed to process image");
    }
  };

  if (error) {
    return (
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-red-500 text-center p-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full aspect-video rounded-lg ${!hasPermission ? 'hidden' : ''}`}
      />
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      {!hasPermission && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <Camera className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <Button
        className="w-full mt-4"
        onClick={captureImage}
        disabled={!hasPermission || scanning || !model}
      >
        {!model ? "Loading AI Model..." : scanning ? "Scanning..." : "Scan Product"}
      </Button>
    </div>
  );
}