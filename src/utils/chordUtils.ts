import type { ChordNote, ChordQuality, ParsedChord } from "../types";

export function parseChord(chord: string): ParsedChord {
  const rootMatch = chord.match(/^[A-G](#|b)?/);
  const root = rootMatch ? rootMatch[0] : "C";

  const rest = chord.slice(root.length);

  let quality: ChordQuality = "unknown";
  let extensions: number[] = [];
  let hasSeventh = false;

  if (/^maj7/.test(rest)) {
    quality = "major7";
    hasSeventh = true;
  } else if (/^m7b5/.test(rest)) {
    quality = "half-diminished"; // 7b5 wird oft als diminished interpretiert
    hasSeventh = true;
  } else if (/^m7/.test(rest)) {
    quality = "minor7";
    hasSeventh = true;
  } else if (/^maj9/.test(rest)) {
    quality = "major7";
    hasSeventh = true;
    extensions.push(9);
  } else if (/^m9/.test(rest)) {
    quality = "minor7";
    hasSeventh = true;
    extensions.push(9);
  } else if (/^madd9/.test(rest)) {
    quality = "minor";
    extensions.push(9);
    hasSeventh = false;
  } else if (/^m/.test(rest)) {
    quality = "minor";
  } else if (/^7/.test(rest)) {
    quality = "dominant";
    hasSeventh = true;
  } else if (/^9/.test(rest)) {
    quality = "dominant";
    hasSeventh = true;
    extensions.push(9);
  } else if (/^add9/.test(rest)) {
    quality = "major";
    extensions.push(9);
    hasSeventh = false;
  } else if (rest.length === 0) {
    quality = "major"; // Standardfall, wenn nichts angegeben ist
    hasSeventh = false;
  } else if (/^dim7/.test(rest)) {
    quality = "diminished";
    hasSeventh = true; // Dim7 impliziert eine verminderte Septime
  } else if (/^dim/.test(rest)) {
    quality = "diminished";
  } else if (/^aug/.test(rest)) {
    quality = "augmented";
  } else if (/^sus2/.test(rest)) {
    quality = "sus2";
  } else if (/^sus4/.test(rest)) {
    quality = "sus4";
  } else if (/^6/.test(rest)) {
    quality = "major"; // 6. Stufe wird oft als Major interpretiert
    extensions.push(6);
  } else if (/^m6/.test(rest)) {
    quality = "minor"; // m6 wird oft als Minor interpretiert
    extensions.push(6);
  } else if (/^add6/.test(rest)) {
    quality = "major"; // add6 wird oft als Major interpretiert
    extensions.push(6);
  } else if (/^(11)/.test(rest)) {
    quality = "dominant";
    hasSeventh = true;
    extensions.push(11);
  } else if (/^(13)/.test(rest)) {
    quality = "dominant";
    hasSeventh = true;
    extensions.push(13);
  }

  // Wenn Extension 13 enthalten ist, implizieren wir 9 + 11
  if (rest.includes("13")) {
    extensions.push(13);
    if (!extensions.includes(9)) extensions.push(9);
    if (!extensions.includes(11)) extensions.push(11);
    hasSeventh = true;
  } else if (rest.includes("11")) {
    extensions.push(11);
    if (!extensions.includes(9)) extensions.push(9);
    hasSeventh = true;
  }

  const result: ParsedChord = {
    root,
    quality,
    extensions: [...new Set(extensions)].sort((a, b) => a - b),
    hasSeventh,
    notes: [], // kannst du mit einer Skalentabelle befüllen
  };

  return {
    ...result,
    notes: getChordNotes(result),
  };
}

const chromaticScale = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/**
 * Hilfsfunktion, um einen Ton mit einem Intervall zu berechnen
 */
function transpose(root: string, semitones: number): ChordNote {
  const index = chromaticScale.indexOf(root);
  if (index === -1)
    return {
      note: root,
      interval: "R",
      semitones: 0,
    };
  const note = chromaticScale[(index + semitones) % 12];
  return {
    note,
    interval: getIntervalName(semitones),
    semitones: semitones,
  };
}

/**
 * Hauptfunktion zur Bestimmung der Akkordtöne
 */
function getChordNotes(parsed: ParsedChord): ChordNote[] {
  const { root, quality, hasSeventh, extensions } = parsed;
  const notes: ChordNote[] = [];

  // Grundton immer enthalten
  notes.push({
    note: root,
    interval: getIntervalName(0),
    semitones: 0,
  });

  // Intervalle abhängig von der Akkordqualität
  switch (quality) {
    case "major":
    case "major7":
      notes.push(transpose(root, 4)); // große Terz
      notes.push(transpose(root, 7)); // Quinte
      break;
    case "minor":
    case "minor7":
      notes.push(transpose(root, 3)); // kleine Terz
      notes.push(transpose(root, 7)); // Quinte
      break;
    case "dominant":
      notes.push(transpose(root, 4)); // große Terz
      notes.push(transpose(root, 7)); // Quinte
      break;
    case "diminished":
      notes.push(transpose(root, 3)); // kleine Terz
      notes.push(transpose(root, 6)); // verminderte Quinte
      break;
    case "half-diminished":
      notes.push(transpose(root, 3)); // kleine Terz
      notes.push(transpose(root, 6)); // verminderte Quinte
      break;
    case "augmented":
      notes.push(transpose(root, 4)); // große Terz
      notes.push(transpose(root, 8)); // übermäßige Quinte
      break;
    case "sus2":
      notes.push(transpose(root, 2)); // große Sekunde
      notes.push(transpose(root, 7)); // Quinte
      break;
    case "sus4":
      notes.push(transpose(root, 5)); // Quarte
      notes.push(transpose(root, 7)); // Quinte
      break;
    default:
      // fallback
      notes.push(transpose(root, 4));
      notes.push(transpose(root, 7));
      break;
  }

  // Septime (falls vorhanden)
  if (hasSeventh) {
    switch (quality) {
      case "major7":
        notes.push(transpose(root, 11)); // große Septime
        break;
      case "minor7":
        notes.push(transpose(root, 10)); // kleine Septime
        break;
      case "dominant":
        notes.push(transpose(root, 10)); // kleine Septime
        break;
      case "half-diminished":
        notes.push(transpose(root, 10)); // kleine Septime
        break;
      case "diminished":
        notes.push(transpose(root, 9)); // verminderte Septime
        break;
      case "augmented":
        notes.push(transpose(root, 11)); // große Septime
        break;
      default:
        // Für andere Qualitäten keine Septime hinzufügen
        break;
    }
  }

  // Extensions (9, 11, 13)
  extensions.forEach((ext) => {
    switch (ext) {
      case 9:
        notes.push(transpose(root, 14)); // 9. Stufe = große Sekunde + Oktave
        break;
      case 11:
        notes.push(transpose(root, 17)); // 11. Stufe = Quarte + Oktave
        break;
      case 13:
        notes.push(transpose(root, 21)); // 13. Stufe = große Sexte + Oktave
        break;
    }
  });

  return notes;
}

function getIntervalName(semitones: number): string {
  const intervalMap: { [semitone: number]: string } = {
    // Grundstufe und einfache Intervalle
    0: "Root",
    1: "♭2",
    2: "2",
    3: "♭3",
    4: "3",
    5: "4",
    6: "♭5",
    7: "5",
    8: "♯5 / ♭6", // Enharmonisch
    9: "6",
    10: "♭7",
    11: "7",

    // Erweiterungen ab Oktave
    12: "Octave",

    13: "♭9",
    14: "9",
    15: "♯9",
    16: "11",
    17: "♯11",
    18: "♭12 (selten)", // keine echte Extension, aber theoretisch korrekt
    19: "12 (selten)", // theoretisch, kaum verwendet
    20: "♭13",
    21: "13",
    22: "♯13",
    23: "Major 7th + 13", // keine übliche Bezeichnung
    24: "Double Octave",
  };
  // Modulo 24, damit auch sehr hohe Werte korrekt aufgelöst werden
  const normalized = semitones % 24;

  return intervalMap[normalized] || `${semitones}`;
}

export function stringifyChord(chord: ParsedChord): string {
  const { root, quality, extensions, hasSeventh } = chord;

  let suffix = "";

  switch (quality) {
    case "major":
      // add9 ohne 7
      if (extensions.includes(9) && !hasSeventh) {
        suffix = "add9";
      }
      break;
    case "major7":
      suffix = "maj7";
      break;
    case "minor":
      suffix = "m";
      if (extensions.includes(9) && !hasSeventh) {
        suffix = "madd9";
      }
      break;
    case "minor7":
      suffix = "m7";
      break;
    case "dominant":
      suffix = "7";
      break;
    case "diminished":
      suffix = "dim";
      if (hasSeventh) {
        suffix = "dim7"; // verminderter Septakkord
      }
      break;
    case "half-diminished":
      if (hasSeventh) {
        suffix = "m7b5"; // diminierte Septakkorde
      } else {
        suffix = "dim";
      }
      break;
    case "augmented":
      suffix = "aug";
      break;
    case "sus2":
      suffix = "sus2";
      break;
    case "sus4":
      suffix = "sus4";
      break;
    default:
      suffix = "";
  }

  // Erweiterung kombinieren (z. B. C7 + 9 + 13 → C13)
  if (extensions.includes(13)) {
    suffix = suffix.replace(/7|maj7|m7|m/, ""); // Basis löschen
    suffix += "13";
  } else if (extensions.includes(11)) {
    suffix = suffix.replace(/7|maj7|m7|m/, "");
    suffix += "11";
  } else if (extensions.includes(9)) {
    if (!suffix.includes("9")) suffix += "9";
  }

  return root + suffix;
}
