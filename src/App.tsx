import { useState } from 'react'
import ChordGrid from './components/ChordGrid'
import ChordInput from './components/ChordInput'
import ChordDisplay from './components/ChordDisplay'
import { parseChord } from './utils/chordUtils'
import './App.css'
import type { ScaleType } from './types'

function App() {
  const [currentChord, setCurrentChord] = useState('Cmaj7')
  const [scaleRoot, setScaleRoot] = useState('C')
  const [scaleType, setScaleType] = useState<ScaleType>('Major')
  const [chromaticMode, setChromaticMode] = useState(false)

  const parseResult = parseChord(currentChord)

  return (
    <div className="app">
      <h1>Push Chord Grid</h1>
      <p className="app-description">
        This app generates chords for Ableton Push. It is still in Alpha, so please check if the results are correct.
        Feel free to report bugs on the <a href='https://github.com/marthoff/push-chords' target='_blank' rel='noopener noreferrer'>
          GitHub Repository
        </a>.
      </p>
      <div className="controls">
        <ChordInput
          currentChord={currentChord}
          onChordChange={setCurrentChord}
        />
        <div className="scale-controls">
          <>
            <select
              value={scaleRoot}
              onChange={(e) => setScaleRoot(e.target.value)}
              className="root-select"
            >
              {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
            <select
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value as ScaleType)}
              className="scale-type-select"
            >
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
              <option value="Chromatic">Chromatic</option>
            </select>
            <label className="chromatic-mode">
              <input
                type="checkbox"
                checked={chromaticMode}
                onChange={(e) => setChromaticMode(e.target.checked)}
              />
              Chromatic Mode
            </label>
          </>
        </div>
      </div>
      <ChordDisplay
        parseResult={parseResult}
        scaleRoot={scaleRoot}
        scaleType={scaleType}
      />
      <ChordGrid
        chord={currentChord}
        scaleRoot={scaleRoot}
        scaleType={scaleType}
        chromaticMode={chromaticMode}
      />
    </div>
  )
}

export default App
