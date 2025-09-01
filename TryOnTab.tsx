import React, { useState } from 'react';
import { CameraStep } from './CameraStep';
import { AnalysisStep } from './AnalysisStep';
import { RecommendationsStep } from './RecommendationsStep';
import { VirtualTryOnStep } from './VirtualTryOnStep';
import { TryOnStep, UserData } from '../App';

interface TryOnTabProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

export function TryOnTab({ userData, updateUserData }: TryOnTabProps) {
  const [currentStep, setCurrentStep] = useState<TryOnStep>('camera');

  const nextStep = () => {
    switch (currentStep) {
      case 'camera':
        setCurrentStep('analysis');
        break;
      case 'analysis':
        setCurrentStep('recommendations');
        break;
      case 'recommendations':
        setCurrentStep('virtualTryOn');
        break;
    }
  };

  const goToStep = (step: TryOnStep) => {
    setCurrentStep(step);
  };

  // Auto-advance to analysis if we have a hand image
  React.useEffect(() => {
    if (userData.handImage && currentStep === 'camera') {
      // Use setTimeout to avoid setState during render
      const timer = setTimeout(() => {
        setCurrentStep('analysis');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [userData.handImage, currentStep]);

  return (
    <>
      {currentStep === 'camera' && (
        <CameraStep 
          onNext={nextStep}
          onImageCapture={(image) => updateUserData({ handImage: image })}
          onSkinToneSet={(skinTone) => updateUserData({ skinTone })}
          userData={userData}
        />
      )}
      {currentStep === 'analysis' && (
        <AnalysisStep 
          onNext={nextStep}
          onAnalysisComplete={(skinTone) => updateUserData({ skinTone })}
          userData={userData}
        />
      )}
      {currentStep === 'recommendations' && (
        <RecommendationsStep 
          onNext={nextStep}
          onPolishSelect={(polish) => updateUserData({ selectedPolish: polish })}
          userData={userData}
          goToStep={goToStep}
        />
      )}
      {currentStep === 'virtualTryOn' && (
        <VirtualTryOnStep 
          userData={userData}
          goToStep={goToStep}
          updateUserData={updateUserData}
        />
      )}
    </>
  );
}