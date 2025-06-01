import { expect, test } from 'vitest';
import { buildGrid, findScaleNotes, printGrid, SCALES, shiftNote } from './gridUtils';
import type { Note } from './types';

test('shiftNote chromatic', () => {
    const baseNote: Note = {
        note: 'C',
        octave: 4
    }
    expect(shiftNote(baseNote, 0)).toEqual({ note: 'C', octave: 4 }); // No change
    expect(shiftNote(baseNote, 1)).toEqual({ note: 'C#', octave: 4 }); // Shift up by one semitone
    expect(shiftNote(baseNote, 12)).toEqual({ note: 'C', octave: 5 }); // Wraps around to the same note
    expect(shiftNote(baseNote, 26)).toEqual({ note: 'D', octave: 6 }); // Wraps around to the same note
    expect(shiftNote(baseNote, -1)).toEqual({ note: 'B', octave: 3 }); // Wraps around to the previous note
    expect(shiftNote(baseNote, 13)).toEqual({ note: 'C#', octave: 5 }); // Wraps around to the next note
    expect(shiftNote(baseNote, -13)).toEqual({ note: 'B', octave: 2 }); // Wraps around to the previous note
});

test('shiftNote in scale', () => {
    const baseNote: Note = {
        note: 'C',
        octave: 4
    }
    const majorScale = SCALES.Major;
    expect(shiftNote(baseNote, 0, majorScale)).toEqual({ note: 'C', octave: 4 }); // No change
    expect(shiftNote(baseNote, 2, majorScale)).toEqual({ note: 'E', octave: 4 }); // Shift up by two semitones
    expect(shiftNote(baseNote, 7, majorScale)).toEqual({ note: 'C', octave: 5 }); // Shift up by two semitones
    expect(shiftNote(baseNote, 9, majorScale)).toEqual({ note: 'E', octave: 5 }); // Shift up by two semitones
    expect(shiftNote(
        { note: 'A', octave: 4 },
        3, SCALES.minor)).toEqual({ note: 'C', octave: 5 }); // Shift up by two semitones
});

test('scale notes', () => {
    let notes = findScaleNotes(SCALES.Major);
    expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);

    notes = findScaleNotes(SCALES.Minor);
    expect(notes).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
});

test('major scale grid', () => {
    const grid = buildGrid(SCALES.Major, { note: 'C', octave: 4 }, false);
    expect(grid[0][0].note.note).toBe('C');
    expect(grid[0][0].note.octave).toBe(4);
    expect(grid[0][0].inScale).toBe(true);
    expect(grid[7][7].note.note).toBe('C');
    expect(grid[7][7].note.octave).toBe(8);
    // printGrid(grid);
});

test('minor scale grid', () => {

    const grid2 = buildGrid(SCALES.Minor, { note: 'A', octave: 4 }, false);
    printGrid(grid2);
    expect(grid2[0][0].note.note).toBe('A');
    expect(grid2[0][0].note.octave).toBe(4);
    expect(grid2[0][0].inScale).toBe(true);
});