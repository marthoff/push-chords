export type Note = {
    note: string; // e.g., 'C', 'C#', 'D', etc.
    octave: number; // e.g., 4, 5
}

export type Scale = {
    name: string; // e.g., 'Major', 'Minor'
    intervals: number[]; // e.g., [2, 2, 1, 2, 2, 2, 1] for Major scale
    notes: string[]; // Array of notes in the scale
    rootNote: string; // The root note of the scale
}

export type GridCell = {
    note: Note; // The note represented in the cell
    x: number;
    y: number;
    inScale: boolean; // Whether the note is part of the scale
    isRoot: boolean; // Whether this cell represents the root note of the scale
    semitones: number; // The number of semitones from the root note
}