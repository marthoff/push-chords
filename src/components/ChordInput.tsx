import React, { useState, useEffect } from 'react';
import { parseChord } from '../utils/chordUtils';
import './ChordInput.css';
import type { ChordInputProps } from '../types';

const ChordInput: React.FC<ChordInputProps> = ({ onChordChange, currentChord }) => {
  const [inputValue, setInputValue] = useState(currentChord);
  const parseResult = parseChord(inputValue);

  useEffect(() => {
    // Only update the grid if the chord is valid
    if (parseResult.isValid && parseResult.chord) {
      onChordChange(inputValue);
    }
  }, [inputValue, onChordChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="chord-input-container">
      <form className="chord-input-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter chord (e.g. Cmaj7, Am9, G13)"
          className="chord-input"
        />
      </form>
    </div>
  );
};

export default ChordInput; 