import { Field, Label, Switch } from "@headlessui/react";
import { usePushChordStore } from "../store/pushChordStore";
import type { ScaleType } from "../types";

export const ScaleInput: React.FC = () => {
    const scaleRoot = usePushChordStore((state) => state.scaleRoot);
    const setScaleRoot = usePushChordStore((state) => state.setScaleRoot);
    const scaleType = usePushChordStore((state) => state.scaleType);
    const setScaleType = usePushChordStore((state) => state.setScaleType);
    const chromaticMode = usePushChordStore((state) => state.chromaticMode);
    const setChromaticMode = usePushChordStore((state) => state.setChromaticMode);
    return (<div className="p-2 m-2 flex gap-4">
        <>
            <div className="self-start">
                <label htmlFor="scale-root-select"
                    className="block text-sm/6 font-medium text-gray-200">Root</label>
                <select
                    id="scale-root-select"
                    name="scale-root-select"
                    value={scaleRoot}
                    onChange={(e) => setScaleRoot(e.target.value)}
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-xl text-gray-900 placeholder:text-gray-400 
                focus:outline-none 
                bg-gray-200 rounded-sm outline-1 p-2"
                >
                    {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </select>
            </div>
            <div className="self-start">
                <label htmlFor="scale-type-select"
                    className="block text-sm/6 font-medium text-gray-200">Type</label>

                <select
                    id="scale-type-select"
                    name="scale-type-select"
                    value={scaleType}
                    onChange={(e) => setScaleType(e.target.value as ScaleType)}
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-xl text-gray-900 placeholder:text-gray-400 
                focus:outline-none 
                bg-gray-200 rounded-sm outline-1 p-2"
                >
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                    <option value="Chromatic">Chromatic</option>
                </select>
            </div>
            <div className="self-start">
                <Field className="flex items-center flex-col">
                    <Label as="span" className="ml-3 text-sm">
                        <span className="font-medium text-gray-200">Chromatic</span>{' '}
                    </Label>
                    <Switch
                        checked={chromaticMode}
                        onChange={setChromaticMode}
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600">
                        <span className="sr-only">Chromatic Mode</span>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                        />
                    </Switch>

                </Field>
            </div>
        </>
    </div>);
};