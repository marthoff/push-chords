import React, { useState } from 'react';
import { usePushChordStore } from '../store/pushChordStore';
import { stringifyChord } from '../utils/chordUtils';
import { XMarkIcon, TrashIcon } from '@heroicons/react/16/solid';
import classNames from 'classnames';

export const ChordProgressionBar: React.FC = () => {
  const chordProgression = usePushChordStore((state) => state.chordProgression);
  const selectedChordIndex = usePushChordStore((state) => state.selectedChordIndex);
  const selectChordInProgression = usePushChordStore((state) => state.selectChordInProgression);
  const removeChordFromProgression = usePushChordStore((state) => state.removeChordFromProgression);
  const reorderProgression = usePushChordStore((state) => state.reorderProgression);
  const clearProgression = usePushChordStore((state) => state.clearProgression);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderProgression(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (chordProgression.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Chord Progression</h3>
          <p className="text-gray-400 text-sm">
            Add chords to create a progression. Use the + button or press Enter in the chord input.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Chord Progression</h3>
        <button
          onClick={clearProgression}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          title="Clear all chords"
        >
          <TrashIcon className="w-4 h-4" />
          Clear
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {chordProgression.map((chord, index) => (
          <div
            key={`${index}-${stringifyChord(chord)}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => selectChordInProgression(index)}
            className={classNames(
              'group relative flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 border-2',
              {
                'bg-white text-black border-white': selectedChordIndex === index,
                'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500': selectedChordIndex !== index,
                'opacity-50': draggedIndex === index,
              }
            )}
          >
            <span className="font-semibold select-none">
              {stringifyChord(chord)}
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeChordFromProgression(index);
              }}
              className={classNames(
                'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-600',
                {
                  'hover:bg-gray-200': selectedChordIndex === index,
                }
              )}
              title="Remove chord"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>

            {/* Chord number indicator */}
            <div className={classNames(
              'absolute -top-2 -left-2 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold',
              {
                'bg-black text-white': selectedChordIndex === index,
                'bg-gray-600 text-white': selectedChordIndex !== index,
              }
            )}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Click a chord to highlight it on the grid • Drag to reorder • Hover and click × to remove
      </div>
    </div>
  );
};