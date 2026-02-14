'use client';
import { StarData } from '../app/cosmos/star-generator';
import { useState } from 'react';

interface CertificateTemplateProps {
  star: StarData;
  treesPlanted: number;
  userName?: string;
  date?: string;
}

export const CertificateTemplate = ({ 
  star, 
  treesPlanted, 
  userName = 'Anonymous Typer', 
  date = new Date().toLocaleDateString() 
}: CertificateTemplateProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Create a canvas for the certificate
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Draw certificate background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add starfield background
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      ctx.globalAlpha = Math.random() * 0.5;
      ctx.fillRect(Math.random() * 800, Math.random() * 600, 1, 1);
    }
    ctx.globalAlpha = 1;

    // Draw border
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 560);

    // Draw title
    ctx.fillStyle = '#f6e05e';
    ctx.font = 'bold 48px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('COSMOS CARTOGRAPHY', 400, 100);

    // Draw subtitle
    ctx.fillStyle = '#a0aec0';
    ctx.font = '24px Georgia';
    ctx.fillText('Certificate of Stellar Achievement', 400, 140);

    // Draw star information
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Georgia';
    ctx.fillText('Star Name: ' + (star.name || 'Unnamed Star'), 400, 220);

    ctx.font = '20px Georgia';
    ctx.fillText(`Right Ascension: ${star.ra}`, 400, 270);
    ctx.fillText(`Declination: ${star.dec}`, 400, 300);
    ctx.fillText(`Spectral Class: ${star.spectralClass}`, 400, 330);
    ctx.fillText(`Magnitude: ${star.magnitude.toFixed(1)}`, 400, 360);

    // Draw user information
    ctx.font = 'bold 28px Georgia';
    ctx.fillText(`Awarded to: ${userName}`, 400, 430);

    ctx.font = '20px Georgia';
    ctx.fillText(`Date: ${date}`, 400, 470);

    // Draw impact information
    ctx.fillStyle = '#48bb78';
    ctx.font = 'bold 24px Georgia';
    ctx.fillText(`🌍 Real-World Impact: ${treesPlanted} trees planted`, 400, 520);

    ctx.font = '16px Georgia';
    ctx.fillStyle = '#a0aec0';
    ctx.fillText('Thank you for contributing to a greener planet through your typing!', 400, 550);
    
    // Add footer about constellation impact
    ctx.font = '14px Georgia';
    ctx.fillStyle = '#76d7c4';
    ctx.fillText(`Part of a constellation that planted ${treesPlanted} trees`, 400, 570);

    // Download as PNG
    const link = document.createElement('a');
    link.download = `star-certificate-${star.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setIsDownloading(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-xl shadow-2xl border border-gray-800">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">Certificate of Stellar Achievement</h2>
        <p className="text-gray-400">Official documentation of your cosmic contribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">Star Details</h3>
          <div className="space-y-1 text-sm text-gray-300">
            <div><span className="text-gray-500">Name:</span> {star.name || 'Unnamed Star'}</div>
            <div><span className="text-gray-500">RA:</span> {star.ra}</div>
            <div><span className="text-gray-500">Dec:</span> {star.dec}</div>
            <div><span className="text-gray-500">Class:</span> {star.spectralClass}</div>
            <div><span className="text-gray-500">Magnitude:</span> {star.magnitude.toFixed(1)}</div>
          </div>
        </div>

        <div className="bg-black/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-400">Impact Summary</h3>
          <div className="space-y-1 text-sm text-gray-300">
            <div><span className="text-gray-500">Awarded to:</span> {userName}</div>
            <div><span className="text-gray-500">Date:</span> {date}</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Trees planted:</span>
              <span className="text-green-400 font-bold">{treesPlanted} 🌳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
        >
          {isDownloading ? 'Generating Certificate...' : 'Download Certificate (PNG)'}
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        This certificate represents your contribution to both the digital cosmos and real-world reforestation efforts.
      </div>
    </div>
  );
};