import type { ChordNote, ChordParseResult } from "../types";
import { shiftNote } from "./musicUtils";



const CHORD_QUALITIES: { [key: string]: ChordNote[] } = {
  major: [
    { interval: 'R', semitones: 0 },    // Root
    { interval: '3', semitones: 4 },    // Major third
    { interval: '5', semitones: 7 }     // Perfect fifth
  ],
  minor: [
    { interval: 'R', semitones: 0 },    // Root
    { interval: '♭3', semitones: 3 },   // Minor third
    { interval: '5', semitones: 7 }     // Perfect fifth
  ],
  dim: [
    { interval: 'R', semitones: 0 },    // Root
    { interval: '♭3', semitones: 3 },   // Minor third
    { interval: '♭5', semitones: 6 }    // Diminished fifth
  ],
  aug: [
    { interval: 'R', semitones: 0 },    // Root
    { interval: '3', semitones: 4 },    // Major third
    { interval: '#5', semitones: 8 }    // Augmented fifth
  ],
};

const EXTENSIONS: { [key: string]: ChordNote[] } = {
  '7': [{ interval: '♭7', semitones: 10 }],    // Dominant seventh
  'maj7': [{ interval: '7', semitones: 11 }],  // Major seventh
  '6': [{ interval: '6', semitones: 9 }],      // Major sixth
  '9': [{ interval: '9', semitones: 14 }],     // Major ninth
  '11': [{ interval: '11', semitones: 17 }],   // Perfect eleventh
  '13': [{ interval: '13', semitones: 21 }],   // Major thirteenth
};

// Helper function to get implied extensions
const getImpliedExtensions = (extension: string, isMajor = false): string[] => {
  if (isMajor) {
    switch (extension) {
      case '9':
        return [];
      case '11':
        return [];
      case '13':
        return [];
      default:
        return [];
    }
  }

  switch (extension) {
    case '9':
      return ['7'];
    case '11':
      return ['7', '9'];
    case '13':
      return ['7', '9', '11'];
    default:
      return [];
  }
};

export const parseChord = (chordName?: string): ChordParseResult => {
  if (!chordName) {
    return {
      isValid: false,
      error: 'Please enter a chord name'
    };
  }

  if (!chordName.trim()) {
    return {
      isValid: false,
      error: 'Please enter a chord name'
    };
  }

  // First, extract the root note
  const rootMatch = chordName.match(/^([A-G][#b]?)/);
  if (!rootMatch) {
    return {
      isValid: false,
      error: 'Invalid root note. Must start with A-G'
    };
  }

  const root = rootMatch[1];
  let remaining = chordName.slice(root.length);

  // Check for maj7 first
  let extensions: string[] = [];
  let quality = 'major'; // default quality
  let hasMajor = false;

  if (remaining.startsWith('maj')) {
    // Handle maj7, maj9, maj11, maj13
    remaining = remaining.slice(3);
    const extMatch = remaining.match(/^(7|9|11|13)/);
    if (extMatch) {
      const ext = extMatch[1];
      extensions.push('maj7');
      hasMajor = true;
      if (ext !== '7') {
        extensions.push(ext);
        // Add implied extensions for 9, 11, 13
        extensions.push(...getImpliedExtensions(ext, true));
      }
      remaining = remaining.slice(ext.length);
    }
  } else if (remaining.startsWith('m')) {
    quality = 'minor';
    remaining = remaining.slice(1);
  } else if (remaining.startsWith('dim')) {
    quality = 'dim';
    remaining = remaining.slice(3);
  } else if (remaining.startsWith('aug')) {
    quality = 'aug';
    remaining = remaining.slice(3);
  }

  // Parse remaining extensions
  while (remaining.length > 0) {
    let found = false;
    for (const ext of Object.keys(EXTENSIONS)) {
      if (remaining.startsWith(ext)) {
        extensions.push(ext);
        // Add implied extensions
        extensions.push(...getImpliedExtensions(ext, hasMajor));
        remaining = remaining.slice(ext.length);
        found = true;
        break;
      }
    }
    if (!found) break;
  }

  // Remove duplicates and sort extensions
  extensions = [...new Set(extensions)];

  const baseNotes = CHORD_QUALITIES[quality];
  const extensionNotes = extensions.flatMap(ext => EXTENSIONS[ext]);

  const notes = [...baseNotes, ...extensionNotes].map(note => {
    return {
      ...note,
      note: shiftNote(
        { note: root, octave: 4 },
        note.semitones).note, // Set the root note for each chord note
    };
  });

  return {
    isValid: true,
    chord: {
      root,
      quality,
      extensions,
      notes
    }
  };
};

