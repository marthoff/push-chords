import { create } from "zustand";
import type { ParsedChord, ScaleType } from "../types";
import { parseChord } from "../utils/chordUtils";
import { devtools } from "zustand/middleware";

interface PushChordState {
  error?: string;
  chord?: ParsedChord;
  parseChord: (chord: string) => void;
  scaleRoot: string;
  setScaleRoot: (root: string) => void;
  scaleType: ScaleType;
  setScaleType: (type: ScaleType) => void;
  chromaticMode: boolean;
  setChromaticMode: (mode: boolean) => void;
  // Chord progression state
  chordProgression: ParsedChord[];
  selectedChordIndex: number | null;
  addChordToProgression: (chord: ParsedChord) => void;
  removeChordFromProgression: (index: number) => void;
  reorderProgression: (fromIndex: number, toIndex: number) => void;
  selectChordInProgression: (index: number | null) => void;
  clearProgression: () => void;
}

export const usePushChordStore = create<PushChordState>()(
  devtools((set, get) => ({
    chord: null,
    scaleRoot: "C",
    scaleType: "Major",
    chromaticMode: true,
    chordProgression: [],
    selectedChordIndex: null,
    parseChord: (chord: string) => {
      const parsedChord = parseChord(chord);
      set({ chord: parsedChord });
    },
    setScaleRoot: (root: string) => set({ scaleRoot: root }),
    setScaleType: (type: ScaleType) => set({ scaleType: type }),
    setChromaticMode: (mode: boolean) => set({ chromaticMode: mode }),
    addChordToProgression: (chord: ParsedChord) => {
      const { chordProgression } = get();
      set({ 
        chordProgression: [...chordProgression, chord],
        selectedChordIndex: chordProgression.length // Select the newly added chord
      });
    },
    removeChordFromProgression: (index: number) => {
      const { chordProgression, selectedChordIndex } = get();
      const newProgression = chordProgression.filter((_, i) => i !== index);
      let newSelectedIndex = selectedChordIndex;
      
      // Adjust selected index if necessary
      if (selectedChordIndex !== null) {
        if (selectedChordIndex === index) {
          newSelectedIndex = null; // Deselect if removing selected chord
        } else if (selectedChordIndex > index) {
          newSelectedIndex = selectedChordIndex - 1; // Shift index down
        }
      }
      
      set({ 
        chordProgression: newProgression,
        selectedChordIndex: newSelectedIndex
      });
    },
    reorderProgression: (fromIndex: number, toIndex: number) => {
      const { chordProgression, selectedChordIndex } = get();
      const newProgression = [...chordProgression];
      const [movedChord] = newProgression.splice(fromIndex, 1);
      newProgression.splice(toIndex, 0, movedChord);
      
      // Update selected index if needed
      let newSelectedIndex = selectedChordIndex;
      if (selectedChordIndex === fromIndex) {
        newSelectedIndex = toIndex;
      } else if (selectedChordIndex !== null) {
        if (fromIndex < selectedChordIndex && toIndex >= selectedChordIndex) {
          newSelectedIndex = selectedChordIndex - 1;
        } else if (fromIndex > selectedChordIndex && toIndex <= selectedChordIndex) {
          newSelectedIndex = selectedChordIndex + 1;
        }
      }
      
      set({ 
        chordProgression: newProgression,
        selectedChordIndex: newSelectedIndex
      });
    },
    selectChordInProgression: (index: number | null) => {
      const { chordProgression } = get();
      if (index !== null && index < chordProgression.length) {
        set({ 
          selectedChordIndex: index,
          chord: chordProgression[index] // Update current chord display
        });
      } else {
        set({ selectedChordIndex: null });
      }
    },
    clearProgression: () => {
      set({ 
        chordProgression: [],
        selectedChordIndex: null
      });
    },
  })),
);
