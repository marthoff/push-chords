import ChordGrid from './components/ChordGrid'
import './App.css'
import ChordInput from './components/ChordInput'
import { ScaleInput } from './components/ScaleInput'

function App() {

  return (
    <div className="flex flex-col min-h-screen  bg-gray-800">
      <div className='flex flex-none'>

        <div className='p-2  text-gray-200'>
          <h1 className='text-base md:text-2xl font-bold'>Ableton Push Chord Grid</h1>
          <p className="app-description hidden sm:block">
            This generates chords for Ableton Push. It is still in Alpha, so please check if the results are correct.
            Feel free to report bugs on the <a className='text-blue-400' href='https://github.com/marthoff/push-chords' target='_blank' rel='noopener noreferrer'>
              GitHub Repository
            </a>.
          </p>
        </div>

        <div className='flex flex-col'>
          <ChordInput />
          <ScaleInput />
        </div>
      </div>

      <div className='grow flex'>
        <ChordGrid />
      </div>
    </div>
  )
}

export default App
