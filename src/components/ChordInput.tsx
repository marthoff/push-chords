import React, { useState } from "react";
import { usePushChordStore } from "../store/pushChordStore";
import ChordDisplay from "./ChordDisplay";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";

const ChordInput: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const parseChord = usePushChordStore((state) => state.parseChord);

  const [isShowInfo, setIsShowInfo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    parseChord(e.target.value);
  };

  return (
    <div className="chord-input-container p-2">
      <form className="chord-input-form" onSubmit={(e) => e.preventDefault()}>
        <label
          htmlFor="chord-input"
          className="hidden text-sm/6 font-medium text-gray-200 md:block"
        >
          Enter chord (e.g. Cmaj7, Am9, G13)
        </label>
        <div className="mt-2 flex">
          <input
            name="chord-input"
            id="chord-input"
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter chord (e.g. Cmaj7, Am9, G13)"
            className="col-start-1 row-start-1 block w-full rounded-l-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-3 sm:text-sm/6"
          />
          <button
            onClick={() => setIsShowInfo(!isShowInfo)}
            type="button"
            className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          >
            <QuestionMarkCircleIcon
              aria-hidden="true"
              className="-ml-0.5 size-4 text-gray-400"
            />
          </button>
        </div>
        {isShowInfo && (
          <div className="text-gray-200">
            <ChordDisplay />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChordInput;
