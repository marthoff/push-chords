import ChordGrid from './components/ChordGrid'
import './App.css'
import ControlPanel from './components/ControlPanel'

function App() {

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Ableton Push Chord Grid
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl">
            Generate and visualize musical chords for Ableton Push. This tool is in Alpha, so please verify results.
            Report bugs on the{' '}
            <a 
              className="text-white underline hover:text-gray-300 transition-colors" 
              href="https://github.com/marthoff/push-chords" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>.
          </p>
        </div>
      </header>

      {/* Controls */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <ControlPanel />
        </div>
      </div>

      {/* Grid */}
      <main className="flex-1 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <ChordGrid />
        </div>
      </main>
    </div>
  )
}

export default App
