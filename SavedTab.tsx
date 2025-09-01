import React, { useState } from 'react';
import { Heart, Trash2, Share2, ShoppingBag, Star, Search, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { UserData, SavedLook } from '../App';

interface SavedTabProps {
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
  dateAdded?: string;
}

export function SavedTab({ userData, updateUserData }: SavedTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'colors' | 'looks'>('looks');

  // Mock saved polishes database - in a real app this would come from a backend
  const allPolishes: Record<string, NailPolish> = {
    'trend1': {
      id: 'trend1',
      name: 'Bubble Bath',
      brand: 'OPI',
      color: '#F7E7CE',
      pantone: 'PANTONE 11-0602',
      price: '$10.50',
      rating: 4.9,
      finish: 'Creme',
      description: 'Soft peachy nude that complements any skin tone',
      dateAdded: '2024-01-15'
    },
    'warm1': {
      id: 'warm1',
      name: 'Lincoln Park After Dark',
      brand: 'OPI',
      color: '#3D1A36',
      pantone: 'PANTONE 18-1142',
      price: '$10.50',
      rating: 4.8,
      finish: 'Creme',
      description: 'Deep berry with warm undertones',
      dateAdded: '2024-01-10'
    },
    'cool1': {
      id: 'cool1',
      name: 'Russian Navy',
      brand: 'OPI',
      color: '#1E2A4A',
      pantone: 'PANTONE 19-4052',
      price: '$10.50',
      rating: 4.9,
      finish: 'Creme',
      description: 'Deep navy blue with cool undertones',
      dateAdded: '2024-01-08'
    }
  };

  const savedPolishes = (userData.savedPolishes || [])
    .map(id => allPolishes[id])
    .filter(Boolean)
    .sort((a, b) => new Date(b.dateAdded!).getTime() - new Date(a.dateAdded!).getTime());

  const filteredPolishes = savedPolishes.filter(polish =>
    polish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    polish.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFavorite = (polishId: string) => {
    const updatedSaved = (userData.savedPolishes || []).filter(id => id !== polishId);
    updateUserData({ savedPolishes: updatedSaved });
  };

  const clearAllSaved = () => {
    updateUserData({ savedPolishes: [] });
  };

  const removeSavedLook = (lookId: string) => {
    const updatedLooks = (userData.savedLooks || []).filter(look => look.id !== lookId);
    updateUserData({ savedLooks: updatedLooks });
  };

  const clearAllLooks = () => {
    updateUserData({ savedLooks: [] });
  };

  const savedLooks = userData.savedLooks || [];
  const filteredLooks = savedLooks.filter(look =>
    look.polish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    look.polish.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const PolishCard = ({ polish }: { polish: NailPolish }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-full border-2 border-border flex-shrink-0"
            style={{ backgroundColor: polish.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h4 className="truncate">{polish.name}</h4>
                <p className="text-sm text-muted-foreground">{polish.brand}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(polish.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs ml-1">{polish.rating}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{polish.finish}</Badge>
              <span className="text-sm">{polish.price}</span>
              {polish.dateAdded && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Added {formatDate(polish.dateAdded)}
                </span>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">{polish.description}</p>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <ShoppingBag className="w-3 h-3 mr-1" />
                Buy Now
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LookCard = ({ look }: { look: SavedLook }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-border flex-shrink-0">
            <img 
              src={look.handImage} 
              alt="Saved look"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h4 className="truncate">{look.polish.name}</h4>
                <p className="text-sm text-muted-foreground">{look.polish.brand}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSavedLook(look.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: look.polish.color }}
              />
              <span className="text-xs text-muted-foreground">{look.polish.pantone}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                Saved {formatDate(look.savedAt)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <ShoppingBag className="w-3 h-3 mr-1" />
                Shop
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLooksTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Saved Looks</h2>
            <p className="text-muted-foreground">
              {savedLooks.length} saved {savedLooks.length === 1 ? 'look' : 'looks'}
            </p>
          </div>
          {savedLooks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllLooks}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>

        {savedLooks.length > 0 ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search saved looks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3">
              {filteredLooks.length > 0 ? (
                filteredLooks.map((look) => (
                  <LookCard key={look.id} look={look} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">No looks found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try searching with different terms
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No saved looks yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Save your favorite nail looks from the Virtual Try-On
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                💡 Tip: Save complete looks by:
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Going to Try On tab</p>
                <p>• Completing your virtual try-on</p>
                <p>• Tapping the Save button</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderColorsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Saved Colors</h2>
            <p className="text-muted-foreground">
              {savedPolishes.length} saved {savedPolishes.length === 1 ? 'color' : 'colors'}
            </p>
          </div>
          {savedPolishes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllSaved}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>

        {savedPolishes.length > 0 ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search saved colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3">
              {filteredPolishes.length > 0 ? (
                filteredPolishes.map((polish) => (
                  <PolishCard key={polish.id} polish={polish} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">No colors found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try searching with different terms
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No saved colors yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start saving your favorite nail polish colors by tapping the heart icon when browsing
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                💡 Tip: You can save colors from:
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Browse tab - Discover new colors</p>
                <p>• Try On tab - Colors matched to your skin tone</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1>Saved</h1>
        <p className="text-muted-foreground">Your favorite looks and colors</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab('looks')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
            activeTab === 'looks'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Looks</span>
          {savedLooks.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {savedLooks.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
            activeTab === 'colors'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Colors</span>
          {savedPolishes.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {savedPolishes.length}
            </Badge>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'looks' ? renderLooksTab() : renderColorsTab()}
    </div>
  );
}