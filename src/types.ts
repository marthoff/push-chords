export type Note = {
  note: string; // e.g., 'C', 'C#', 'D', etc.
  octave: number; // e.g., 4, 5
};

export type UniversalScale = {
  name: string; // e.g., 'Major', 'Minor'
  intervals: number[]; // e.g., [2, 2, 1, 2, 2, 2, 1] for Major scale
};

export type Scale = UniversalScale & {
  notes: string[]; // Array of notes in the scale
  rootNote: string; // The root note of the scale
};

export type GridData = GridCell[][];

export type GridCell = {
  note: Note; // The note represented in the cell
  x: number;
  y: number;
  inScale: boolean; // Whether the note is part of the scale
  isRoot: boolean; // Whether this cell represents the root note of the scale
  semitones?: number; // The number of semitones from the root note
  chordNote?: ChordNote; // Optional chord note information if this cell is part of a chord
};

export type ChordNote = {
  note: string; // The note name, e.g., 'C', 'D#'
  interval: string;
  semitones: number;
};

export type ChordQuality =
  | "major"
  | "minor"
  | "dominant"
  | "major7"
  | "minor7"
  | "diminished"
  | "half-diminished"
  | "augmented"
  | "sus2"
  | "sus4"
  | "unknown";

export interface ParsedChord {
  root: string;
  quality: ChordQuality;
  extensions: number[]; // z. B. [9, 13]
  hasSeventh: boolean;
  notes: ChordNote[]; // resultierende Töne
}

export type ChordParseResult = {
  isValid: boolean;
  error?: string;
  chord?: ParsedChord;
};

export type ScaleType = "Major" | "Minor" | "Chromatic";
