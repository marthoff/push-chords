import type { GridCell, Note, ParsedChord, Scale, UniversalScale } from "../types";

export const NOTES: string[] = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const SCALES: Record<string, UniversalScale> = {
    'Major': {
        name: 'Major',
        intervals: [0, 2, 4, 5, 7, 9, 11],
    },
    'Minor': {
        name: 'Minor',
        intervals: [0, 2, 3, 5, 7, 8, 10],
    },
    'Chromatic': {
        name: 'Chromatic',
        intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Chromatic scale has 12 semitones
    }
};

export const shiftNote = (note: Note, semitones: number): Note => {
    const wrappedSemitones = semitones % 12; // Wrap around within an octave
    const noteIndex = NOTES.indexOf(note.note);
    if (noteIndex === -1) {
        throw new Error(`Invalid note: ${note.note}`);
    }
    const newIndex = (noteIndex + wrappedSemitones + 12) % 12; // Ensure positive index
    const newNote = NOTES[newIndex];
    const newOctave = note.octave + Math.floor((noteIndex + semitones) / 12);
    return {
        note: newNote,
        octave: newOctave
    };
}

export const buildScale = (scale: UniversalScale, rootNote: string): Scale => {
    const rootIndex = NOTES.indexOf(rootNote);
    if (rootIndex === -1) {
        throw new Error(`Invalid root note: ${rootNote}`);
    }
    const notes: string[] = [];
    for (let i = 0; i < scale.intervals.length; i++) {
        const index = rootIndex + scale.intervals[i]
        const wrappedIndex = index % NOTES.length;
        const note = NOTES[wrappedIndex];
        notes.push(note);
    }

    return {
        ...scale,
        notes,
        rootNote: rootNote
    };
}

export const buildGrid = (scale: Scale, parsedChord?: ParsedChord, referenceScale?: Scale,): GridCell[][] => {
    const grid: GridCell[][] = [];
    const rootNote = scale.rootNote;
    const startNote: Note = {
        note: rootNote,
        octave: 4 // Default starting octave
    };
    if (!referenceScale) {
        referenceScale = scale; // Use the same scale if no reference is provided
    }

    // Calculate fourth offset
    const offset = scale.intervals.length > 8 ? 3 : 4

    const noteSet = scale.notes;

    for (let y = 0; y < 8; y++) {
        const row: GridCell[] = [];
        for (let x = 0; x < 8; x++) {
            const index = (y * 8 + x) - (offset * y);
            const wrappedIndex = index % noteSet.length;
            const note = noteSet[wrappedIndex];
            const noteObj: Note = {
                note: note,
                octave: Math.floor(index / noteSet.length) + startNote.octave
            };
            const chordNote = parsedChord ? parsedChord.notes
                .find(n => n.note === noteObj.note) : undefined;
            const inScale = referenceScale.notes.includes(note);
            row.push({
                note: noteObj,
                x: x,
                y: y,
                inScale: inScale,
                isRoot: note === referenceScale.rootNote,
                chordNote
            });
        }
        grid.push(row);
    }

    return grid;
};