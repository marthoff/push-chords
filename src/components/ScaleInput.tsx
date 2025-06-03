import { usePushChordStore } from "../store/pushChordStore";
import type { ScaleType } from "../types";

export const ScaleInput: React.FC = () => {
    const scaleRoot = usePushChordStore((state) => state.scaleRoot);
    const setScaleRoot = usePushChordStore((state) => state.setScaleRoot);
    const scaleType = usePushChordStore((state) => state.scaleType);
    const setScaleType = usePushChordStore((state) => state.setScaleType);
    const chromaticMode = usePushChordStore((state) => state.chromaticMode);
    const setChromaticMode = usePushChordStore((state) => state.setChromaticMode);
    return (<div className="scale-controls">
        <>
            <select
                value={scaleRoot}
                onChange={(e) => setScaleRoot(e.target.value)}
                className="root-select"
            >
                {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                    <option key={note} value={note}>{note}</option>
                ))}
            </select>
            <select
                value={scaleType}
                onChange={(e) => setScaleType(e.target.value as ScaleType)}
                className="scale-type-select"
            >
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
                <option value="Chromatic">Chromatic</option>
            </select>
            <label className="chromatic-mode">
                <input
                    type="checkbox"
                    checked={chromaticMode}
                    onChange={(e) => setChromaticMode(e.target.checked)}
                />
                Chromatic Mode
            </label>
        </>
    </div>);
};