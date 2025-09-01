import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  HelpCircle, 
  Star, 
  Share2,
  Moon,
  Sun,
  Camera,
  Edit3,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { UserData } from '../App';

interface ProfileTabProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

export function ProfileTab({ userData }: ProfileTabProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [trendingAlerts, setTrendingAlerts] = useState(false);

  const getSkinToneDescription = () => {
    if (!userData.skinTone) return 'Not analyzed yet';
    
    const { undertone, depth } = userData.skinTone;
    const undertoneDesc = {
      warm: 'warm',
      cool: 'cool', 
      neutral: 'neutral'
    };
    
    return `${depth} skin with ${undertoneDesc[undertone]} undertones`;
  };

  const stats = [
    {
      label: 'Colors Tried',
      value: userData.selectedPolish ? '1' : '0',
      icon: Camera
    },
    {
      label: 'Colors Saved',
      value: userData.savedPolishes?.length || 0,
      icon: Star
    },
    {
      label: 'Skin Analysis',
      value: userData.skinTone ? 'Complete' : 'Pending',
      icon: Palette
    }
  ];

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage your notification preferences',
      action: 'toggle',
      value: notifications,
      onChange: setNotifications
    },
    {
      icon: Star,
      label: 'Trending Alerts',
      description: 'Get notified about trending colors',
      action: 'toggle',
      value: trendingAlerts,
      onChange: setTrendingAlerts
    },
    {
      icon: darkMode ? Sun : Moon,
      label: 'Dark Mode',
      description: 'Switch between light and dark themes',
      action: 'toggle',
      value: darkMode,
      onChange: setDarkMode
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: 'navigate'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      action: 'navigate'
    },
    {
      icon: Share2,
      label: 'Share App',
      description: 'Tell friends about the app',
      action: 'navigate'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-xl">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        </div>
        
        <div>
          <h2>Your Profile</h2>
          <p className="text-muted-foreground">Nail Art Enthusiast</p>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="font-medium">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skin Tone Profile */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4>Skin Tone Profile</h4>
                {userData.skinTone && (
                  <Badge variant="secondary">Analyzed</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {getSkinToneDescription()}
              </p>
              {userData.skinTone?.pantoneColors && (
                <div className="flex gap-2">
                  {userData.skinTone.pantoneColors.slice(0, 4).map((pantone, index) => {
                    // Mock color mapping
                    const colorMap: Record<string, string> = {
                      'PANTONE 12-0825': '#F4D1AE',
                      'PANTONE 14-1064': '#EFAF9E',
                      'PANTONE 16-1546': '#E8956C',
                      'PANTONE 18-1142': '#B85450',
                      'PANTONE 19-3832': '#6B4E71',
                      'PANTONE 17-3938': '#8B7A9A',
                      'PANTONE 18-3224': '#9B8AA3',
                      'PANTONE 19-4052': '#4A5D6B',
                      'PANTONE 19-1557': '#A04B47',
                      'PANTONE 18-1763': '#C67B5C',
                      'PANTONE 19-1664': '#8B5A3C'
                    };
                    
                    return (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: colorMap[pantone] || '#9CA3AF' }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Menu */}
      <div className="space-y-1">
        <h3 className="text-sm text-muted-foreground mb-3 px-1">Settings</h3>
        
        {menuItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                
                {item.action === 'toggle' && item.onChange ? (
                  <Switch
                    checked={item.value as boolean}
                    onCheckedChange={item.onChange}
                  />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* App Info */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Nail Polish Try-On App
        </p>
        <p className="text-xs text-muted-foreground">
          Version 1.0.0 • Made with ❤️
        </p>
      </div>
    </div>
  );
}