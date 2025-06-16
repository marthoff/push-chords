import React from 'react';
import { buildGrid, buildScale, SCALES } from '../utils/musicUtils';
import { usePushChordStore } from '../store/pushChordStore';
import classNames from 'classnames';

const ChordGrid: React.FC = () => {

  const scaleRoot = usePushChordStore((state) => state.scaleRoot);
  const scaleType = usePushChordStore((state) => state.scaleType);
  const chromaticMode = usePushChordStore((state) => state.chromaticMode);
  const chord = usePushChordStore((state) => state.chord);

  const scale = buildScale(SCALES[scaleType], scaleRoot || 'C');
  const chromaticScale = buildScale(SCALES['Chromatic'], scaleRoot || 'C');

  const gridData = chromaticMode ?
    buildGrid(chromaticScale, chord, scale).reverse() :
    buildGrid(scale, chord);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-8 gap-2 aspect-square bg-black p-4 rounded-lg border border-gray-800">
        {gridData.map((row, rowIndex) => (
          <React.Fragment key={`${rowIndex}`}>
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={classNames(
                  "aspect-square flex flex-col items-center justify-center rounded-md border-2 text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer",
                  {
                    // Root note (yellow/gold)
                    'bg-yellow-500 text-black border-yellow-400': cell.isRoot && !cell.chordNote && cell.inScale,
                    'bg-yellow-600 text-white border-yellow-500': cell.isRoot && cell.chordNote && cell.inScale,
                    
                    // Chord notes (blues/purples)
                    'bg-blue-600 text-white border-blue-500': !cell.isRoot && cell.chordNote && cell.inScale,
                    'bg-purple-600 text-white border-purple-500': cell.chordNote && !cell.inScale,
                    
                    // Scale notes (white/gray)
                    'bg-white text-black border-gray-300': !cell.isRoot && !cell.chordNote && cell.inScale,
                    
                    // Non-scale notes (dark gray)
                    'bg-gray-800 text-gray-400 border-gray-700': !cell.chordNote && !cell.inScale,
                  }
                )}
                tabIndex={0}
                aria-label={`Note ${cell.note.note} ${cell.note.octave} ${cell.chordNote ? ', interval ' + cell.chordNote.interval : ''}`}
              >
                {cell.note && (
                  <>
                    <div className="font-bold text-sm">{cell.note.note}</div>
                    {cell.chordNote?.interval && (
                      <div className="text-xs opacity-80 mt-0.5">
                        {cell.chordNote.interval}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded border border-yellow-400"></div>
          <span className="text-gray-300">Root Note</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-600 rounded border border-yellow-500"></div>
          <span className="text-gray-300">Root + Chord</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded border border-blue-500"></div>
          <span className="text-gray-300">Chord Note</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded border border-gray-300"></div>
          <span className="text-gray-300">Scale Note</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-800 rounded border border-gray-700"></div>
          <span className="text-gray-300">Other</span>
        </div>
      </div>
    </div>
  );
};

export default ChordGrid;