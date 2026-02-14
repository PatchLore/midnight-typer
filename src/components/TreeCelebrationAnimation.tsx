'use client';
import { useEffect, useState } from 'react';

interface TreeCelebrationAnimationProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const TreeCelebrationAnimation = ({ isVisible, onDismiss }: TreeCelebrationAnimationProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setTimeout(onDismiss, 1000); // Wait for animation to finish
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Golden burst background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-green-400/20 animate-pulse">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Center celebration message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-black/80 backdrop-blur-sm border border-green-500 rounded-2xl p-8 shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-green-400 mb-2">
            You Unlocked a Tree!
          </h2>
          <p className="text-green-300 mb-4">
            Your 10th star claim has planted a real tree 🌳
          </p>
          <div className="text-sm text-gray-400">
            Thank you for contributing to reforestation!
          </div>
          
          {/* Floating tree icons */}
          <div className="mt-6 flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="text-4xl animate-float"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '3s'
                }}
              >
                🌳
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => {
          setShowAnimation(false);
          setTimeout(onDismiss, 500);
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

/* Add CSS animations */
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes confetti {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  
  .animate-float {
    animation: float 2s ease-in-out infinite;
  }
  
  .animate-confetti {
    animation: confetti 3s linear forwards;
  }
`;
document.head.appendChild(style);