import React, { useState, useEffect } from 'react';
import { Heart, Star, TrendingUp, Palette, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserData } from '../App';

interface BrowseTabProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

interface NailPolish {
  id: string;
  name: string;
  brand: string;
  color: string;
  pantone: string;
  price: string;
  rating: number;
  finish: string;
  description: string;
  trending?: boolean;
  forSkinTone?: 'warm' | 'cool' | 'neutral' | 'all';
}

export function BrowseTab({ userData, updateUserData }: BrowseTabProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Sync favorites state with userData.savedPolishes
  useEffect(() => {
    setFavorites(new Set(userData.savedPolishes || []));
  }, [userData.savedPolishes]);

  // Mock nail polish database
  const allPolishes: NailPolish[] = [
    // Trending colors
    {
      id: 'trend1',
      name: 'Bubble Bath',
      brand: 'OPI',
      color: '#F7E7CE',
      pantone: 'PANTONE 11-0602',
      price: '$10.50',
      rating: 4.9,
      finish: 'Creme',
      description: 'Soft peachy nude that complements any skin tone',
      trending: true,
      forSkinTone: 'all'
    },
    {
      id: 'trend2',
      name: 'Very Berry',
      brand: 'Essie',
      color: '#8B2635',
      pantone: 'PANTONE 19-1557',
      price: '$9.00',
      rating: 4.8,
      finish: 'Creme',
      description: 'Deep berry red perfect for fall',
      trending: true,
      forSkinTone: 'all'
    },
    {
      id: 'trend3',
      name: 'Mint Candy Apple',
      brand: 'Essie',
      color: '#7FB069',
      pantone: 'PANTONE 16-6339',
      price: '$9.00',
      rating: 4.7,
      finish: 'Creme',
      description: 'Fresh mint green for spring vibes',
      trending: true,
      forSkinTone: 'cool'
    },
    // Warm undertone colors
    {
      id: 'warm1',
      name: 'Lincoln Park After Dark',
      brand: 'OPI',
      color: '#3D1A36',
      pantone: 'PANTONE 18-1142',
      price: '$10.50',
      rating: 4.8,
      finish: 'Creme',
      description: 'Deep berry with warm undertones',
      forSkinTone: 'warm'
    },
    {
      id: 'warm2',
      name: 'A-Taupe the Space Needle',
      brand: 'OPI',
      color: '#9B7E6B',
      pantone: 'PANTONE 16-1546',
      price: '$10.50',
      rating: 4.7,
      finish: 'Creme',
      description: 'Warm taupe with golden undertones',
      forSkinTone: 'warm'
    },
    {
      id: 'warm3',
      name: 'Eternal Optimist',
      brand: 'Essie',
      color: '#F4D1AE',
      pantone: 'PANTONE 12-0825',
      price: '$9.00',
      rating: 4.5,
      finish: 'Creme',
      description: 'Warm peachy nude',
      forSkinTone: 'warm'
    },
    // Cool undertone colors
    {
      id: 'cool1',
      name: 'Russian Navy',
      brand: 'OPI',
      color: '#1E2A4A',
      pantone: 'PANTONE 19-4052',
      price: '$10.50',
      rating: 4.9,
      finish: 'Creme',
      description: 'Deep navy blue with cool undertones',
      forSkinTone: 'cool'
    },
    {
      id: 'cool2',
      name: 'Purple Palazzo Pants',
      brand: 'OPI',
      color: '#6B4E71',
      pantone: 'PANTONE 17-3938',
      price: '$10.50',
      rating: 4.6,
      finish: 'Creme',
      description: 'Royal purple with cool undertones',
      forSkinTone: 'cool'
    },
    {
      id: 'cool3',
      name: 'Lilacism',
      brand: 'Essie',
      color: '#9B8AA3',
      pantone: 'PANTONE 18-3224',
      price: '$9.00',
      rating: 4.4,
      finish: 'Creme',
      description: 'Soft lilac perfect for cool skin',
      forSkinTone: 'cool'
    },
    // Neutral undertone colors
    {
      id: 'neutral1',
      name: 'Malaga Wine',
      brand: 'OPI',
      color: '#8B5A3C',
      pantone: 'PANTONE 19-1664',
      price: '$10.50',
      rating: 4.8,
      finish: 'Creme',
      description: 'Deep wine brown for neutral skin',
      forSkinTone: 'neutral'
    },
    {
      id: 'neutral2',
      name: 'Mink Muffs',
      brand: 'Essie',
      color: '#8B7A9A',
      pantone: 'PANTONE 17-3938',
      price: '$9.00',
      rating: 4.6,
      finish: 'Creme',
      description: 'Neutral mauve',
      forSkinTone: 'neutral'
    }
  ];

  const toggleFavorite = (polishId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(polishId)) {
        newFavorites.delete(polishId);
      } else {
        newFavorites.add(polishId);
      }
      updateUserData({ savedPolishes: Array.from(newFavorites) });
      return newFavorites;
    });
  };

  const getFilteredPolishes = (filter: string) => {
    switch (filter) {
      case 'trending':
        return allPolishes.filter(p => p.trending);
      case 'matches':
        if (!userData.skinTone) return [];
        return allPolishes.filter(p => 
          p.forSkinTone === userData.skinTone?.undertone || p.forSkinTone === 'all'
        );
      case 'all':
      default:
        return allPolishes;
    }
  };

  const handleTryOn = (polish: NailPolish) => {
    updateUserData({
      selectedPolish: {
        id: polish.id,
        name: polish.name,
        brand: polish.brand,
        color: polish.color,
        pantone: polish.pantone
      }
    });
  };

  const PolishCard = ({ polish }: { polish: NailPolish }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-2">
            {/* Main color swatch */}
            <div
              className="w-12 h-12 rounded-full border-2 border-border flex-shrink-0 shadow-sm relative overflow-hidden"
              style={{ backgroundColor: polish.color }}
            >
              {/* Add subtle glossy effect to swatch */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)'
                }}
              />
            </div>
            
            {/* Mini nail preview */}
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-3 rounded-t-full border border-gray-300 relative"
                  style={{ 
                    backgroundColor: polish.color,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 1px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Mini highlight effect */}
                  <div 
                    className="absolute inset-0 rounded-t-full"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 60%)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h4 className="truncate">{polish.name}</h4>
                <p className="text-sm text-muted-foreground">{polish.brand}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(polish.id);
                }}
                className="text-muted-foreground hover:text-red-500"
              >
                <Heart className={`w-4 h-4 ${favorites.has(polish.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs ml-1">{polish.rating}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{polish.finish}</Badge>
              {polish.trending && (
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{polish.price}</span>
              <Badge variant="outline" className="text-xs">{polish.pantone}</Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{polish.description}</p>
            
            {userData.handImage && (
              <Button 
                onClick={() => handleTryOn(polish)}
                size="sm"
                className="w-full"
              >
                <Palette className="w-3 h-3 mr-1" />
                Try On Virtual
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1>Browse Colors</h1>
        <p className="text-muted-foreground">
          Discover new shades and trending colors
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Colors</TabsTrigger>
          <TabsTrigger value="trending" className="relative">
            Trending
            <TrendingUp className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="matches" className="relative">
            {userData.skinTone ? 'Your Matches' : 'Matches'}
            <Palette className="w-3 h-3 ml-1" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {allPolishes.length} colors available
            </p>
            <Button variant="outline" size="sm">
              <Filter className="w-3 h-3 mr-1" />
              Filter
            </Button>
          </div>
          {getFilteredPolishes('all').map((polish) => (
            <PolishCard key={polish.id} polish={polish} />
          ))}
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-3 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <p className="text-sm text-muted-foreground">
              Colors trending this season
            </p>
          </div>
          {getFilteredPolishes('trending').map((polish) => (
            <PolishCard key={polish.id} polish={polish} />
          ))}
        </TabsContent>
        
        <TabsContent value="matches" className="space-y-3 mt-4">
          {userData.skinTone ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-accent" />
                <p className="text-sm text-muted-foreground">
                  Perfect for your {userData.skinTone.undertone} undertones
                </p>
              </div>
              {getFilteredPolishes('matches').map((polish) => (
                <PolishCard key={polish.id} polish={polish} />
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Get Your Color Matches</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Take a photo in the Try On tab to see colors that complement your skin tone
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}