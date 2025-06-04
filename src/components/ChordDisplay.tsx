import React from 'react';
import { buildScale, SCALES } from '../utils/musicUtils';
import { usePushChordStore } from '../store/pushChordStore';

const ChordDisplay: React.FC = ({
}) => {
  const error = usePushChordStore((state) => state.error);
  const scaleType = usePushChordStore((state) => state.scaleType);
  const scaleRoot = usePushChordStore((state) => state.scaleRoot);
  const chord = usePushChordStore((state) => state.chord);

  if (error || !chord) {
    return <div className="chord-display">{error}</div>;
  }

  const scale = buildScale(SCALES[scaleType || 'Major'], scaleRoot || 'C');

  const extensionText = chord.extensions.length > 0
    ? chord.extensions.join(', ')
    : '';

  const isInScale = (note: string) => {
    return scale.notes.includes(note);
  }

  return (
    <div className="chord-display">
      <div className="chord-info flex gap-3">
        <div>
          <span className="chord-badge">{chord.root} {chord.quality}</span>
          {extensionText && <span className="extension-badge">{extensionText}</span>}
        </div>
        <div>
          {chord.notes.map((note, index) => (
            <span
              key={index}
              className={`note ${isInScale(note.note) ? 'in-scale' : 'out-of-scale'}`}
            >
              {note.note}
              <span className="text-sm">{note.interval}</span>
              {index < chord.notes.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChordDisplay;