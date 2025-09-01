import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Share2,
  ShoppingBag,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { UserData, TryOnStep, SavedLook } from "../App";

// Import all 10 custom hand photos (without green nails)
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

// Import all 10 Try-On hand photos (with green nails to be replaced)
import hand1TryOn from "figma:asset/f9c2281b68acc14492990ec19e2f8500e91b8253.png";
import hand2TryOn from "figma:asset/2332ed447d743640385dbc70de71191a94d7cbc4.png";
import hand3TryOn from "figma:asset/37b42eb14258f3a3778f3f2ae65833c017c038b5.png";
import hand4TryOn from "figma:asset/f93d7d226de333326e3f48a2d59295aa75fd4a84.png";
import hand5TryOn from "figma:asset/7f2d3d5c44f16308c208f8289900347b67fcf8f9.png";
import hand6TryOn from "figma:asset/51b845f50ff38ede6c97d9285fe510389beee456.png";
import hand7TryOn from "figma:asset/e4dfcc9936b412f2b0d11c32cd31f768ca8edaec.png";
import hand8TryOn from "figma:asset/7a2344f0c44695e3abeeb7fe16cb65339831fad8.png";
import hand9TryOn from "figma:asset/b70f124781a9d8ee649898514d86449fce987915.png";
import hand10TryOn from "figma:asset/328c25ca7cd60ce18b33aa1226e7123304d4408f.png";

interface NailPolish {
  id: string;
  name: string;
  brand: string;
  color: string;
  pantone: string;
}

interface VirtualTryOnStepProps {
  userData: UserData;
  goToStep: (step: TryOnStep) => void;
  updateUserData: (data: Partial<UserData>) => void;
}

export function VirtualTryOnStep({
  userData,
  goToStep,
  updateUserData,
}: VirtualTryOnStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use fixed nail preferences for simplified UI
  const nailLength = 'medium';
  const nailShape = 'round';
  const coatCount = 2;
  const topCoat = 'glossy';

  // Get nail polish recommendations based on skin tone
  const getNailPolishRecommendations = (): NailPolish[] => {
    if (!userData.skinTone) return [];

    const { undertone } = userData.skinTone;

    // Warm undertone recommendations
    if (undertone === 'warm') {
      return [
        {
          id: '1',
          name: 'Lincoln Park After Dark',
          brand: 'OPI',
          color: '#3D1A36',
          pantone: 'PANTONE 18-1142',
        },
        {
          id: '2',
          name: 'Bordeaux',
          brand: 'Essie',
          color: '#7D2638',
          pantone: 'PANTONE 19-1557',
        },
        {
          id: '3',
          name: 'A-Taupe the Space Needle',
          brand: 'OPI',
          color: '#9B7E6B',
          pantone: 'PANTONE 16-1546',
        },
        {
          id: '4',
          name: 'Eternal Optimist',
          brand: 'Essie',
          color: '#F4D1AE',
          pantone: 'PANTONE 12-0825',
        },
        {
          id: '13',
          name: 'Miami Beet',
          brand: 'OPI',
          color: '#C73E1D',
          pantone: 'PANTONE 18-1664',
        },
        {
          id: '14',
          name: 'Forever Yummy',
          brand: 'Essie',
          color: '#E87A90',
          pantone: 'PANTONE 16-1546',
        }
      ];
    }

    // Cool undertone recommendations
    if (undertone === 'cool') {
      return [
        {
          id: '5',
          name: 'Russian Navy',
          brand: 'OPI',
          color: '#1E2A4A',
          pantone: 'PANTONE 19-4052',
        },
        {
          id: '6',
          name: 'Wicked',
          brand: 'Essie',
          color: '#2D2D2D',
          pantone: 'PANTONE 19-3832',
        },
        {
          id: '7',
          name: 'Purple Palazzo Pants',
          brand: 'OPI',
          color: '#6B4E71',
          pantone: 'PANTONE 17-3938',
        },
        {
          id: '8',
          name: 'Lilacism',
          brand: 'Essie',
          color: '#9B8AA3',
          pantone: 'PANTONE 18-3224',
        },
        {
          id: '15',
          name: 'Berry Naughty',
          brand: 'OPI',
          color: '#8B5A8C',
          pantone: 'PANTONE 18-3224',
        },
        {
          id: '16',
          name: 'Mint Candy Apple',
          brand: 'Essie',
          color: '#A8E6CF',
          pantone: 'PANTONE 14-5714',
        }
      ];
    }

    // Neutral undertone recommendations
    return [
      {
        id: '9',
        name: 'Malaga Wine',
        brand: 'OPI',
        color: '#8B5A3C',
        pantone: 'PANTONE 19-1664',
      },
      {
        id: '10',
        name: 'Chocolate Drop',
        brand: 'Essie',
        color: '#6B4A3A',
        pantone: 'PANTONE 18-1763',
      },
      {
        id: '11',
        name: 'Suzi Loves Cowboys',
        brand: 'OPI',
        color: '#A04B47',
        pantone: 'PANTONE 19-1557',
      },
      {
        id: '12',
        name: 'Mink Muffs',
        brand: 'Essie',
        color: '#8B7A9A',
        pantone: 'PANTONE 17-3938',
      },
      {
        id: '17',
        name: 'You Don\'t Know Jacques!',
        brand: 'OPI',
        color: '#87CEEB',
        pantone: 'PANTONE 14-4318',
      },
      {
        id: '18',
        name: 'Fishnet Stockings',
        brand: 'Essie',
        color: '#2F2F2F',
        pantone: 'PANTONE 19-4007',
      }
    ];
  };

  const availableColors = getNailPolishRecommendations();

  const handleColorSelect = (polish: NailPolish) => {
    updateUserData({
      selectedPolish: {
        id: polish.id,
        name: polish.name,
        brand: polish.brand,
        color: polish.color,
        pantone: polish.pantone,
      }
    });
  };
  
  // Convert coat count to opacity values
  const getOpacityFromCoats = (coats: number): number => {
    switch (coats) {
      case 1: return 0.55; // Light, translucent coverage
      case 2: return 0.85; // Standard coverage
      case 3: return 0.95; // Full, opaque coverage
      default: return 0.85;
    }
  };

  // Get glossiness value from top coat selection
  const getGlossinessFromTopCoat = (coat: 'glossy' | 'matte'): number => {
    switch (coat) {
      case 'glossy': return 0.8; // High shine, reflective finish
      case 'matte': return 0.1; // Minimal shine, flat finish
      default: return 0.6;
    }
  };
  
  // Get the Try-On hand image that corresponds to the current hand selection
  const getTryOnHandImage = (): string | null => {
    if (!userData.handImage) {
      return null;
    }

    // Map regular hand images to try-on images
    const handPhotos = [
      hand1, hand2, hand3, hand4, hand5, hand6, hand7, hand8, hand9, hand10
    ];
    
    const tryOnPhotos = [
      hand1TryOn, hand2TryOn, hand3TryOn, hand4TryOn, hand5TryOn, 
      hand6TryOn, hand7TryOn, hand8TryOn, hand9TryOn, hand10TryOn
    ];
    
    const handIndex = handPhotos.findIndex(photo => userData.handImage === photo);
    
    if (handIndex !== -1) {
      return tryOnPhotos[handIndex];
    }

    // For user-captured images, return null so we use the nail positioning system
    return null;
  };

  // Get hand number from skin tone for proper mapping
  const getHandNumberFromSkinTone = (): number | null => {
    if (!userData.skinTone) return null;
    
    // Map skin tone depth and undertone to approximate hand numbers
    const { depth, undertone } = userData.skinTone;
    
    if (depth === 'light') {
      return undertone === 'warm' ? 1 : undertone === 'neutral' ? 2 : 3;
    } else if (depth === 'medium') {
      return undertone === 'warm' ? 4 : undertone === 'neutral' ? 5 : 6;
    } else { // dark
      return undertone === 'warm' ? 7 : undertone === 'neutral' ? 8 : 9;
    }
  };

  // Improved nail position detection with custom hand photo support
  const getOptimizedNailPositions = (): any[] => {
    if (!userData.handImage) {
      return getDefaultNailPositions();
    }

    // Get the hand photo identifier from the image source
    const handPhotos = [
      hand1, hand2, hand3, hand4, hand5, hand6, hand7, hand8, hand9, hand10
    ];
    
    const handIndex = handPhotos.findIndex(photo => userData.handImage === photo);
    
    if (handIndex !== -1) {
      return getCustomHandNailPositions(handIndex + 1);
    }

    // For user-captured images, use smart positioning based on skin tone
    return getAdaptiveNailPositions();
  };

  // Nail positioning coordinates for each of the 10 custom hand photos
  const getCustomHandNailPositions = (handNumber: number): any[] => {
    const positionSets = {
      1: [ // Hand 1 - Lightest skin tone
        { x: 0.260, y: 0.275, width: 0.076, height: 0.122, rotation: -16, name: 'thumb', curvature: { top: 0.79, bottom: 0.37 } },
        { x: 0.360, y: 0.180, width: 0.066, height: 0.152, rotation: 6, name: 'index', curvature: { top: 0.88, bottom: 0.44 } },
        { x: 0.435, y: 0.150, width: 0.069, height: 0.167, rotation: 1, name: 'middle', curvature: { top: 0.88, bottom: 0.44 } },
        { x: 0.510, y: 0.180, width: 0.059, height: 0.147, rotation: -2, name: 'ring', curvature: { top: 0.85, bottom: 0.43 } },
        { x: 0.575, y: 0.240, width: 0.049, height: 0.107, rotation: -14, name: 'pinky', curvature: { top: 0.75, bottom: 0.34 } }
      ],
      2: [ // Hand 2 - Very light skin tone
        { x: 0.265, y: 0.280, width: 0.075, height: 0.120, rotation: -17, name: 'thumb', curvature: { top: 0.78, bottom: 0.36 } },
        { x: 0.365, y: 0.185, width: 0.065, height: 0.150, rotation: 7, name: 'index', curvature: { top: 0.87, bottom: 0.43 } },
        { x: 0.440, y: 0.155, width: 0.068, height: 0.165, rotation: 2, name: 'middle', curvature: { top: 0.87, bottom: 0.43 } },
        { x: 0.515, y: 0.185, width: 0.058, height: 0.145, rotation: -3, name: 'ring', curvature: { top: 0.84, bottom: 0.42 } },
        { x: 0.580, y: 0.245, width: 0.048, height: 0.105, rotation: -15, name: 'pinky', curvature: { top: 0.74, bottom: 0.33 } }
      ],
      3: [ // Hand 3 - Light skin tone
        { x: 0.270, y: 0.285, width: 0.077, height: 0.123, rotation: -18, name: 'thumb', curvature: { top: 0.77, bottom: 0.35 } },
        { x: 0.370, y: 0.190, width: 0.064, height: 0.148, rotation: 5, name: 'index', curvature: { top: 0.86, bottom: 0.42 } },
        { x: 0.445, y: 0.160, width: 0.067, height: 0.163, rotation: 0, name: 'middle', curvature: { top: 0.86, bottom: 0.42 } },
        { x: 0.520, y: 0.190, width: 0.057, height: 0.143, rotation: -4, name: 'ring', curvature: { top: 0.83, bottom: 0.41 } },
        { x: 0.585, y: 0.250, width: 0.047, height: 0.103, rotation: -16, name: 'pinky', curvature: { top: 0.73, bottom: 0.32 } }
      ],
      4: [ // Hand 4 - Light-medium skin tone
        { x: 0.275, y: 0.290, width: 0.078, height: 0.124, rotation: -19, name: 'thumb', curvature: { top: 0.76, bottom: 0.34 } },
        { x: 0.375, y: 0.195, width: 0.063, height: 0.153, rotation: 4, name: 'index', curvature: { top: 0.85, bottom: 0.41 } },
        { x: 0.450, y: 0.165, width: 0.066, height: 0.168, rotation: -1, name: 'middle', curvature: { top: 0.85, bottom: 0.41 } },
        { x: 0.525, y: 0.195, width: 0.056, height: 0.148, rotation: -5, name: 'ring', curvature: { top: 0.82, bottom: 0.40 } },
        { x: 0.590, y: 0.255, width: 0.046, height: 0.108, rotation: -13, name: 'pinky', curvature: { top: 0.72, bottom: 0.31 } }
      ],
      5: [ // Hand 5 - Medium skin tone
        { x: 0.280, y: 0.295, width: 0.080, height: 0.125, rotation: -20, name: 'thumb', curvature: { top: 0.76, bottom: 0.35 } },
        { x: 0.375, y: 0.200, width: 0.062, height: 0.155, rotation: 6, name: 'index', curvature: { top: 0.85, bottom: 0.42 } },
        { x: 0.450, y: 0.170, width: 0.065, height: 0.170, rotation: 1, name: 'middle', curvature: { top: 0.85, bottom: 0.42 } },
        { x: 0.525, y: 0.200, width: 0.055, height: 0.150, rotation: -4, name: 'ring', curvature: { top: 0.83, bottom: 0.41 } },
        { x: 0.590, y: 0.260, width: 0.045, height: 0.110, rotation: -12, name: 'pinky', curvature: { top: 0.73, bottom: 0.32 } }
      ],
      6: [ // Hand 6 - Medium-tan skin tone
        { x: 0.285, y: 0.300, width: 0.081, height: 0.127, rotation: -21, name: 'thumb', curvature: { top: 0.75, bottom: 0.34 } },
        { x: 0.380, y: 0.205, width: 0.061, height: 0.157, rotation: 3, name: 'index', curvature: { top: 0.84, bottom: 0.41 } },
        { x: 0.455, y: 0.175, width: 0.064, height: 0.172, rotation: -2, name: 'middle', curvature: { top: 0.84, bottom: 0.41 } },
        { x: 0.530, y: 0.205, width: 0.054, height: 0.152, rotation: -6, name: 'ring', curvature: { top: 0.82, bottom: 0.40 } },
        { x: 0.595, y: 0.265, width: 0.044, height: 0.112, rotation: -11, name: 'pinky', curvature: { top: 0.72, bottom: 0.31 } }
      ],
      7: [ // Hand 7 - Medium-deep skin tone
        { x: 0.290, y: 0.305, width: 0.082, height: 0.128, rotation: -22, name: 'thumb', curvature: { top: 0.74, bottom: 0.33 } },
        { x: 0.385, y: 0.210, width: 0.060, height: 0.158, rotation: 2, name: 'index', curvature: { top: 0.84, bottom: 0.41 } },
        { x: 0.460, y: 0.180, width: 0.063, height: 0.173, rotation: -3, name: 'middle', curvature: { top: 0.84, bottom: 0.41 } },
        { x: 0.535, y: 0.210, width: 0.053, height: 0.153, rotation: -7, name: 'ring', curvature: { top: 0.81, bottom: 0.39 } },
        { x: 0.600, y: 0.270, width: 0.043, height: 0.113, rotation: -10, name: 'pinky', curvature: { top: 0.71, bottom: 0.30 } }
      ],
      8: [ // Hand 8 - Deep skin tone
        { x: 0.295, y: 0.310, width: 0.083, height: 0.130, rotation: -23, name: 'thumb', curvature: { top: 0.73, bottom: 0.32 } },
        { x: 0.390, y: 0.215, width: 0.059, height: 0.160, rotation: 1, name: 'index', curvature: { top: 0.83, bottom: 0.40 } },
        { x: 0.465, y: 0.185, width: 0.062, height: 0.175, rotation: -4, name: 'middle', curvature: { top: 0.83, bottom: 0.40 } },
        { x: 0.540, y: 0.215, width: 0.052, height: 0.155, rotation: -8, name: 'ring', curvature: { top: 0.80, bottom: 0.38 } },
        { x: 0.605, y: 0.275, width: 0.042, height: 0.115, rotation: -9, name: 'pinky', curvature: { top: 0.70, bottom: 0.29 } }
      ],
      9: [ // Hand 9 - Deeper skin tone
        { x: 0.300, y: 0.315, width: 0.085, height: 0.132, rotation: -24, name: 'thumb', curvature: { top: 0.72, bottom: 0.31 } },
        { x: 0.395, y: 0.220, width: 0.058, height: 0.162, rotation: 0, name: 'index', curvature: { top: 0.82, bottom: 0.39 } },
        { x: 0.470, y: 0.190, width: 0.061, height: 0.177, rotation: -5, name: 'middle', curvature: { top: 0.82, bottom: 0.39 } },
        { x: 0.545, y: 0.220, width: 0.051, height: 0.157, rotation: -9, name: 'ring', curvature: { top: 0.79, bottom: 0.37 } },
        { x: 0.610, y: 0.280, width: 0.041, height: 0.117, rotation: -8, name: 'pinky', curvature: { top: 0.69, bottom: 0.28 } }
      ],
      10: [ // Hand 10 - Deepest skin tone
        { x: 0.305, y: 0.320, width: 0.087, height: 0.135, rotation: -25, name: 'thumb', curvature: { top: 0.71, bottom: 0.30 } },
        { x: 0.400, y: 0.225, width: 0.057, height: 0.165, rotation: -1, name: 'index', curvature: { top: 0.81, bottom: 0.38 } },
        { x: 0.475, y: 0.195, width: 0.060, height: 0.180, rotation: -6, name: 'middle', curvature: { top: 0.81, bottom: 0.38 } },
        { x: 0.550, y: 0.225, width: 0.050, height: 0.160, rotation: -10, name: 'ring', curvature: { top: 0.78, bottom: 0.36 } },
        { x: 0.615, y: 0.285, width: 0.040, height: 0.120, rotation: -7, name: 'pinky', curvature: { top: 0.68, bottom: 0.27 } }
      ]
    };

    return positionSets[handNumber as keyof typeof positionSets] || getDefaultNailPositions();
  };

  const getDefaultNailPositions = () => [
    { 
      x: 0.415, y: 0.345, width: 0.082, height: 0.125, 
      rotation: -16, name: 'thumb',
      curvature: { top: 0.72, bottom: 0.32 }
    },
    { 
      x: 0.518, y: 0.245, width: 0.062, height: 0.155, 
      rotation: 6, name: 'index',
      curvature: { top: 0.82, bottom: 0.41 }
    },
    { 
      x: 0.598, y: 0.215, width: 0.062, height: 0.165, 
      rotation: 1, name: 'middle',
      curvature: { top: 0.82, bottom: 0.41 }
    },
    { 
      x: 0.678, y: 0.245, width: 0.052, height: 0.145, 
      rotation: -4, name: 'ring',
      curvature: { top: 0.81, bottom: 0.40 }
    },
    { 
      x: 0.748, y: 0.315, width: 0.042, height: 0.105, 
      rotation: -9, name: 'pinky',
      curvature: { top: 0.70, bottom: 0.31 }
    },
  ];

  const getAdaptiveNailPositions = () => {
    // Smart positioning based on detected skin tone
    const basePositions = getDefaultNailPositions();
    
    if (userData.skinTone?.depth === 'light') {
      return basePositions.map(nail => ({
        ...nail,
        x: nail.x - 0.01, // Slight adjustment for lighter skin tones
        y: nail.y - 0.005,
      }));
    } else if (userData.skinTone?.depth === 'dark') {
      return basePositions.map(nail => ({
        ...nail,
        x: nail.x + 0.005, // Slight adjustment for darker skin tones
        y: nail.y + 0.01,
      }));
    }
    
    return basePositions;
  };

  const [nailPositions, setNailPositions] = useState(() => {
    return getOptimizedNailPositions();
  });

  useEffect(() => {
    // Update nail positions when hand image or skin tone changes
    setNailPositions(getOptimizedNailPositions());
  }, [userData.handImage, userData.skinTone]);

  useEffect(() => {
    if (userData.handImage && userData.selectedPolish) {
      drawVirtualTryOn();
    }
  }, [userData.handImage, userData.selectedPolish, nailPositions]);

  const drawVirtualTryOn = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (
      !canvas ||
      !ctx ||
      !userData.handImage ||
      !userData.selectedPolish
    )
      return;

    setIsProcessing(true);
    const img = new Image();
    
    // Set crossOrigin for Unsplash images
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        // Set canvas size with higher resolution for better quality
        const scale = window.devicePixelRatio || 1;
        canvas.width = 300 * scale;
        canvas.height = 400 * scale;
        canvas.style.width = '300px';
        canvas.style.height = '400px';
        ctx.scale(scale, scale);

        // Clear canvas
        ctx.clearRect(0, 0, 300, 400);

        // Draw the hand image
        ctx.drawImage(img, 0, 0, 300, 400);

        // Get the Try-On image URL to check if we need color replacement
        const tryOnImageUrl = getTryOnHandImage();
        const isUsingTryOnImage = tryOnImageUrl && tryOnImageUrl === img.src;

        if (isUsingTryOnImage) {
          // Replace green nails with selected polish color
          replaceGreenNailsWithColor(ctx, userData.selectedPolish!.color, 300, 400);
        } else {
          // Apply realistic nail polish rendering for regular images
          nailPositions.forEach((nail, index) => {
            drawRealisticNail(ctx, nail, userData.selectedPolish!.color, 300, 400, 'medium', 'round');
          });
        }

        setIsProcessing(false);
      } catch (error) {
        console.error('Error drawing virtual try-on:', error);
        setIsProcessing(false);
      }
    };
    
    img.onerror = (error) => {
      console.error('Error loading hand image for virtual try-on:', error);
      setIsProcessing(false);
    };
    
    // Use the Try-On image if available, otherwise use the regular hand image
    const tryOnImageUrl = getTryOnHandImage();
    img.src = tryOnImageUrl || userData.handImage;
  };

  const drawRealisticNail = (
    ctx: CanvasRenderingContext2D, 
    nail: any, 
    color: string, 
    canvasWidth: number, 
    canvasHeight: number,
    length: 'short' | 'medium' | 'long',
    shape: 'round' | 'square' | 'oval'
  ) => {
    // Adjust dimensions based on length preference
    const lengthMultiplier = length === 'short' ? 0.8 : length === 'long' ? 1.25 : 1.0;
    
    const x = nail.x * canvasWidth;
    const y = nail.y * canvasHeight;
    const width = nail.width * canvasWidth;
    const height = (nail.height * canvasHeight) * lengthMultiplier;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    ctx.save();
    
    // Rotate for natural nail angle
    ctx.translate(centerX, centerY);
    ctx.rotate((nail.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Create nail shape path based on shape preference
    ctx.beginPath();
    
    if (shape === 'round') {
      // Round nail shape
      const topRadius = width * nail.curvature.top;
      const bottomRadius = width * nail.curvature.bottom;
      
      ctx.moveTo(centerX - topRadius / 2, y);
      ctx.quadraticCurveTo(centerX, y - height * 0.1, centerX + topRadius / 2, y);
      ctx.lineTo(centerX + bottomRadius / 2, y + height);
      ctx.quadraticCurveTo(centerX, y + height + height * 0.05, centerX - bottomRadius / 2, y + height);
      ctx.lineTo(centerX - topRadius / 2, y);
      
    } else if (shape === 'square') {
      // Square nail shape with minimal rounding
      const topRadius = width * 0.4;
      const bottomRadius = width * 0.45;
      
      ctx.moveTo(centerX - topRadius / 2, y);
      ctx.lineTo(centerX + topRadius / 2, y);
      ctx.lineTo(centerX + bottomRadius / 2, y + height);
      ctx.lineTo(centerX - bottomRadius / 2, y + height);
      ctx.lineTo(centerX - topRadius / 2, y);
      
    } else if (shape === 'oval') {
      // Oval nail shape - more elongated
      const topRadius = width * 0.8;
      const bottomRadius = width * 0.6;
      
      ctx.moveTo(centerX - topRadius / 2, y);
      ctx.quadraticCurveTo(centerX, y - height * 0.15, centerX + topRadius / 2, y);
      ctx.quadraticCurveTo(centerX + width * 0.4, centerY, centerX + bottomRadius / 2, y + height);
      ctx.quadraticCurveTo(centerX, y + height + height * 0.1, centerX - bottomRadius / 2, y + height);
      ctx.quadraticCurveTo(centerX - width * 0.4, centerY, centerX - topRadius / 2, y);
    }
    
    ctx.closePath();

    // Create clipping mask for the nail shape
    ctx.clip();

    const currentOpacity = getOpacityFromCoats(2);
    
    // Base color layer
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = color;
    ctx.globalAlpha = currentOpacity * 0.8;
    ctx.fill();

    // Add depth and dimension
    ctx.globalCompositeOperation = 'overlay';
    const gradient = ctx.createLinearGradient(centerX - width/2, y, centerX + width/2, y + height);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.3 * currentOpacity})`);
    gradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.1 * currentOpacity})`);
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${0.2 * currentOpacity})`);
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.6;
    ctx.fill();

    // Add top coat finish effect
    const currentGlossiness = getGlossinessFromTopCoat('glossy');
    if (currentGlossiness > 0.1) {
      ctx.globalCompositeOperation = 'screen';
      const highlightGradient = ctx.createRadialGradient(
        centerX - width * 0.15, 
        y + height * 0.2, 
        0,
        centerX - width * 0.15, 
        y + height * 0.2, 
        width * 0.6
      );
      
      highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${currentGlossiness * 0.8})`);
      highlightGradient.addColorStop(0.4, `rgba(255, 255, 255, ${currentGlossiness * 0.3})`);
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = highlightGradient;
      ctx.globalAlpha = 0.8; // Glossy finish
      ctx.fill();
    }

    // Add glossy finish texture
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = `rgba(255, 255, 255, 0.02)`;
    ctx.fill();

    ctx.restore();
  };

  // Function to replace green nail color with selected polish color
  const replaceGreenNailsWithColor = (
    ctx: CanvasRenderingContext2D,
    newColor: string,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    // Get image data to process pixels
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    // Parse the new color
    const newColorRgb = hexToRgb(newColor);
    if (!newColorRgb) return;

    // Enhanced green detection function - comprehensive coverage
    const isGreenNail = (r: number, g: number, b: number): { isGreen: boolean; isHighlight: boolean; brightness: number } => {
      // Calculate color properties
      const total = r + g + b;
      const greenRatio = total > 0 ? g / total : 0;
      const maxChannel = Math.max(r, g, b);
      const minChannel = Math.min(r, g, b);
      const brightness = maxChannel / 255;
      const averageBrightness = total / (3 * 255);
      
      // Multiple green detection strategies
      const strategies = [
        // Strategy 1: Traditional green dominance
        g > r && g > b && g > 70,
        
        // Strategy 2: Green ratio-based (catches subtle green tints)
        greenRatio > 0.38 && g > r + 8 && g > b + 8,
        
        // Strategy 3: Bright green highlights (very light green areas)
        brightness > 0.55 && g > r + 12 && g > b + 12 && g > 100,
        
        // Strategy 4: Medium green tones
        g > 90 && g > r + 10 && g > b + 10 && brightness > 0.25 && brightness < 0.8,
        
        // Strategy 5: Dark green shadows
        g > 50 && g > r + 8 && g > b + 8 && brightness < 0.5,
        
        // Strategy 6: Saturated green (high green, low other channels)
        g > 120 && (g - r) > 30 && (g - b) > 30,
        
        // Strategy 7: Desaturated green (gray-green tones)
        greenRatio > 0.42 && (maxChannel - minChannel) < 60 && g > 80,
        
        // Strategy 8: Very subtle green tints in highlights
        brightness > 0.7 && g > r + 5 && g > b + 5 && greenRatio > 0.35
      ];
      
      // A pixel is considered green if any strategy matches
      const isGreenishColor = strategies.some(strategy => strategy);

      // Enhanced highlight detection
      const isHighlight = (
        brightness > 0.65 && (maxChannel - minChannel) < 90
      ) || (
        // Also catch very bright areas that might be highlights
        brightness > 0.8 && g > r && g > b
      );
      
      return { isGreen: isGreenishColor, isHighlight, brightness };
    };

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      // Skip transparent pixels
      if (alpha === 0) continue;

      const { isGreen, isHighlight, brightness } = isGreenNail(r, g, b);

      if (isGreen) {
        // Calculate the intensity factor (how strong the original color was)
        const originalIntensity = Math.max(r, g, b) / 255;
        
        if (isHighlight) {
          // For highlight areas, create realistic nail polish shine
          const shineIntensity = Math.min(brightness * 1.2, 0.95);
          
          // Mix the new color with white for shine effect
          const shineR = Math.round(newColorRgb.r + (255 - newColorRgb.r) * shineIntensity * 0.6);
          const shineG = Math.round(newColorRgb.g + (255 - newColorRgb.g) * shineIntensity * 0.6);
          const shineB = Math.round(newColorRgb.b + (255 - newColorRgb.b) * shineIntensity * 0.6);
          
          data[i] = Math.min(255, shineR);
          data[i + 1] = Math.min(255, shineG);
          data[i + 2] = Math.min(255, shineB);
        } else {
          // For regular nail areas, apply the new color with proper intensity
          const intensityFactor = Math.max(0.3, originalIntensity); // Ensure minimum visibility
          
          data[i] = Math.round(newColorRgb.r * intensityFactor);
          data[i + 1] = Math.round(newColorRgb.g * intensityFactor);
          data[i + 2] = Math.round(newColorRgb.b * intensityFactor);
        }
      }
    }

    // Put the processed image data back to the canvas
    ctx.putImageData(imageData, 0, 0);
  };

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Save current look to saved looks
  const handleSaveLook = () => {
    if (!userData.handImage || !userData.selectedPolish) return;

    const newLook: SavedLook = {
      id: Date.now().toString(),
      handImage: userData.handImage,
      polish: userData.selectedPolish,
      savedAt: new Date().toISOString(),
    };

    updateUserData({
      savedLooks: [...(userData.savedLooks || []), newLook]
    });

    // Optional: Show a toast or feedback that the look was saved
    // For now, we'll just update the data
  };

  // Share current look
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], 'nail-look.png', { type: 'image/png' });
          navigator.share({
            title: `${userData.selectedPolish?.name} by ${userData.selectedPolish?.brand}`,
            text: 'Check out my nail look from Nail Polish Try-On!',
            files: [file],
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          const url = canvas.toDataURL();
          const link = document.createElement('a');
          link.download = 'nail-look.png';
          link.href = url;
          link.click();
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Get compatibility rating for selected polish
  const getCompatibilityRating = () => {
    if (!userData.selectedPolish || !userData.skinTone) return null;
    
    // Simple compatibility logic - in a real app this would be more sophisticated
    const { undertone } = userData.skinTone;
    const polishId = userData.selectedPolish.id;
    
    // Warm undertone polishes work best with warm skin
    const warmPolishes = ['1', '2', '3', '4', '13', '14'];
    // Cool undertone polishes work best with cool skin
    const coolPolishes = ['5', '6', '7', '8', '15', '16'];
    // Neutral polishes work with all skin tones
    const neutralPolishes = ['9', '10', '11', '12', '17', '18'];
    
    if (neutralPolishes.includes(polishId)) {
      return 'Excellent Match';
    } else if (
      (undertone === 'warm' && warmPolishes.includes(polishId)) ||
      (undertone === 'cool' && coolPolishes.includes(polishId))
    ) {
      return 'Excellent Match';
    } else if (undertone === 'neutral') {
      return 'Great Match';
    } else {
      return 'Good Match';
    }
  };

  if (!userData.handImage || !userData.selectedPolish) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4">Virtual Try-On</h1>
          <p className="text-muted-foreground mb-6">
            Please complete your skin tone analysis and select a polish to continue.
          </p>
          <Button onClick={() => goToStep('recommendations')}>
            Go Back to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goToStep('recommendations')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1>Virtual Try-On</h1>
        <div className="w-16" /> {/* Spacer for alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Polish Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-6 h-6 rounded-full border border-border" 
                  style={{ backgroundColor: userData.selectedPolish.color }}
                />
                <div>
                  <h3 className="font-medium">{userData.selectedPolish.name}</h3>
                  <p className="text-sm text-muted-foreground">{userData.selectedPolish.brand}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pantone</span>
                  <span className="text-sm font-medium">{userData.selectedPolish.pantone}</span>
                </div>
                
                {/* Compatibility Rating moved to top */}
                {getCompatibilityRating() && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Compatibility</span>
                    <Badge 
                      variant={getCompatibilityRating() === 'Excellent Match' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {getCompatibilityRating()}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Virtual Try-On Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <div className="relative mx-auto" style={{ width: '300px', height: '400px' }}>
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={400}
                    className="w-full h-full rounded-lg border border-border"
                    style={{ width: '300px', height: '400px' }}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 animate-pulse text-accent" />
                        <span className="text-sm">Applying polish...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Try Different Colors */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Try Different Colors</h3>
              <div className="grid grid-cols-6 gap-2">
                {availableColors.map((polish) => (
                  <button
                    key={polish.id}
                    onClick={() => handleColorSelect(polish)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      userData.selectedPolish?.id === polish.id
                        ? 'border-accent scale-110'
                        : 'border-border hover:border-accent/50'
                    }`}
                    style={{ backgroundColor: polish.color }}
                    title={`${polish.name} by ${polish.brand}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" size="sm" onClick={handleSaveLook}>
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button className="w-full" size="sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}