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
}

export const usePushChordStore = create<PushChordState>()(
    devtools(
        ((set) => ({
            chord: null,
            scaleRoot: "C",
            scaleType: "Major",
            chromaticMode: false,
            parseChord: (chord: string) => {
                const parsedChord = parseChord(chord);
                if (parsedChord.isValid) {
                    set({ chord: parsedChord.chord, error: undefined });
                } else {
                    set({ chord: undefined, error: parsedChord.error });
                }
            },
            setScaleRoot: (root: string) => set({ scaleRoot: root }),
            setScaleType: (type: ScaleType) => set({ scaleType: type }),
            setChromaticMode: (mode: boolean) => set({ chromaticMode: mode }),
        }))
    )
);