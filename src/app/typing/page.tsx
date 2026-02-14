'use client';
import { useState, useEffect, useRef } from 'react';
import { generateStarFromSession, StarData } from '../cosmos/star-generator';
import { StarRevealModal } from '../components/StarRevealModal';
import { StarField } from '../cosmos/StarField';
import { saveStar, updateUserGalaxy } from '../../lib/supabase';

interface TypingSession {
  id: string;
  wpm: number;
  accuracy: number;
  durationMinutes: number;
  wordCount: number;
  timestamp: number;
}

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once, making it perfect for testing typing speed and accuracy. As you type, your progress will be tracked and analyzed to provide detailed metrics about your performance. Focus on maintaining both speed and accuracy for the best results.";

export default function TypingPage() {
  const [text] = useState(SAMPLE_TEXT);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [generatedStar, setGeneratedStar] = useState<StarData | null>(null);
  const [targetWordCount] = useState(10);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current metrics
  const calculateMetrics = () => {
    const duration = (endTime || Date.now()) - (startTime || Date.now());
    const durationMinutes = duration / 60000;
    const wordsTyped = input.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wpm = Math.round((wordsTyped / durationMinutes) || 0);
    
    // Calculate accuracy
    const inputWords = input.split(/\s+/);
    const textWords = text.split(/\s+/);
    let correctChars = 0;
    let totalChars = 0;
    
    for (let i = 0; i < Math.min(inputWords.length, textWords.length); i++) {
      const inputWord = inputWords[i];
      const textWord = textWords[i];
      totalChars += textWord.length;
      
      for (let j = 0; j < Math.min(inputWord.length, textWord.length); j++) {
        if (inputWord[j] === textWord[j]) {
          correctChars++;
        }
      }
    }
    
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    
    return {
      wpm,
      accuracy,
      durationMinutes,
      wordCount: wordsTyped,
      timestamp: Date.now()
    };
  };

  const startSession = () => {
    setIsActive(true);
    setIsFinished(false);
    setInput('');
    setStartTime(Date.now());
    setEndTime(null);
    setCurrentWordIndex(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const endSession = () => {
    setIsActive(false);
    setIsFinished(true);
    setEndTime(Date.now());
    
    // Generate star from session
    const sessionMetrics = calculateMetrics();
    const session: TypingSession = {
      id: Math.random().toString(36).substr(2, 9),
      ...sessionMetrics
    };
    
    const star = generateStarFromSession(session);
    setGeneratedStar(star);
    setShowStarModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Check if target word count reached
    const wordsTyped = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordsTyped >= targetWordCount && !isFinished) {
      endSession();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isActive && !isFinished) {
      endSession();
    }
  };

  // Start timer when session begins
  useEffect(() => {
    if (isActive && !isFinished) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isActive, isFinished]);

  // Calculate current word index for highlighting
  useEffect(() => {
    const words = input.trim().split(/\s+/);
    setCurrentWordIndex(words.length);
  }, [input]);

  const metrics = calculateMetrics();
  const progress = Math.min((currentWordIndex / targetWordCount) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Background Starfield */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <StarField star={generatedStar || { 
          id: 'bg-star',
          name: null,
          ra: '12h 00m 00s',
          dec: '+00° 00\' 00"',
          magnitude: 6,
          spectralClass: 'G',
          color: '#ffffff',
          constellationPoints: [],
          radius: 5,
          sessionSnapshot: { id: '', wpm: 0, accuracy: 0, durationMinutes: 0, wordCount: 0, timestamp: 0 }
        }} width={window.innerWidth} height={window.innerHeight} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Midnight Typer
          </h1>
          <p className="text-gray-400 mt-2">Type to create stars in your personal cosmos</p>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{metrics.wpm}</div>
            <div className="text-sm text-gray-400">WPM</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{metrics.accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{metrics.durationMinutes.toFixed(1)}</div>
            <div className="text-sm text-gray-400">Minutes</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{metrics.wordCount}</div>
            <div className="text-sm text-gray-400">Words</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Target: {targetWordCount} words</span>
            <span>{currentWordIndex}/{targetWordCount}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div 
              className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Typing Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
            <div className="text-gray-500 text-lg leading-relaxed font-mono mb-4">
              {text.split(' ').map((word, index) => (
                <span 
                  key={index}
                  className={`${
                    index < currentWordIndex 
                      ? 'text-green-400' 
                      : index === currentWordIndex 
                        ? 'text-yellow-400 underline' 
                        : 'text-gray-500'
                  }`}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isFinished}
              placeholder={isActive ? "Start typing..." : "Press Start to begin"}
              className="w-full bg-transparent text-white text-lg font-mono outline-none placeholder-gray-600"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center mt-6">
            {!isActive ? (
              <button
                onClick={startSession}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                Start Typing
              </button>
            ) : (
              <button
                onClick={endSession}
                className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
              >
                Stop Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Star Reveal Modal */}
      {showStarModal && generatedStar && (
        <StarRevealModal 
          star={generatedStar} 
          onClose={() => {
            setShowStarModal(false);
            setGeneratedStar(null);
            setInput('');
            setIsFinished(false);
          }}
          onClaimStar={async () => {
            try {
              // Call the tree planting API when star is claimed
              const response = await fetch('/api/plant-tree', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userEmail: 'user@example.com', // In real app, get from auth
                  userName: 'Anonymous Typer', // In real app, get from user profile
                  starName: generatedStar.name || 'Unnamed Star',
                  constellation: generatedStar.spectralClass
                })
              });

              if (response.ok) {
                const result = await response.json();
                console.log('Star claimed successfully:', result);
              } else {
                console.error('Failed to claim star');
              }
            } catch (error) {
              console.error('Error claiming star:', error);
            }
          }}
        />
      )}
    </div>
  );
}