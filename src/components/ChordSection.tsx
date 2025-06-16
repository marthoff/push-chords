import React, { useState } from "react";
import { usePushChordStore } from "../store/pushChordStore";
import ChordDisplay from "./ChordDisplay";
import { QuestionMarkCircleIcon, PlusIcon } from "@heroicons/react/16/solid";

export const ChordSection: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isShowInfo, setIsShowInfo] = useState(false);

  const parseChord = usePushChordStore((state) => state.parseChord);
  const addChordToProgression = usePushChordStore((state) => state.addChordToProgression);
  const chord = usePushChordStore((state) => state.chord);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    parseChord(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chord && inputValue.trim()) {
      addChordToProgression(chord);
      setInputValue("");
      parseChord(""); // Clear current chord
    }
  };

  const handleAddChord = () => {
    if (chord && inputValue.trim()) {
      addChordToProgression(chord);
      setInputValue("");
      parseChord(""); // Clear current chord
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Chord Input</h3>
      
      <div className="space-y-3">
        <div>
          <label
            htmlFor="chord-input"
            className="block text-sm font-medium text-white mb-2"
          >
            Chord Symbol
          </label>
          <div className="flex rounded-md overflow-hidden border border-gray-700 bg-black">
            <input
              name="chord-input"
              id="chord-input"
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter chord (e.g. Cmaj7, Am9, G13) - Press Enter to add"
              className="flex-1 bg-white text-black px-4 py-3 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
            />
            <button
              onClick={handleAddChord}
              disabled={!chord || !inputValue.trim()}
              type="button"
              className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors px-4 py-3 text-white border-l border-gray-700"
              title="Add chord to progression"
            >
              <PlusIcon
                aria-hidden="true"
                className="size-5 text-white"
              />
            </button>
            <button
              onClick={() => setIsShowInfo(!isShowInfo)}
              type="button"
              className="bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-3 text-white border-l border-gray-700"
              title="Show chord information"
            >
              <QuestionMarkCircleIcon
                aria-hidden="true"
                className="size-5 text-gray-300"
              />
            </button>
          </div>
        </div>
        
        {isShowInfo && (
          <div className="p-4 bg-gray-900 rounded-md border border-gray-700">
            <ChordDisplay />
          </div>
        )}
      </div>
    </div>
  );
};