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
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropZoneDragOver = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(dropIndex);
  };

  const handleDropZoneDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the drop zone, not moving to a child element
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isLeavingZone = 
      e.clientX < rect.left || 
      e.clientX > rect.right || 
      e.clientY < rect.top || 
      e.clientY > rect.bottom;
    
    if (isLeavingZone) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null) {
      // Calculate the actual target index based on drag direction
      let targetIndex = dropIndex;
      if (draggedIndex < dropIndex) {
        targetIndex = dropIndex - 1;
      }
      
      if (targetIndex !== draggedIndex) {
        reorderProgression(draggedIndex, targetIndex);
      }
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
      
      <div className="flex flex-wrap items-center">
        {/* Drop zone before first chord */}
        <div
          onDragOver={(e) => handleDropZoneDragOver(e, 0)}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={(e) => handleDrop(e, 0)}
          className="flex items-center justify-center min-w-[8px] min-h-[40px] mr-1"
        >
          {dragOverIndex === 0 && draggedIndex !== null && draggedIndex !== 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-dashed border-blue-400 bg-blue-400/20 text-blue-400 transition-all duration-200 mr-1">
              <span className="font-semibold select-none">
                {stringifyChord(chordProgression[draggedIndex])}
              </span>
              <div className="w-5 h-5 rounded-full bg-blue-400 text-black text-xs flex items-center justify-center font-bold">
                {draggedIndex + 1}
              </div>
            </div>
          )}
        </div>

        {chordProgression.map((chord, index) => (
          <React.Fragment key={`${index}-${stringifyChord(chord)}`}>
            {/* Chord element */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
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

            {/* Drop zone after each chord */}
            <div
              onDragOver={(e) => handleDropZoneDragOver(e, index + 1)}
              onDragLeave={handleDropZoneDragLeave}
              onDrop={(e) => handleDrop(e, index + 1)}
              className="flex items-center justify-center min-w-[8px] min-h-[40px] mx-1"
            >
              {dragOverIndex === index + 1 && draggedIndex !== null && draggedIndex !== index + 1 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-dashed border-blue-400 bg-blue-400/20 text-blue-400 transition-all duration-200">
                  <span className="font-semibold select-none">
                    {stringifyChord(chordProgression[draggedIndex])}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-blue-400 text-black text-xs flex items-center justify-center font-bold">
                    {draggedIndex + 1}
                  </div>
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Click a chord to highlight it on the grid • Drag to reorder • Hover and click × to remove
      </div>
    </div>
  );
};