import type { GridCell } from "../types";

export const printGrid = (grid: GridCell[][]): void => {
    for (let y = 7; y >= 0; y--) {
        const row = grid[y];
        const rowString = row.map(cell => {
            const noteStr = `${cell.note.note.padEnd(2, ' ')}${cell.note.octave}`;
            return `${cell.isRoot ? '*' : ' '}${noteStr}${cell.inScale ? '=' : ' '}`;
        }).join('|');
        console.log(`Row ${y + 1}: ${rowString}`);
    }
}