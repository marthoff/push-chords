import { expect, test } from "vitest";
import { buildGrid, buildScale, SCALES, shiftNote } from "./musicUtils";
import { printGrid } from "./gridUtils";

test('shift a note', () => {
    expect(shiftNote({ note: 'C', octave: 4 }, 2)).toEqual({ note: 'D', octave: 4 });
    expect(shiftNote({ note: 'C', octave: 4 }, 12)).toEqual({ note: 'C', octave: 5 });
    expect(shiftNote({ note: 'C', octave: 4 }, -1)).toEqual({ note: 'B', octave: 3 });
    expect(shiftNote({ note: 'C', octave: 4 }, -13)).toEqual({ note: 'B', octave: 2 });
    expect(shiftNote({ note: 'A', octave: 4 }, 5)).toEqual({ note: 'D', octave: 5 });
});

test('build scales', () => {

    expect(buildScale(SCALES.Major, 'C')).toEqual({
        name: 'Major',
        intervals: [0, 2, 4, 5, 7, 9, 11],
        notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        rootNote: 'C'
    });

    expect(buildScale(SCALES.Minor, 'A')).toEqual({
        name: 'Minor',
        intervals: [0, 2, 3, 5, 7, 8, 10],
        notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        rootNote: 'A'
    });

    expect(buildScale(SCALES.Chromatic, 'G#')).toEqual({
        name: 'Chromatic',
        intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        notes: [
            'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'
        ],
        rootNote: 'G#'
    });


    expect(() => buildScale(SCALES.Major, 'H')).toThrow('Invalid root note: H');
});

test('build a major grid', () => {
    const majorScale = buildScale(SCALES.Major, 'C');
    const grid = buildGrid(majorScale);
    expect(grid[0][0].note.note).toBe('C');
    expect(grid[7][0].note.note).toBe('C');
    expect(grid[7][0].note.octave).toBe(8);
    expect(grid[0][1].note.note).toBe('D');
    expect(grid[1][1].note.note).toBe('A');
});

test('build a minor grid', () => {
    const minorScale = buildScale(SCALES.Minor, 'C');
    const grid = buildGrid(minorScale);
    expect(grid[0][0].note.note).toBe('C');
    expect(grid[7][0].note.note).toBe('C');
    expect(grid[7][0].note.octave).toBe(8);
    expect(grid[0][2].note.note).toBe('D#');
    expect(grid[1][1].note.note).toBe('G#');
});

test('build a chromatic grid', () => {
    const refScale = buildScale(SCALES.Major, 'D');
    const chromaticScale = buildScale(SCALES.Chromatic, 'C');
    const grid = buildGrid(chromaticScale, 'C', refScale);
    expect(grid[0][0].note.note).toBe('C');
    expect(grid[7][0].note.note).toBe('B');
    expect(grid[7][0].note.octave).toBe(6);
    expect(grid[0][1].note.note).toBe('C#');
    expect(grid[1][1].note.note).toBe('F#');
    printGrid(grid);
});