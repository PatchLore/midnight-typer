export default function Home() {
  return (
    <div className="min-h-screen bg-midnight-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-mono mb-4">Midnight Typer</h1>
      <p className="text-midnight-300 text-xl mb-8 text-center max-w-md">
        Turn your thoughts into art. Type anywhere, create constellations of words.
      </p>
      <a 
        href="/play" 
        className="bg-midnight-600 hover:bg-midnight-700 px-8 py-4 rounded-lg font-mono text-lg transition-colors"
      >
        Start Creating →
      </a>
      <p className="text-midnight-400 mt-8 text-sm">Press Ctrl+E to export your art</p>
    </div>
  )
}