'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarField } from '../../cosmos/StarField';
import { CertificateTemplate } from '../../../components/CertificateTemplate';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [starData, setStarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const starId = searchParams.get('star_id');
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'true' && starId) {
      // Fetch the claimed star data
      fetch(`/api/stars/${starId}`)
        .then(res => res.json())
        .then(data => {
          setStarData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching star data:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [starId, success]);

  const handleContinue = () => {
    router.push('/galaxy');
  };

  const handleViewCertificate = () => {
    // In a real implementation, this would generate/download the certificate
    alert('Certificate generation coming in Phase 5!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Processing your star claim...</p>
        </div>
      </div>
    );
  }

  if (success !== 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Canceled</h1>
          <p className="text-gray-400 mb-8">
            Your star claim was canceled. You can try again from your galaxy.
          </p>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Return to Galaxy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Star Successfully Claimed!
          </h1>
          <p className="text-gray-400 mt-2">Your celestial body has been registered in the cosmos</p>
        </div>

        {starData && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Star Visualization */}
              <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Your Star</h2>
                <div className="mb-4">
                  <StarField star={starData.star_data} width={400} height={300} />
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><span className="text-gray-500">Name:</span> {starData.star_data.name || 'Unnamed Star'}</div>
                  <div><span className="text-gray-500">Class:</span> {starData.star_data.spectralClass}</div>
                  <div><span className="text-gray-500">Magnitude:</span> {starData.star_data.magnitude.toFixed(1)}</div>
                  <div><span className="text-gray-500">RA:</span> {starData.star_data.ra}</div>
                  <div><span className="text-gray-500">Dec:</span> {starData.star_data.dec}</div>
                </div>
              </div>

              {/* Certificate Preview */}
              <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Certificate Preview</h2>
                <div className="text-sm text-gray-400 mb-4">
                  Your official certificate will be generated and available in your galaxy.
                </div>
                <CertificateTemplate
                  star={starData.star_data}
                  treesPlanted={0}
                  userName="Anonymous Typer"
                  date={new Date().toLocaleDateString()}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 text-center space-x-4">
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
              >
                Return to Galaxy
              </button>
              <button
                onClick={handleViewCertificate}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                View Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}