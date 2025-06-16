import React from 'react';
import { Field, Label, Switch } from "@headlessui/react";
import { usePushChordStore } from "../store/pushChordStore";
import type { ScaleType } from "../types";

export const ScaleSection: React.FC = () => {
  const scaleRoot = usePushChordStore((state) => state.scaleRoot);
  const setScaleRoot = usePushChordStore((state) => state.setScaleRoot);
  const scaleType = usePushChordStore((state) => state.scaleType);
  const setScaleType = usePushChordStore((state) => state.setScaleType);
  const chromaticMode = usePushChordStore((state) => state.chromaticMode);
  const setChromaticMode = usePushChordStore((state) => state.setChromaticMode);

  const notes = [
    "C", "C#", "D", "D#", "E", "F", 
    "F#", "G", "G#", "A", "A#", "B"
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Scale Settings</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="scale-root-select"
              className="block text-sm font-medium text-white mb-2"
            >
              Root Note
            </label>
            <select
              id="scale-root-select"
              name="scale-root-select"
              value={scaleRoot}
              onChange={(e) => setScaleRoot(e.target.value)}
              className="w-full bg-white text-black px-3 py-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
            >
              {notes.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="scale-type-select"
              className="block text-sm font-medium text-white mb-2"
            >
              Scale Type
            </label>
            <select
              id="scale-type-select"
              name="scale-type-select"
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value as ScaleType)}
              className="w-full bg-white text-black px-3 py-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
            >
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
          </div>
        </div>

        <div>
          <Field className="flex items-center justify-between p-4 bg-gray-900 rounded-md border border-gray-700">
            <div className="flex flex-col">
              <Label as="span" className="text-sm font-medium text-white">
                Chromatic Mode
              </Label>
              <span className="text-xs text-gray-400 mt-1">
                Display all notes in chromatic scale
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-300">
                {chromaticMode ? 'On' : 'Off'}
              </span>
              <Switch
                checked={chromaticMode}
                onChange={setChromaticMode}
                className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-600 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-hidden data-checked:bg-white"
              >
                <span className="sr-only">Chromatic Mode</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5 group-data-checked:bg-black"
                />
              </Switch>
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
};