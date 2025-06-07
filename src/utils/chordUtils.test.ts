import { describe, it, expect } from "vitest";
import { parseChord, stringifyChord } from "./chordUtils";

describe("parseChord", () => {
  it("handles empty input", () => {
    const result = parseChord("");
    expect(result).toEqual({
      root: "C",
      quality: "major",
      hasSeventh: false,
      extensions: [],
      notes: [
        { note: "C", interval: "Root", semitones: 0 },
        { note: "E", interval: "3", semitones: 4 },
        { note: "G", interval: "5", semitones: 7 },
      ],
    });
  });

  it("parses major chords correctly", () => {
    const result = parseChord("C");
    expect(result).toEqual({
      root: "C",
      quality: "major",
      hasSeventh: false,

      extensions: [],
      notes: [
        { note: "C", interval: "Root", semitones: 0 },
        { note: "E", interval: "3", semitones: 4 },
        { note: "G", interval: "5", semitones: 7 },
      ],
    });
  });

  it("parses minor chords correctly", () => {
    const result = parseChord("Am");
    expect(result).toEqual({
      root: "A",
      hasSeventh: false,
      quality: "minor",
      extensions: [],
      notes: [
        { note: "A", interval: "Root", semitones: 0 },
        { note: "C", interval: "♭3", semitones: 3 },
        { note: "E", interval: "5", semitones: 7 },
      ],
    });
  });

  it("parses major seventh chords correctly", () => {
    const result = parseChord("Cmaj7");
    expect(result).toEqual({
      root: "C",
      quality: "major7",
      hasSeventh: true,
      extensions: [],
      notes: [
        { note: "C", interval: "Root", semitones: 0 },
        { note: "E", interval: "3", semitones: 4 },
        { note: "G", interval: "5", semitones: 7 },
        { note: "B", interval: "7", semitones: 11 },
      ],
    });
  });

  it("parses dominant seventh chords correctly", () => {
    const result = parseChord("C7");
    expect(result).toEqual({
      root: "C",
      hasSeventh: true,
      quality: "dominant",
      extensions: [],
      notes: [
        { note: "C", interval: "Root", semitones: 0 },
        { note: "E", interval: "3", semitones: 4 },
        { note: "G", interval: "5", semitones: 7 },
        { note: "A#", interval: "♭7", semitones: 10 },
      ],
    });
  });

  it("parses complex chords correctly", () => {
    const result = parseChord("Am7");
    expect(result).toEqual({
      root: "A",
      hasSeventh: true,
      quality: "minor7",
      extensions: [],
      notes: [
        { note: "A", interval: "Root", semitones: 0 },
        { note: "C", interval: "♭3", semitones: 3 },
        { note: "E", interval: "5", semitones: 7 },
        { note: "G", interval: "♭7", semitones: 10 },
      ],
    });
  });

  it("parses chords with multiple extensions", () => {
    const result = parseChord("Cmaj9");
    expect(result).toEqual({
      root: "C",
      hasSeventh: true,
      quality: "major7",
      extensions: [9],
      notes: [
        { note: "C", interval: "Root", semitones: 0 },
        { note: "E", interval: "3", semitones: 4 },
        { note: "G", interval: "5", semitones: 7 },
        { note: "B", interval: "7", semitones: 11 },
        { note: "D", interval: "9", semitones: 14 },
      ],
    });
  });
});

describe("Chord Parser & Stringifier", () => {
  const testCases = [
    // Grundakkorde
    {
      input: "C",
      expected: {
        root: "C",
        quality: "major",
        extensions: [],
        hasSeventh: false,
      },
    },
    {
      input: "Cm",
      expected: {
        root: "C",
        quality: "minor",
        extensions: [],
        hasSeventh: false,
      },
    },

    // Akkorde mit 7
    {
      input: "C7",
      expected: {
        root: "C",
        quality: "dominant",
        extensions: [],
        hasSeventh: true,
      },
    },
    {
      input: "Cm7",
      expected: {
        root: "C",
        quality: "minor7",
        extensions: [],
        hasSeventh: true,
      },
    },
    {
      input: "Cmaj7",
      expected: {
        root: "C",
        quality: "major7",
        extensions: [],
        hasSeventh: true,
      },
    },

    // Add- und Extensions
    {
      input: "Cadd9",
      expected: {
        root: "C",
        quality: "major",
        extensions: [9],
        hasSeventh: false,
      },
    },
    {
      input: "Cmadd9",
      expected: {
        root: "C",
        quality: "minor",
        extensions: [9],
        hasSeventh: false,
      },
    },

    // Akkorde mit 9
    {
      input: "C9",
      fullName: "C79",
      expected: {
        root: "C",
        quality: "dominant",
        extensions: [9],
        hasSeventh: true,
      },
    },
    {
      input: "Cm9",
      fullName: "Cm79",
      expected: {
        root: "C",
        quality: "minor7",
        extensions: [9],
        hasSeventh: true,
      },
    },
    {
      input: "Cmaj9",
      fullName: "Cmaj79",
      expected: {
        root: "C",
        quality: "major7",
        extensions: [9],
        hasSeventh: true,
      },
    },

    // Akkorde mit 11
    {
      input: "C11",
      expected: {
        root: "C",
        quality: "dominant",
        extensions: [9, 11],
        hasSeventh: true,
      },
    },

    // Akkorde mit 13
    {
      input: "C13",
      expected: {
        root: "C",
        quality: "dominant",
        extensions: [9, 11, 13],
        hasSeventh: true,
      },
    },

    {
      input: "Csus2",
      expected: {
        root: "C",
        quality: "sus2",
        extensions: [],
        hasSeventh: false,
      },
    },

    {
      input: "Bsus4",
      expected: {
        root: "B",
        quality: "sus4",
        extensions: [],
        hasSeventh: false,
      },
    },

    {
      input: "Cm7b5",
      expected: {
        root: "C",
        quality: "half-diminished",
        extensions: [],
        hasSeventh: true,
      },
    },

    {
      input: "Ddim7",
      fullName: "Ddim7",
      expected: {
        root: "D",
        quality: "diminished",
        extensions: [],
        hasSeventh: true,
        notes: ["D", "F", "G#", "B"],
      },
    },
  ];

  testCases.forEach(({ input, fullName, expected }) => {
    it(`should parse and stringify "${input}" correctly`, () => {
      const parsed = parseChord(input);

      // Basics
      expect(parsed.root).toBe(expected.root);
      expect(parsed.quality).toBe(expected.quality);
      expect(parsed.hasSeventh).toBe(expected.hasSeventh);
      expect(parsed.extensions.sort()).toEqual(expected.extensions.sort());
      if (expected.notes) {
        expect(parsed.notes.map((note) => note.note)).toEqual(expected.notes);
      }

      // Round-trip check
      const output = stringifyChord(parsed);
      expect(output).toBe(fullName || input);
    });
  });
});
