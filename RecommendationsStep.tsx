import React, { useState } from 'react';
import { Heart, Star, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { UserData, TryOnStep } from '../App';

interface RecommendationsStepProps {
  onNext: () => void;
  onPolishSelect: (polish: UserData['selectedPolish']) => void;
  userData: UserData;
  goToStep: (step: TryOnStep) => void;
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
}

export function RecommendationsStep({ onNext, onPolishSelect, userData, goToStep }: RecommendationsStepProps) {
  const [selectedPolish, setSelectedPolish] = useState<NailPolish | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Mock nail polish database based on skin tone
  const getNailPolishRecommendations = (): NailPolish[] => {
    if (!userData.skinTone) return [];

    const { undertone, depth } = userData.skinTone;

    // Warm undertone recommendations
    if (undertone === 'warm') {
      return [
        {
          id: '1',
          name: 'Lincoln Park After Dark',
          brand: 'OPI',
          color: '#3D1A36',
          pantone: 'PANTONE 18-1142',
          price: '$10.50',
          rating: 4.8,
          finish: 'Creme',
          description: 'A deep berry with warm undertones'
        },
        {
          id: '2',
          name: 'Bordeaux',
          brand: 'Essie',
          color: '#7D2638',
          pantone: 'PANTONE 19-1557',
          price: '$9.00',
          rating: 4.6,
          finish: 'Creme',
          description: 'Rich wine red perfect for warm skin'
        },
        {
          id: '3',
          name: 'A-Taupe the Space Needle',
          brand: 'OPI',
          color: '#9B7E6B',
          pantone: 'PANTONE 16-1546',
          price: '$10.50',
          rating: 4.7,
          finish: 'Creme',
          description: 'Warm taupe with golden undertones'
        },
        {
          id: '4',
          name: 'Eternal Optimist',
          brand: 'Essie',
          color: '#F4D1AE',
          pantone: 'PANTONE 12-0825',
          price: '$9.00',
          rating: 4.5,
          finish: 'Creme',
          description: 'Warm peachy nude'
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
          price: '$10.50',
          rating: 4.9,
          finish: 'Creme',
          description: 'Deep navy blue with cool undertones'
        },
        {
          id: '6',
          name: 'Wicked',
          brand: 'Essie',
          color: '#2D2D2D',
          pantone: 'PANTONE 19-3832',
          price: '$9.00',
          rating: 4.7,
          finish: 'Creme',
          description: 'Classic black with blue undertones'
        },
        {
          id: '7',
          name: 'Purple Palazzo Pants',
          brand: 'OPI',
          color: '#6B4E71',
          pantone: 'PANTONE 17-3938',
          price: '$10.50',
          rating: 4.6,
          finish: 'Creme',
          description: 'Royal purple with cool undertones'
        },
        {
          id: '8',
          name: 'Lilacism',
          brand: 'Essie',
          color: '#9B8AA3',
          pantone: 'PANTONE 18-3224',
          price: '$9.00',
          rating: 4.4,
          finish: 'Creme',
          description: 'Soft lilac perfect for cool skin'
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
        price: '$10.50',
        rating: 4.8,
        finish: 'Creme',
        description: 'Deep wine brown for neutral skin'
      },
      {
        id: '10',
        name: 'Chocolate Drop',
        brand: 'Essie',
        color: '#6B4A3A',
        pantone: 'PANTONE 18-1763',
        price: '$9.00',
        rating: 4.5,
        finish: 'Creme',
        description: 'Rich chocolate brown'
      },
      {
        id: '11',
        name: 'Suzi Loves Cowboys',
        brand: 'OPI',
        color: '#A04B47',
        pantone: 'PANTONE 19-1557',
        price: '$10.50',
        rating: 4.7,
        finish: 'Creme',
        description: 'Earthy red-brown'
      },
      {
        id: '12',
        name: 'Mink Muffs',
        brand: 'Essie',
        color: '#8B7A9A',
        pantone: 'PANTONE 17-3938',
        price: '$9.00',
        rating: 4.6,
        finish: 'Creme',
        description: 'Neutral mauve'
      }
    ];
  };

  const recommendations = getNailPolishRecommendations();

  const toggleFavorite = (polishId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(polishId)) {
        newFavorites.delete(polishId);
      } else {
        newFavorites.add(polishId);
      }
      return newFavorites;
    });
  };

  const handlePolishSelect = (polish: NailPolish) => {
    const selectedData = {
      id: polish.id,
      name: polish.name,
      brand: polish.brand,
      color: polish.color,
      pantone: polish.pantone
    };
    setSelectedPolish(polish);
    onPolishSelect(selectedData);
    onNext();
  };

  const PolishCard = ({ polish }: { polish: NailPolish }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-2">
            {/* Main color swatch */}
            <div
              className="w-12 h-12 rounded-full border-2 border-border flex-shrink-0 shadow-sm"
              style={{ backgroundColor: polish.color }}
            />
            
            {/* Mini nail preview */}
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-3 rounded-t-full border border-gray-300"
                  style={{ 
                    backgroundColor: polish.color,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 1px rgba(0,0,0,0.2)'
                  }}
                />
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
              <Badge variant="outline" className="text-xs">{polish.pantone}</Badge>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{polish.price}</span>
              <span className="text-xs text-muted-foreground">
                Perfect for {userData.skinTone?.undertone} undertones
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{polish.description}</p>
            
            <Button 
              onClick={() => handlePolishSelect(polish)}
              className="w-full"
              size="sm"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Try On Virtual
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goToStep('analysis')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1>Perfect Matches</h1>
          <p className="text-sm text-muted-foreground">
            Colors that complement your {userData.skinTone?.undertone} undertones
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((polish) => (
          <PolishCard key={polish.id} polish={polish} />
        ))}
      </div>
    </div>
  );
}