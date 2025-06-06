import React, { useState } from 'react';
import { usePushChordStore } from '../store/pushChordStore';
import ChordDisplay from './ChordDisplay';

const ChordInput: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const parseChord = usePushChordStore((state) => state.parseChord);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    parseChord(e.target.value);
  };

  return (
    <div className="chord-input-container p-2 m-2 rounded-sm  col-span-2">
      <form className="chord-input-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="chord-input" className="block text-sm/6 font-medium text-gray-200">
          Enter chord (e.g. Cmaj7, Am9, G13)
        </label>
        <div className='flex items-center rounded-md 
        bg-white pl-3 outline-1 -outline-offset-1 
        outline-gray-300 focus-within:outline-2 
        focus-within:-outline-offset-2 focus-within:outline-blue-500'>
          <input
            id="chord-input"
            name="chord-input"
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter chord (e.g. Cmaj7, Am9, G13)"
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-3xl text-gray-900 placeholder:text-gray-400 
            focus:outline-none 
            sm:text-3xl"
          />
        </div>
        <div className='text-gray-200'>
          <ChordDisplay />

        </div>
      </form >
    </div >
  );
};

export default ChordInput; 