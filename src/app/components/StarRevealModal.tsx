'use client';
import { StarData } from '../cosmos/star-generator';
import { StarField } from '../cosmos/StarField';
import { useState, useEffect } from 'react';

interface Props {
  star: StarData;
  onClose: () => void;
  onClaimStar?: () => Promise<void>;
}

interface ImpactCounter {
  total_stars_claimed: number;
  total_trees_planted: number;
}

export const StarRevealModal = ({ star, onClose }: Props) => {
  const [impactData, setImpactData] = useState<ImpactCounter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        // Fetch impact data from API
        const response = await fetch('/api/impact-counter');
        if (response.ok) {
          const data = await response.json();
          setImpactData(data);
        }
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  const starsUntilNextTree = impactData ? 10 - (impactData.total_stars_claimed % 10) : 0;
  const progressPercentage = impactData ? ((impactData.total_stars_claimed % 10) / 10) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-8 rounded-2xl max-w-md w-full border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-2">A Star Was Born</h2>
        <p className="text-gray-400 mb-6">From your typing rhythm</p>
        
        <StarField star={star} width={350} height={350} />
        
        <div className="mt-6 space-y-2 text-sm text-gray-300 font-mono">
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span>Right Ascension:</span>
            <span className="text-blue-400">{star.ra}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span>Declination:</span>
            <span className="text-blue-400">{star.dec}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span>Spectral Class:</span>
            <span className="text-yellow-400">{star.spectralClass}</span>
          </div>
          <div className="flex justify-between">
            <span>Magnitude:</span>
            <span>{star.magnitude.toFixed(1)}</span>
          </div>
        </div>

        {/* Impact Counter Section */}
        <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-400">🌳</span>
            <h3 className="text-sm font-semibold text-green-300">Real-World Impact</h3>
          </div>
          
          {isLoading ? (
            <div className="text-green-400 text-sm">Calculating impact...</div>
          ) : impactData ? (
            <>
              <div className="text-green-300 text-sm mb-2">
                This constellation has helped plant <span className="font-bold text-green-400">{impactData.total_trees_planted}</span> trees
              </div>
              
              <div className="text-xs text-green-400 mb-2">
                Progress to next tree: {10 - starsUntilNextTree}/10 stars
              </div>
              
              <div className="w-full bg-green-800 rounded-full h-2 mb-2">
                <div 
                  className="h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="text-xs text-green-400 font-medium">
                {starsUntilNextTree === 0 ? (
                  <span className="text-yellow-400">🎉 Next tree will be planted with this star!</span>
                ) : (
                  `${starsUntilNextTree} more stars until next tree`
                )}
              </div>
            </>
          ) : (
            <div className="text-green-400 text-sm">Impact tracking unavailable</div>
          )}
        </div>
        
        <div className="mt-6 space-y-3">
          <button 
            onClick={onClose}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Continue
          </button>
          <button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Claim This Star (£12)
          </button>
        </div>
      </div>
    </div>
  );
};
