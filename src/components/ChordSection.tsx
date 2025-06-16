import React, { useState } from "react";
import { usePushChordStore } from "../store/pushChordStore";
import ChordDisplay from "./ChordDisplay";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";

export const ChordSection: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isShowInfo, setIsShowInfo] = useState(false);

  const parseChord = usePushChordStore((state) => state.parseChord);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    parseChord(e.target.value);
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
              placeholder="Enter chord (e.g. Cmaj7, Am9, G13)"
              className="flex-1 bg-white text-black px-4 py-3 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
            />
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