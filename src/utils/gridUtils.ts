import type { GridCell, Note, Scale } from "./types";

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SCALES: Record<string, Scale> = {
    Major: {
        name: 'Major',
        intervals: [2, 2, 1, 2, 2, 2, 1],
        notes: [],
        rootNote: 'C'
    },
    Minor: {
        name: 'Minor',
        intervals: [2, 1, 2, 2, 1, 2, 2],
        notes: [],
        rootNote: 'A'
    }
}

export const shiftNote = (base: Note, steps: number, scale?: Scale): Note => {
    const baseIndex = NOTES.indexOf(base.note);
    if (baseIndex === -1) {
        throw new Error(`Invalid base note: ${base}`);
    }
    let intervalIndex = 0;
    if (scale) {
        const intervals = scale.intervals;
        for (let i = 0; i < steps; i++) {
            intervalIndex += intervals[i % intervals.length];
        }
    } else {
        intervalIndex = baseIndex + steps;
    }
    const octave = base.octave + Math.floor(intervalIndex / NOTES.length);
    let index = ((intervalIndex % NOTES.length) + NOTES.length) % NOTES.length; // Ensure positive index

    return {
        note: NOTES[(baseIndex + index) % NOTES.length],
        octave: octave
    }
}

export const findScaleNotes = (scale: Scale): string[] => {
    let fullInterval = 0;
    return scale.intervals.reduce((acc, interval) => {
        fullInterval += interval;
        if (fullInterval < NOTES.length) {
            const currentNote = shiftNote({ note: scale.rootNote, octave: 4 }, fullInterval).note;
            acc.push(currentNote);
        }
        return acc;
    }, [scale.rootNote]);
}

const semitonesDifference = (note1: Note, note2: Note): number => {
    const index1 = NOTES.indexOf(note1.note);
    const index2 = NOTES.indexOf(note2.note);
    if (index1 === -1 || index2 === -1) {
        throw new Error(`Invalid notes: ${note1.note}, ${note2.note}`);
    }
    return (note2.octave - note1.octave) * NOTES.length + (index2 - index1);
}

export const buildGrid = (scale: Scale, rootNote: Note, chromatic: boolean): GridCell[][] => {
    const grid: GridCell[][] = [];
    const scaleNotes = findScaleNotes(scale);

    for (let y = 0; y < 8; y++) {
        const row: GridCell[] = [];
        for (let x = 0; x < 8; x++) {
            let noteIndex;
            if (chromatic) {
                noteIndex = (x + y * 8 - (3 * y));
            } else {
                noteIndex = x + y * 8 - (5 * y); // Wrap around for chromatic scale
            }
            const note = shiftNote(rootNote, noteIndex, chromatic ? undefined : scale);
            const inScale = scaleNotes.includes(note.note);
            const isRoot = note.note === rootNote.note && note.octave === rootNote.octave;
            const semitones = semitonesDifference(rootNote, note);// (note.octave * 12) + note.; //(NOTES.indexOf(note.note)); //+ (note.octave * NOTES.length));

            row.push({
                note,
                semitones,
                x,
                y,
                inScale,
                isRoot,
            });
        }
        grid.push(row);
    }

    return grid;
}

export const printGrid = (grid: GridCell[][]): void => {
    grid.forEach((row, y) => {
        const rowString = row.map(cell => {
            const noteStr = `${cell.note.note}${cell.note.octave}`;
            return cell.isRoot ? `*${noteStr}*` : noteStr;
        }).join(' | ');
        console.log(`Row ${y}: ${rowString}`);
    });
}