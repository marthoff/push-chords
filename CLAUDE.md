# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript web application for generating and visualizing musical chords on an Ableton Push grid layout. The app uses Vite for build tooling and Tailwind CSS for styling.

### Core Architecture

- **State Management**: Zustand store (`src/store/pushChordStore.ts`) manages global state for chord parsing, scale selection, and display modes
- **Music Theory Engine**: Core utilities in `src/utils/` handle chord parsing, music theory calculations, and grid generation
  - `chordUtils.ts` - Parses chord symbols into structured data
  - `musicUtils.ts` - Handles scales, note calculations, and grid layout
  - `gridUtils.ts` - Grid-specific utilities
- **Grid System**: 8x8 grid representing Ableton Push layout, with cells containing note/chord information
- **Component Structure**: 
  - `ChordGrid` - Main visualization component
  - `ChordInput`/`ScaleInput` - User input controls
  - `ChordDisplay` - Shows parsed chord information

### Key Data Flow

1. User inputs chord symbol → `parseChord()` → Zustand store
2. Store triggers grid recalculation via `buildGrid()`
3. Grid cells contain note, scale, and chord relationship data
4. Components reactively update based on store state

### Testing

Uses Vitest for testing. Test files are co-located with utilities (e.g., `chordUtils.test.ts`).