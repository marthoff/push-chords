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
    <div className="grid grid-cols-8 grid-rows-8 grow">
      {gridData.map((row, rowIndex) => (
        <React.Fragment key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`m-2 p-2 text-center 
                ${classNames({
                'bg-blue-600': cell.isRoot && !cell.chordNote && cell.inScale,
                'bg-blue-700': cell.isRoot && cell.chordNote && cell.inScale,
                'bg-blue-500': !cell.isRoot && cell.chordNote && cell.inScale,
                'bg-blue-400': cell.chordNote && !cell.inScale,
                'bg-gray-500': !cell.chordNote && !cell.inScale,
                'bg-gray-200': !cell.isRoot && !cell.chordNote && cell.inScale,
              })}`}
              tabIndex={0}
              aria-label={`Note ${cell.note.note} ${cell.note.octave} ${cell.chordNote ? ', interval ' + cell.chordNote.interval : ''}`}
            >
              {cell.note && (
                <>
                  <div className="note-main">{cell.note.note} </div>
                  {cell.chordNote?.interval && (
                    <span className="interval-badge">{cell.chordNote?.interval}</span>
                  )}
                </>
              )}
            </div>
          ))}
        </React.Fragment>
      ))
      }
    </div >
  );
};

export default ChordGrid;