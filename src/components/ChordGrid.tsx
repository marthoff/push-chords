import React from 'react';
import './ChordGrid.css';
import type { ChordGridProps } from '../types';
import { buildGrid, buildScale, SCALES } from '../utils/musicUtils';

const ChordGrid: React.FC<ChordGridProps> = ({
  chord,
  scaleRoot,
  chromaticMode = false,
  scaleType = 'Major'
}) => {

  const scale = buildScale(SCALES[scaleType], scaleRoot || 'C');
  const chromaticScale = buildScale(SCALES['Chromatic'], scaleRoot || 'C');

  const gridData = chromaticMode ?
    buildGrid(chromaticScale, chord, scale).reverse() :
    buildGrid(scale, chord);

  return (
    <div className="chord-grid">
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-cell 
                ${cell.inScale ? '' : 'out-of-scale'}
                ${cell.chordNote ? 'chord-note' : ''}`}
            >
              {cell.note && (
                <>
                  <div className="note">{cell.note.note} {cell.chordNote?.interval}</div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChordGrid; 