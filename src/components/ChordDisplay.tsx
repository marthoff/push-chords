import React from 'react';
import './ChordDisplay.css';
import type { ChordDisplayProps } from '../types';
import { buildScale, SCALES } from '../utils/musicUtils';

const ChordDisplay: React.FC<ChordDisplayProps> = ({
  scaleRoot,
  scaleType,
  parseResult,
}) => {
  if (!parseResult.isValid || !parseResult.chord) {
    return <div className="chord-display error">{parseResult.error}</div>;
  }

  const scale = buildScale(SCALES[scaleType || 'Major'], scaleRoot || 'C');

  const { chord } = parseResult;
  const extensionText = chord.extensions.length > 0
    ? chord.extensions.join(', ')
    : '';

  const isInScale = (note: string) => {
    return scale.notes.includes(note);
  }

  return (
    <div className="chord-display">
      <div className="chord-info">
        <span className="chord-badge">{chord.root} {chord.quality}</span>
        {extensionText && <span className="extension-badge">{extensionText}</span>}
      </div>
      <div className="notes-info">
        {chord.notes.map((note, index) => (
          <span
            key={index}
            className={`note ${isInScale(note.note) ? 'in-scale' : 'out-of-scale'}`}
          >
            {note.note}
            <span className="interval-inline">{note.interval}</span>
            {index < chord.notes.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChordDisplay;