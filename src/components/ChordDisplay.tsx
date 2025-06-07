import React from 'react';
import { buildScale, SCALES } from '../utils/musicUtils';
import { usePushChordStore } from '../store/pushChordStore';
import classNames from 'classnames';

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
    <div>
      <div>
        <div>
          <span className="font-bold">Chord: </span>{chord.root} {chord.quality}
          {extensionText && <span className="extension-badge">{extensionText}</span>}
        </div>
        <div>
          <span className='font-bold'>Notes: </span>
          {chord.notes.map((note, index) => (
            <span
              key={index}
              className={`${classNames({ '': !isInScale(note.note) })}`}
            >
              {note.note}
              <span className="text-sm">{note.interval.replace(/R/, 'Root')}</span>
              {!isInScale(note.note) && (
                <span className="text-red-500">*</span>
              )}
              {index < chord.notes.length - 1 ? ', ' : ''}
            </span>
          ))}
          {chord.notes.find(note => !isInScale(note.note)) && (
            <div className="text-red-500 text-sm">* Not in scale</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChordDisplay;