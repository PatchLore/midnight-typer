'use client';
import { useState, useEffect } from 'react';
import { generateStarFromSession, StarData } from '../cosmos/star-generator';
import { StarField } from '../cosmos/StarField';
import { StarRevealModal } from '../components/StarRevealModal';

export default function CosmosTest() {
  const [star, setStar] = useState<StarData | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const simulateSession = (minutes: number, wpm: number, accuracy: number) => {
    const mockSession = {
      id: Math.random().toString(36).substr(2, 9),
      wpm,
      accuracy,
      durationMinutes: minutes,
      wordCount: Math.floor(wpm * minutes),
      timestamp: Date.now()
    };
    
    const newStar = generateStarFromSession(mockSession);
    setStar(newStar);
  };
  
  if (!mounted) return <div className="min-h-screen bg-black" />;
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-4">Cosmos Cartography - Test</h1>
      
      <div className="space-x-4 mb-8">
        <button onClick={() => simulateSession(2, 30, 65)} className="px-4 py-2 bg-red-600 rounded">
          Red Dwarf (2min, 30wpm)
        </button>
        <button onClick={() => simulateSession(6, 60, 90)} className="px-4 py-2 bg-yellow-600 rounded">
          Yellow Sun (6min, 60wpm)
        </button>
        <button onClick={() => simulateSession(18, 85, 98)} className="px-4 py-2 bg-blue-600 rounded">
          Blue Giant (18min, 85wpm)
        </button>
      </div>
      
      {star && <StarRevealModal star={star} onClose={() => setStar(null)} />}
    </div>
  );
}
