import React, { useState } from 'react';
import { Camera, Search, Heart, User } from 'lucide-react';
import { TryOnTab } from './components/TryOnTab';
import { BrowseTab } from './components/BrowseTab';
import { SavedTab } from './components/SavedTab';
import { ProfileTab } from './components/ProfileTab';

export type TabType = 'tryOn' | 'browse' | 'saved' | 'profile';

export type TryOnStep = 'camera' | 'analysis' | 'recommendations' | 'virtualTryOn';

export interface SavedLook {
  id: string;
  handImage: string;
  polish: {
    id: string;
    name: string;
    brand: string;
    color: string;
    pantone: string;
  };
  savedAt: string;
}

export interface UserData {
  handImage?: string;
  skinTone?: {
    undertone: 'warm' | 'cool' | 'neutral';
    depth: 'light' | 'medium' | 'dark';
    pantoneColors: string[];
  };
  selectedPolish?: {
    id: string;
    name: string;
    brand: string;
    color: string;
    pantone: string;
  };
  savedPolishes?: string[];
  savedLooks?: SavedLook[];
  nailPreferences?: {
    length: 'short' | 'medium' | 'long';
    shape: 'round' | 'square' | 'oval';
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tryOn');
  const [userData, setUserData] = useState<UserData>({
    savedPolishes: [],
    savedLooks: [],
    nailPreferences: {
      length: 'medium',
      shape: 'round'
    }
  });

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const tabs = [
    {
      id: 'tryOn' as TabType,
      label: 'Try On',
      icon: Camera,
    },
    {
      id: 'browse' as TabType,
      label: 'Browse',
      icon: Search,
    },
    {
      id: 'saved' as TabType,
      label: 'Saved',
      icon: Heart,
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="pb-20">
          {activeTab === 'tryOn' && (
            <TryOnTab 
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
          {activeTab === 'browse' && (
            <BrowseTab 
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
          {activeTab === 'saved' && (
            <SavedTab 
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab 
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-2 transition-colors ${
                    isActive 
                      ? 'text-accent' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? 'fill-current' : ''}`} />
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}