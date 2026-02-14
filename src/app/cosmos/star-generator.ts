export interface TypingSession {
  id: string;
  wpm: number;
  accuracy: number;
  durationMinutes: number;
  wordCount: number;
  timestamp: number;
}

export interface StarData {
  id: string;
  name: string | null;
  ra: string;
  dec: string;
  magnitude: number;
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  color: string;
  constellationPoints: {x: number, y: number}[];
  radius: number;
  sessionSnapshot: TypingSession;
}

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const generateCoordinates = (seed: number): {ra: string, dec: string} => {
  const raHours = seed % 24;
  const raMinutes = (seed >> 2) % 60;
  const raSeconds = (seed >> 4) % 60;
  const decDeg = (seed % 180) - 90;
  const decMinutes = (seed >> 3) % 60;
  const decSeconds = (seed >> 6) % 60;
  
  return {
    ra: `${raHours}h ${raMinutes}m ${raSeconds}s`,
    dec: `${decDeg > 0 ? '+' : ''}${decDeg}° ${decMinutes}' ${decSeconds}"`
  };
};

const getSpectralClass = (minutes: number): StarData['spectralClass'] => {
  if (minutes > 20) return 'O';
  if (minutes > 15) return 'B';
  if (minutes > 10) return 'A';
  if (minutes > 7) return 'F';
  if (minutes > 5) return 'G';
  if (minutes > 3) return 'K';
  return 'M';
};

const getStarColor = (spectral: StarData['spectralClass']): string => {
  const colors = {
    'O': '#9bb0ff', 'B': '#aabfff', 'A': '#cad7ff',
    'F': '#f8f7ff', 'G': '#fff4ea', 'K': '#ffd2a1', 'M': '#ffcc6f'
  };
  return colors[spectral];
};

const generateConstellation = (accuracy: number, seed: number): {x: number, y: number}[] => {
  const points = accuracy > 95 ? 7 : accuracy > 85 ? 5 : accuracy > 70 ? 4 : 3;
  const coords = [];
  for (let i = 0; i < points; i++) {
    const angle = (seed / (i + 1)) % (Math.PI * 2);
    const distance = 20 + ((seed >> i) % 30);
    coords.push({
      x: 50 + Math.cos(angle) * distance,
      y: 50 + Math.sin(angle) * distance
    });
  }
  return coords;
};

export const generateStarFromSession = (session: TypingSession): StarData => {
  const seed = hashString(session.id + session.timestamp.toString());
  const coords = generateCoordinates(seed);
  const spectral = getSpectralClass(session.durationMinutes);
  
  return {
    id: `star-${session.id}`,
    name: null,
    ra: coords.ra,
    dec: coords.dec,
    magnitude: Math.min(Math.max(session.wpm / 10, 1), 10),
    spectralClass: spectral,
    color: getStarColor(spectral),
    constellationPoints: generateConstellation(session.accuracy, seed),
    radius: Math.log(session.wordCount + 1) * 3,
    sessionSnapshot: session
  };
};