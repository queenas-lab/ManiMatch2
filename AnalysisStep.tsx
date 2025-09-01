import React, { useEffect, useState } from 'react';
import { Loader2, Palette, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { UserData } from '../App';

interface AnalysisStepProps {
  onNext: () => void;
  onAnalysisComplete: (skinTone: UserData['skinTone']) => void;
  userData: UserData;
}

export function AnalysisStep({ onNext, onAnalysisComplete, userData }: AnalysisStepProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysis, setAnalysis] = useState<UserData['skinTone'] | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const analysisSteps = [
    'Analyzing skin tone...',
    'Detecting undertones...',
    'Matching Pantone colors...',
    'Finding compatible shades...',
    'Analysis complete!'
  ];

  // Mock skin tone analysis results
  const mockAnalysisResults = [
    {
      undertone: 'warm' as const,
      depth: 'light' as const,
      pantoneColors: ['PANTONE 12-0825', 'PANTONE 14-1064', 'PANTONE 16-1546', 'PANTONE 18-1142']
    },
    {
      undertone: 'cool' as const,
      depth: 'medium' as const,
      pantoneColors: ['PANTONE 19-3832', 'PANTONE 17-3938', 'PANTONE 18-3224', 'PANTONE 19-4052']
    },
    {
      undertone: 'neutral' as const,
      depth: 'dark' as const,
      pantoneColors: ['PANTONE 18-1142', 'PANTONE 19-1557', 'PANTONE 18-1763', 'PANTONE 19-1664']
    }
  ];

  useEffect(() => {
    if (userData.skinTone) {
      setAnalysis(userData.skinTone);
      setProgress(100);
      setCurrentStep(4);
      setIsComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        if (newProgress >= 20 && currentStep === 0) setCurrentStep(1);
        if (newProgress >= 40 && currentStep === 1) setCurrentStep(2);
        if (newProgress >= 60 && currentStep === 2) setCurrentStep(3);
        if (newProgress >= 80 && currentStep === 3) setCurrentStep(4);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          // Select random analysis result for demo
          const randomResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];
          setAnalysis(randomResult);
          setIsComplete(true);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [userData.skinTone, currentStep]);

  // Separate useEffect to handle completion callback
  useEffect(() => {
    if (isComplete && analysis && !userData.skinTone) {
      onAnalysisComplete(analysis);
    }
  }, [isComplete, analysis, userData.skinTone, onAnalysisComplete]);

  const getSkinToneDescription = (undertone: string, depth: string) => {
    const undertoneDesc = {
      warm: 'golden, peachy undertones',
      cool: 'pink, blue undertones', 
      neutral: 'balanced undertones'
    };
    
    return `${depth} skin with ${undertoneDesc[undertone as keyof typeof undertoneDesc]}`;
  };

  const getPantoneColor = (pantone: string) => {
    // Enhanced color mapping for demo
    const colorMap: Record<string, string> = {
      // Light warm tones
      'PANTONE 12-0825': '#F4D1AE',
      'PANTONE 14-1064': '#EFAF9E',
      'PANTONE 16-1546': '#E8956C',
      'PANTONE 13-0859': '#F2D2A7',
      
      // Light neutral tones
      'PANTONE 11-0507': '#F7F3F0',
      'PANTONE 12-0404': '#F4E8D6',
      
      // Light cool tones
      'PANTONE 12-0605': '#F5E6E8',
      'PANTONE 13-0404': '#F1E7DC',
      'PANTONE 14-4318': '#E6E2E6',
      'PANTONE 15-3817': '#E8D5E8',
      
      // Medium warm tones
      'PANTONE 18-1142': '#B85450',
      'PANTONE 17-1230': '#D4956B',
      'PANTONE 18-1441': '#C8956A',
      
      // Medium neutral tones
      'PANTONE 17-1327': '#C8A882',
      'PANTONE 17-1456': '#B8956C',
      'PANTONE 18-1763': '#C67B5C',
      
      // Medium cool tones
      'PANTONE 17-3938': '#8B7A9A',
      'PANTONE 18-3224': '#9B8AA3',
      'PANTONE 19-4052': '#4A5D6B',
      
      // Dark warm tones
      'PANTONE 19-1557': '#A04B47',
      'PANTONE 19-1337': '#8B4513',
      
      // Dark neutral tones
      'PANTONE 19-1664': '#8B5A3C',
      
      // Dark cool tones
      'PANTONE 19-3832': '#6B4E71',
      'PANTONE 18-3933': '#7A5980'
    };
    return colorMap[pantone] || '#9CA3AF';
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1>Analyzing Your Skin Tone</h1>
        <p className="text-muted-foreground">
          Using AI to determine your perfect color palette
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {userData.handImage && (
            <div className="flex justify-center">
              <img
                src={userData.handImage}
                alt="Your hand"
                className="w-24 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {progress < 100 ? (
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className="text-sm">{analysisSteps[currentStep]}</span>
            </div>
            
            <Progress value={progress} className="w-full" />
          </div>

          {analysis && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                <h3>Your Skin Tone Profile</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {getSkinToneDescription(analysis.undertone, analysis.depth)}
                </p>
                
                <div>
                  <p className="text-sm mb-3">Complementary Pantone Colors:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {analysis.pantoneColors.map((pantone, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-border mx-auto mb-1"
                          style={{ backgroundColor: getPantoneColor(pantone) }}
                        />
                        <p className="text-xs text-muted-foreground">{pantone.split(' ')[1]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Button onClick={onNext} className="w-full">
          View Nail Polish Recommendations
        </Button>
      )}
    </div>
  );
}