import { describe, it, expect } from 'vitest';
import { parseChord, } from './chordUtils';

describe('parseChord', () => {

  it('handles empty input', () => {
    const result = parseChord('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a chord name');
  });

  it('validates root note', () => {
    const result = parseChord('H7');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid root note. Must start with A-G');
  });

  it('parses major chords correctly', () => {
    const result = parseChord('C');
    expect(result.isValid).toBe(true);
    expect(result.chord).toEqual({
      root: 'C',
      quality: 'major',
      extensions: [],
      notes: [
        { note: 'C', interval: 'R', semitones: 0 },
        { note: 'E', interval: '3', semitones: 4 },
        { note: 'G', interval: '5', semitones: 7 }
      ]
    });
  });

  it('parses minor chords correctly', () => {
    const result = parseChord('Am');
    expect(result.isValid).toBe(true);
    expect(result.chord).toEqual({
      root: 'A',
      quality: 'minor',
      extensions: [],
      notes: [
        { note: 'A', interval: 'R', semitones: 0 },
        { note: 'C', interval: '♭3', semitones: 3 },
        { note: 'E', interval: '5', semitones: 7 }
      ]
    });
  });

  it('parses major seventh chords correctly', () => {
    const result = parseChord('Cmaj7');
    expect(result.isValid).toBe(true);
    expect(result.chord).toEqual({
      root: 'C',
      quality: 'major',
      extensions: ['maj7'],
      notes: [
        { note: 'C', interval: 'R', semitones: 0 },
        { note: 'E', interval: '3', semitones: 4 },
        { note: 'G', interval: '5', semitones: 7 },
        { note: 'B', interval: '7', semitones: 11 }
      ]
    });
  });

  it('parses dominant seventh chords correctly', () => {
    const result = parseChord('C7');
    expect(result.isValid).toBe(true);
    expect(result.chord).toEqual({
      root: 'C',
      quality: 'major',
      extensions: ['7'],
      notes: [
        { note: 'C', interval: 'R', semitones: 0 },
        { note: 'E', interval: '3', semitones: 4 },
        { note: 'G', interval: '5', semitones: 7 },
        { note: 'A#', interval: '♭7', semitones: 10 }
      ]
    });
  });

  it('parses complex chords correctly', () => {
    const result = parseChord('Am7');
    expect(result.isValid).toBe(true);
    expect(result.chord).toEqual({
      root: 'A',
      quality: 'minor',
      extensions: ['7'],
      notes: [
        { note: 'A', interval: 'R', semitones: 0 },
        { note: 'C', interval: '♭3', semitones: 3 },
        { note: 'E', interval: '5', semitones: 7 },
        { note: 'G', interval: '♭7', semitones: 10 }
      ]
    });
  });

  it('parses chords with multiple extensions', () => {
    const result = parseChord('Cmaj9');
    expect(result.isValid).toBe(true);
    expect(result.chord).toEqual({
      root: 'C',
      quality: 'major',
      extensions: ['maj7', '9'],
      notes: [
        { note: 'C', interval: 'R', semitones: 0 },
        { note: 'E', interval: '3', semitones: 4 },
        { note: 'G', interval: '5', semitones: 7 },
        { note: 'B', interval: '7', semitones: 11 },
        { note: 'D', interval: '9', semitones: 14 }
      ]
    });
  });
});

