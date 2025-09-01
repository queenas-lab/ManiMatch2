import React, { useRef, useState, useEffect } from "react";
import { Camera, RotateCcw, Check, Shield, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Slider } from "./ui/slider";
import { UserData } from "../App";

// Import all 10 custom hand photos
import hand1 from "figma:asset/f4bb04dd7edb0c9d4db1e6e1a0d39d5bb6b36234.png";
import hand2 from "figma:asset/9c4b6cd1b1e6c6dc7e8e74c98df75a7b3e7b8a58.png";
import hand3 from "figma:asset/e7b3ed7f3f25e48d6c74ac9e6b9f8e8b3e6d7f45.png";
import hand4 from "figma:asset/5d6e7b4e8c3a9f7e5b4e9c8f7a6b3d2e1f8c9d7e.png";
import hand5 from "figma:asset/8f7e6d5c4b3a2f1e9d8c7b6a5f4e3d2c1b0a9f8e.png";
import hand6 from "figma:asset/3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b.png";
import hand7 from "figma:asset/c9f2e9f8df82975fdcceee857adfde29926a9ecb.png";
import hand8 from "figma:asset/ebd26481e8046b441fa3b18504b216c9d0143ba5.png";
import hand9 from "figma:asset/b0b36ced629846db4dd2e551e4b7a037fca778a9.png";
import hand10 from "figma:asset/1acdba36f46ff0c4f1c80db86fa1b377a5374e1d.png";


interface CameraStepProps {
  onNext: () => void;
  onImageCapture: (image: string) => void;
  onSkinToneSet?: (skinTone: UserData['skinTone']) => void;
  userData: UserData;
}

export function CameraStep({
  onNext,
  onImageCapture,
  onSkinToneSet,
  userData,
}: CameraStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(
    null,
  );
  const [capturedImage, setCapturedImage] = useState<
    string | null
  >(userData.handImage || null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(
    null,
  );
  const [permissionState, setPermissionState] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
  const [showDemoSlider, setShowDemoSlider] = useState(false);
  const [skinToneValue, setSkinToneValue] = useState([50]); // 0 = very light, 100 = very dark

  // Check camera permissions on component mount
  useEffect(() => {
    checkCameraPermissions();
  }, []);

  const checkCameraPermissions = async () => {
    setIsCheckingPermissions(true);
    setCameraError(null);
    
    try {
      // First check if media devices are available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera not supported in this browser. Please use the demo mode.");
        setPermissionState('denied');
        setIsCheckingPermissions(false);
        return;
      }

      // Check if we can enumerate devices (this helps detect if camera hardware exists)
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        if (!hasCamera) {
          setCameraError("No camera found on this device. Please use the demo mode to continue.");
          setPermissionState('denied');
          setIsCheckingPermissions(false);
          return;
        }
      } catch (error) {
        console.log('Could not enumerate devices, continuing with permission check');
      }

      // Check if Permissions API is available
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setPermissionState(permission.state);
          
          // Listen for permission changes
          permission.onchange = () => {
            setPermissionState(permission.state);
            if (permission.state === 'granted' && cameraError) {
              setCameraError(null);
            }
          };

          // If permission is already denied, show appropriate message
          if (permission.state === 'denied') {
            setCameraError(
              "Camera permission was previously denied. To enable camera access:\n\n" +
              "• Click the camera icon in your browser's address bar\n" +
              "• Select 'Allow' for camera permissions\n" +
              "• Refresh the page if needed\n\n" +
              "Or continue with the demo mode below."
            );
          }
        } catch (error) {
          console.log('Permissions API not fully supported, will allow direct camera access attempt');
          setPermissionState('unknown');
        }
      } else {
        setPermissionState('unknown');
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      setPermissionState('unknown');
    }
    setIsCheckingPermissions(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    
    // Double-check if camera is supported before attempting access
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera not supported in this browser. Please use the demo mode.");
      setPermissionState('denied');
      return;
    }

    try {
      // First try with rear camera preference for better hand photos
      const constraints = {
        video: { 
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraActive(true);
      setPermissionState('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video starts playing
        videoRef.current.play().catch(playError => {
          console.warn('Video autoplay failed:', playError);
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setPermissionState('denied');
          setCameraError(
            "Camera permission was denied. To enable camera access:\n\n" +
            "• Look for a camera icon in your browser's address bar\n" +
            "• Click it and select 'Allow' for camera permissions\n" +
            "• Or try clicking 'Request Camera Access' again\n" +
            "• You may need to refresh the page\n\n" +
            "Continue with demo mode if you prefer not to use the camera."
          );
        } else if (error.name === "NotFoundError") {
          setPermissionState('denied');
          setCameraError(
            "No camera found on this device. Please use the demo mode to continue."
          );
        } else if (error.name === "NotReadableError") {
          setCameraError(
            "Camera is currently being used by another application. Please:\n\n" +
            "• Close other camera apps or browser tabs using the camera\n" +
            "• Try again, or use the demo mode"
          );
        } else if (error.name === "OverconstrainedError") {
          // Try with more basic constraints
          console.log("Camera constraints too strict, trying basic settings...");
          setTimeout(() => startCameraWithBasicConstraints(), 500);
          return;
        } else {
          setCameraError(
            `Camera error (${error.name}): ${error.message}\n\nPlease use the demo mode to continue.`
          );
        }
      } else {
        setCameraError(
          "Unexpected camera error. Please use the demo mode to continue."
        );
      }
    }
  };

  const startCameraWithBasicConstraints = async () => {
    try {
      // Try with the most basic video constraints possible
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      setPermissionState('granted');
      setCameraError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(playError => {
          console.warn('Video autoplay failed with basic constraints:', playError);
        });
      }
      
      console.log("Camera started successfully with basic constraints");
    } catch (error) {
      console.error("Error with basic camera constraints:", error);
      
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setPermissionState('denied');
          setCameraError(
            "Camera permission is required but was denied. Please:\n\n" +
            "• Allow camera access when prompted by your browser\n" +
            "• Check browser settings for camera permissions\n" +
            "• Use the demo mode if you prefer not to use the camera"
          );
        } else {
          setCameraError(
            `Unable to access camera: ${error.message}\n\nPlease use the demo mode to continue.`
          );
        }
      } else {
        setCameraError(
          "Camera access failed with all settings. Please use the demo mode to continue."
        );
      }
    }
  };

  const createMockImageFromSlider = (toneValue: number) => {
    setCameraError(null);
    setShowDemoSlider(false);
    
    // Get the appropriate real hand image based on skin tone value
    const handImageUrl = getRealHandImageForTone(toneValue);
    
    // Generate corresponding skin tone data based on slider value
    const skinToneData = generateSkinToneFromSlider(toneValue);
    
    // Use the hand image directly without processing through canvas
    // This preserves the original quality and ensures perfect integration with virtual try-on
    setCapturedImage(handImageUrl);
    onImageCapture(handImageUrl);
    
    // Set the skin tone data
    if (onSkinToneSet) {
      onSkinToneSet(skinToneData);
    }
  };

  const getRealHandImageForTone = (toneValue: number): string => {
    // Map skin tone values to the 10 custom hand photos
    // Using the slider range 0-90 with step 10, mapping to hands 1-10
    const handImages = [
      hand1,   // 0: Lightest (Hand 1)
      hand2,   // 10: Very light (Hand 2)
      hand3,   // 20: Light (Hand 3)
      hand4,   // 30: Light-medium (Hand 4)
      hand5,   // 40: Medium (Hand 5)
      hand6,   // 50: Medium-tan (Hand 6)
      hand7,   // 60: Medium-deep (Hand 7)
      hand8,   // 70: Deep (Hand 8)
      hand9,   // 80: Deeper (Hand 9)
      hand10   // 90: Deepest (Hand 10)
    ];
    
    // Determine which hand image to use based on tone value
    const handIndex = Math.min(Math.floor(toneValue / 10), 9);
    return handImages[handIndex];
  };

  const createFallbackMockImage = (toneValue: number) => {
    // Enhanced fallback generation with more accurate color representation
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      canvas.width = 300;
      canvas.height = 400;
      
      // Create a skin tone gradient based on the enhanced color system
      const gradient = ctx.createLinearGradient(0, 0, 300, 400);
      
      // Use the same color calculation as the preview
      const skinToneSteps = [
        { r: 250, g: 220, b: 195 }, // Hand 1 - Light (value 0)
        { r: 245, g: 210, b: 185 }, // Hand 2 - Light (value 10)
        { r: 235, g: 200, b: 175 }, // Hand 3 - Light (value 20)
        { r: 215, g: 180, b: 150 }, // Hand 4 - Light-medium (value 30)
        { r: 195, g: 160, b: 130 }, // Hand 5 - Medium (value 40)
        { r: 175, g: 140, b: 110 }, // Hand 6 - Medium-tan (value 50)
        { r: 145, g: 115, b: 90 },  // Hand 7 - Medium-deep (value 60)
        { r: 125, g: 95, b: 70 },   // Hand 8 - Deep (value 70)
        { r: 105, g: 75, b: 55 },   // Hand 9 - Deeper (value 80)
        { r: 85, g: 60, b: 45 }     // Hand 10 - Deepest (value 90)
      ];
      
      // Since the slider uses steps of 10, directly use the corresponding color
      const handIndex = Math.min(Math.floor(toneValue / 10), 9);
      const color = skinToneSteps[handIndex];
      
      const r = color.r;
      const g = color.g;
      const b = color.b;
      
      // Create realistic skin gradient
      const baseColor = `rgb(${r}, ${g}, ${b})`;
      const shadowColor = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 25)}, ${Math.max(0, b - 20)})`;
      const highlightColor = `rgb(${Math.min(255, r + 20)}, ${Math.min(255, g + 15)}, ${Math.min(255, b + 15)})`;
      
      gradient.addColorStop(0, highlightColor);
      gradient.addColorStop(0.5, baseColor);
      gradient.addColorStop(1, shadowColor);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 400);
      
      // Add some hand-like shape details for realism
      ctx.fillStyle = shadowColor;
      ctx.beginPath();
      // Simple hand silhouette outline
      ctx.ellipse(150, 320, 80, 60, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add finger shapes
      for (let i = 0; i < 5; i++) {
        const x = 100 + i * 25;
        const y = 200 - Math.abs(i - 2) * 20;
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.ellipse(x, y, 12, 40, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      const mockImage = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(mockImage);
      onImageCapture(mockImage);
      
      // Generate corresponding skin tone data based on slider value
      const skinToneData = generateSkinToneFromSlider(toneValue);
      if (onSkinToneSet) {
        onSkinToneSet(skinToneData);
      }
    }
  };

  const generateSkinToneFromSlider = (toneValue: number): UserData['skinTone'] => {
    // More granular depth determination based on 10 hand photos
    let depth: 'light' | 'medium' | 'dark';
    if (toneValue <= 30) {
      depth = 'light';      // Hands 1-3 (0-30)
    } else if (toneValue <= 70) {
      depth = 'medium';     // Hands 4-7 (31-70)
    } else {
      depth = 'dark';       // Hands 8-10 (71-100)
    }

    // Determine undertone based on position within range and some natural variation
    let undertone: 'warm' | 'cool' | 'neutral';
    const undertoneVariation = toneValue % 30;
    if (undertoneVariation <= 10) {
      undertone = 'warm';
    } else if (undertoneVariation <= 20) {
      undertone = 'neutral';
    } else {
      undertone = 'cool';
    }

    // Enhanced Pantone color sets for more precise matching
    const pantoneColorSets = {
      'light-warm': ['PANTONE 12-0825', 'PANTONE 14-1064', 'PANTONE 16-1546', 'PANTONE 13-0859'],
      'light-neutral': ['PANTONE 11-0507', 'PANTONE 12-0404', 'PANTONE 13-0859', 'PANTONE 14-1064'],
      'light-cool': ['PANTONE 12-0605', 'PANTONE 13-0404', 'PANTONE 14-4318', 'PANTONE 15-3817'],
      'medium-warm': ['PANTONE 16-1546', 'PANTONE 18-1142', 'PANTONE 17-1230', 'PANTONE 18-1441'],
      'medium-neutral': ['PANTONE 17-1327', 'PANTONE 18-1142', 'PANTONE 17-1456', 'PANTONE 18-1763'],
      'medium-cool': ['PANTONE 17-3938', 'PANTONE 18-3224', 'PANTONE 17-1456', 'PANTONE 19-4052'],
      'dark-warm': ['PANTONE 18-1142', 'PANTONE 19-1557', 'PANTONE 18-1763', 'PANTONE 19-1337'],
      'dark-neutral': ['PANTONE 19-1557', 'PANTONE 18-1763', 'PANTONE 19-1664', 'PANTONE 19-1337'],
      'dark-cool': ['PANTONE 19-3832', 'PANTONE 19-4052', 'PANTONE 19-1664', 'PANTONE 18-3933']
    };

    const colorKey = `${depth}-${undertone}` as keyof typeof pantoneColorSets;
    const pantoneColors = pantoneColorSets[colorKey] || pantoneColorSets['medium-neutral'];

    return {
      undertone,
      depth,
      pantoneColors
    };
  };

  const createMockImage = (imageType: 'light' | 'dark') => {
    setCameraError(null);
    setShowDemoSlider(false);
    
    // Use the same system as the slider for consistency
    const toneValue = imageType === 'light' ? 20 : 80;
    createMockImageFromSlider(toneValue);
  };

  const handleDemoClick = () => {
    setShowDemoSlider(true);
  };

  const getSkinToneColor = (value: number) => {
    // Accurate skin tone representation based on the 10 hand photos
    // Using exact mapping for slider values 0, 10, 20, 30, 40, 50, 60, 70, 80, 90
    const skinToneSteps = [
      { r: 250, g: 220, b: 195 }, // Hand 1 - Light (value 0)
      { r: 245, g: 210, b: 185 }, // Hand 2 - Light (value 10)
      { r: 235, g: 200, b: 175 }, // Hand 3 - Light (value 20)
      { r: 215, g: 180, b: 150 }, // Hand 4 - Light-medium (value 30)
      { r: 195, g: 160, b: 130 }, // Hand 5 - Medium (value 40)
      { r: 175, g: 140, b: 110 }, // Hand 6 - Medium-tan (value 50)
      { r: 145, g: 115, b: 90 },  // Hand 7 - Medium-deep (value 60)
      { r: 125, g: 95, b: 70 },   // Hand 8 - Deep (value 70)
      { r: 105, g: 75, b: 55 },   // Hand 9 - Deeper (value 80)
      { r: 85, g: 60, b: 45 }     // Hand 10 - Deepest (value 90)
    ];
    
    // Since the slider uses steps of 10, directly map to the corresponding color
    const handIndex = Math.min(Math.floor(value / 10), 9);
    const color = skinToneSteps[handIndex];
    
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(imageData);
      onImageCapture(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraError(null);
    startCamera();
  };

  const handleNext = () => {
    stopCamera();
    onNext();
  };

  // Helper function to get button text
  const getButtonText = () => {
    if (isCheckingPermissions) {
      return "Checking...";
    }
    if (cameraError?.includes('Camera not supported')) {
      return "Camera Unavailable";
    }
    if (cameraError?.includes('No camera found')) {
      return "No Camera Found";
    }
    if (permissionState === 'denied') {
      return "Request Camera Access";
    }
    return "Start Camera";
  };

  // Helper function to determine if camera button should be disabled
  const isCameraButtonDisabled = () => {
    return isCheckingPermissions || 
           cameraError?.includes('Camera not supported') || 
           cameraError?.includes('No camera found');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1>Capture Your Hand</h1>
        <p className="text-muted-foreground">
          Take a clear photo of your hand to analyze your skin
          tone
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            {!capturedImage ? (
              <>
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
                    {isCheckingPermissions ? (
                      <>
                        <RefreshCw className="w-16 h-16 text-muted-foreground animate-spin" />
                        <p className="text-center text-muted-foreground">
                          Checking camera permissions...
                        </p>
                      </>
                    ) : !cameraError ? (
                      <>
                        <Camera className="w-16 h-16 text-muted-foreground" />
                        <p className="text-center text-muted-foreground">
                          Position your hand in good lighting
                        </p>
                      </>
                    ) : (
                      <div className="text-center space-y-3 max-w-sm">
                        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                          <div className="flex items-center justify-center mb-2">
                            <Shield className="w-5 h-5 text-destructive mr-2" />
                            <span className="text-sm font-medium text-destructive">Camera Access Required</span>
                          </div>
                          <p className="text-xs text-destructive whitespace-pre-line leading-relaxed">
                            {cameraError}
                          </p>
                        </div>
                        {permissionState === 'denied' && (
                          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                            <p className="text-xs text-accent font-medium">
                              💡 Demo mode provides the same experience without camera access
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured hand"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="space-y-3 mt-4">
            {!capturedImage ? (
              <>
                {!cameraActive ? (
                  <>
                    <Button
                      onClick={startCamera}
                      className="w-full"
                      disabled={isCameraButtonDisabled()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {getButtonText()}
                    </Button>
                    
                    {!showDemoSlider ? (
                      <Button
                        variant={cameraError ? "default" : "outline"}
                        onClick={handleDemoClick}
                        className="w-full"
                      >
                        {cameraError ? "✨ Try Demo" : "Try Demo"}
                      </Button>
                    ) : (
                      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center space-y-1">
                          <h4 className="text-sm font-medium">Choose Your Demo Hand</h4>
                          <p className="text-xs text-muted-foreground">
                            Select the hand photo that closest matches your skin tone
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Visual preview */}
                          <div className="flex justify-center">
                            <div 
                              className="w-16 h-16 rounded-full border-2 border-border shadow-sm"
                              style={{ backgroundColor: getSkinToneColor(skinToneValue[0]) }}
                            />
                          </div>
                          
                          {/* Slider */}
                          <div className="space-y-2">
                            <Slider
                              value={skinToneValue}
                              onValueChange={setSkinToneValue}
                              max={90}
                              min={0}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Light</span>
                              <span>Deep</span>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowDemoSlider(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => createMockImageFromSlider(skinToneValue[0])}
                              className="flex-1"
                            >
                              Use This Tone
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    onClick={capturePhoto}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Photo
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-2">
        {!cameraError && (
          <p className="text-sm text-muted-foreground">
            Make sure your hand is well-lit and clearly visible
          </p>
        )}
      </div>
    </div>
  );
}