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

const IMPLIED_EXTENSION_ORDER = ['7', '9', '11', '13'];

const getImpliedExtensions = (extension: string, isMajor = false): string[] => {
  const maxIndex = IMPLIED_EXTENSION_ORDER.indexOf(extension);
  if (maxIndex <= 0) return [];

  // Nur Extensions hinzufügen, die "kleiner" sind
  const implied = IMPLIED_EXTENSION_ORDER.slice(0, maxIndex);

  // Für maj7 dürfen keine Dominant-Erweiterungen kommen (z. B. keine ♭7)
  if (isMajor) {
    return implied.filter(e => e !== '7'); // z. B. nur 9 bei maj13
  }

  return implied;
};

export const parseChord = (chordName?: string): ChordParseResult => {
  if (!chordName?.trim()) {
    return { isValid: false, error: 'Please enter a chord name' };
  }

  const rootMatch = chordName.match(/^([a-gA-G][#b]?)/);
  if (!rootMatch) {
    return { isValid: false, error: 'Invalid root note. Must start with A-G' };
  }

  const root = rootMatch[1].toLocaleUpperCase();
  let remaining = chordName.slice(root.length);

  let extensions: string[] = [];
  let quality = 'major'; // default
  let hasMajor = false;

  const matchAndConsume = (prefix: string): boolean => {
    if (remaining.startsWith(prefix)) {
      remaining = remaining.slice(prefix.length);
      return true;
    }
    return false;
  };

  // Detect chord quality
  if (matchAndConsume('maj')) {
    hasMajor = true;
    if (remaining.match(/^(7|9|11|13)/)) {
      const ext = remaining.match(/^(7|9|11|13)/)![1];
      if (ext === '7') {
        extensions.push('maj7');
      } else {
        extensions.push('maj7', ext);
        extensions.push(...getImpliedExtensions(ext, true));
      }
      remaining = remaining.slice(ext.length);
    }
  } else if (matchAndConsume('dim')) {
    quality = 'dim';
  } else if (matchAndConsume('aug')) {
    quality = 'aug';
  } else if (matchAndConsume('m') || matchAndConsume('-')) {
    quality = 'minor';
  }

  // Check for remaining extensions
  while (remaining.length > 0) {
    const matchedExt = Object.keys(EXTENSIONS).find(ext => remaining.startsWith(ext));
    if (!matchedExt) break;

    extensions.push(matchedExt);
    extensions.push(...getImpliedExtensions(matchedExt, hasMajor));
    remaining = remaining.slice(matchedExt.length);
  }

  // Remove duplicates
  extensions = [...new Set(extensions)];

  const baseNotes = CHORD_QUALITIES[quality];
  const extensionNotes = extensions.flatMap(ext => EXTENSIONS[ext] || []);

  const notes = [...baseNotes, ...extensionNotes].map(note => ({
    ...note,
    note: shiftNote({ note: root, octave: 4 }, note.semitones).note,
  }));

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