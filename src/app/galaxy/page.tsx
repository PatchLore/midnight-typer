'use client';
import { useState, useEffect } from 'react';
import { StarField } from '../cosmos/StarField';
import { CertificateTemplate } from '../../components/CertificateTemplate';
import { 
  getUserStars, 
  getUserGalaxy, 
  getAvailableSlots, 
  updateStarStatus,
  StarRecord 
} from '../../lib/supabase';

interface UserSession {
  id: string;
  wpm: number;
  accuracy: number;
  durationMinutes: number;
  wordCount: number;
  timestamp: number;
}

export default function GalaxyPage() {
  const [stars, setStars] = useState<StarRecord[]>([]);
  const [galaxy, setGalaxy] = useState<any>(null);
  const [slotsInfo, setSlotsInfo] = useState<{ available: number; needed: number }>({ available: 0, needed: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedStar, setSelectedStar] = useState<StarRecord | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userId] = useState('demo-user-id'); // In real app, get from auth

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userStars, userGalaxy, slots] = await Promise.all([
          getUserStars(userId),
          getUserGalaxy(userId),
          getAvailableSlots(userId)
        ]);
        
        setStars(userStars);
        setGalaxy(userGalaxy);
        setSlotsInfo(slots);
      } catch (error) {
        console.error('Error fetching galaxy data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleClaimStar = async (starId: string) => {
    if (slotsInfo.available <= 0) {
      alert(`Type ${slotsInfo.needed} more words to unlock a slot`);
      return;
    }

    try {
      // Call the claim endpoint to create Stripe checkout session
      const response = await fetch('/api/stars/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          starId: starId,
          userId: userId
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // In a real implementation, you would redirect to Stripe checkout
        // For now, we'll simulate the process
        if (result.checkoutUrl) {
          // Simulate successful payment for demo purposes
          // In production, this would redirect to Stripe and handle webhook
          const mockPaymentSuccess = true;
          
          if (mockPaymentSuccess) {
            // Update star status directly for demo
            const updatedStar = await updateStarStatus(starId, 'claimed');
            if (updatedStar) {
              // Update local state
              setStars(prev => prev.map(star => 
                star.id === starId ? { ...star, status: 'claimed' } : star
              ));
              setSlotsInfo(prev => ({ ...prev, available: prev.available - 1 }));
              
              // Show success message
              alert('Star claimed successfully! Certificate will be generated.');
            }
          } else {
            alert('Payment failed. Please try again.');
          }
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to process claim. Please try again.');
      }
    } catch (error) {
      console.error('Error claiming star:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleViewCertificate = (star: StarRecord) => {
    setSelectedStar(star);
    setShowCertificate(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your galaxy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            My Galaxy
          </h1>
          <p className="text-gray-400 mt-2">Your personal collection of celestial achievements</p>
        </div>

        {/* Galaxy Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-blue-400">{stars.length}</div>
            <div className="text-sm text-gray-400">Total Stars</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-green-400">{galaxy?.slots_unlocked || 0}</div>
            <div className="text-sm text-gray-400">Slots Unlocked</div>
            <div className="text-xs text-gray-500 mt-1">
              {galaxy?.total_words_typed || 0} words typed
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-yellow-400">{slotsInfo.available}</div>
            <div className="text-sm text-gray-400">Available Slots</div>
            {slotsInfo.needed > 0 && (
              <div className="text-xs text-red-400 mt-1">
                Need {slotsInfo.needed} more words
              </div>
            )}
          </div>
          <div className="bg-green-900/20 backdrop-blur-sm border border-green-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-green-400">🌳 {galaxy?.total_trees_planted || 0}</div>
            <div className="text-sm text-green-300">Community Impact</div>
            <div className="text-xs text-green-400 mt-1">
              Trees planted globally
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {galaxy && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Word Progress to Next Slot</span>
              <span>{galaxy.total_words_typed % 1000}/1000</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4">
              <div 
                className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(galaxy.total_words_typed % 1000) / 10}%` }}
              />
            </div>
          </div>
        )}

        {/* Stars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stars.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No stars yet. Start typing to create your first star!</div>
            </div>
          ) : (
            stars.map((star) => (
              <div key={star.id} className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {star.star_data.name || 'Unnamed Star'}
                  </h3>
                  <div className="text-sm text-gray-400 mb-2">
                    {star.star_data.spectralClass} Class • {star.star_data.magnitude.toFixed(1)} Magnitude
                  </div>
                </div>

                <div className="mb-4">
                  <StarField star={star.star_data} width={300} height={200} />
                </div>

                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <div><span className="text-gray-500">RA:</span> {star.star_data.ra}</div>
                  <div><span className="text-gray-500">Dec:</span> {star.star_data.dec}</div>
                  <div><span className="text-gray-500">WPM:</span> {star.star_data.sessionSnapshot.wpm}</div>
                  <div><span className="text-gray-500">Accuracy:</span> {star.star_data.sessionSnapshot.accuracy}%</div>
                  <div><span className="text-gray-500">Created:</span> {new Date(star.created_at).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-2">
                  {star.status === 'unclaimed' ? (
                    <button
                      onClick={() => handleClaimStar(star.id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                    >
                      Claim This Star (£12)
                    </button>
                  ) : (
                    <>
                      <span className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-center">
                        ✅ Claimed
                      </span>
                      {star.certificate_url ? (
                        <a
                          href={star.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          Download Certificate
                        </a>
                      ) : (
                        <button
                          onClick={() => handleViewCertificate(star)}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                          View Certificate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Certificate Modal */}
        {showCertificate && selectedStar && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 p-6 rounded-xl max-w-4xl w-full border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Star Certificate</h2>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <CertificateTemplate
                star={selectedStar.star_data}
                treesPlanted={0} // In real app, get from impact counter
                userName="Anonymous Typer"
                date={new Date(selectedStar.created_at).toLocaleDateString()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}