import React from 'react';
import './ChordDisplay.css';
import type { ChordDisplayProps } from '../types';

const ChordDisplay: React.FC<ChordDisplayProps> = ({
  parseResult,
}) => {
  if (!parseResult.isValid || !parseResult.chord) {
    return <div className="chord-display error">{parseResult.error}</div>;
  }

  const { chord } = parseResult;
  const extensionText = chord.extensions.length > 0
    ? ` with ${chord.extensions.join(', ')}`
    : '';


  return (
    <div className="chord-display">
      <div className="chord-info">
        {chord.root} {chord.quality}{extensionText}
      </div>
      <div className="notes-info">
        Notes: {chord.notes.map((note, index) => (
          <span
            key={index}
            className={`note`}
          >
            {note.interval}
            {index < chord.notes.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChordDisplay; 