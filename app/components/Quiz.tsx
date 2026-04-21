"use client";

import { useState } from "react";

type QuizProps = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export default function Quiz({ question, options, correctIndex, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 my-2">
      <p className="text-sm text-blue-400 font-medium mb-1">Quiz Time!</p>
      <p className="font-medium mb-3">{question}</p>

      <div className="space-y-2">
        {options.map((option, i) => {
          let style = "bg-gray-800 border-gray-700 hover:bg-gray-700";

          if (selected !== null) {
            if (i === correctIndex) {
              style = "bg-green-900 border-green-500";
            } else if (i === selected) {
              style = "bg-red-900 border-red-500";
            } else {
              style = "bg-gray-800 border-gray-700 opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`mt-3 p-3 rounded-lg ${selected === correctIndex ? "bg-green-900/50" : "bg-red-900/50"}`}>
          <p className="font-medium">
            {selected === correctIndex ? "Correct!" : "Not quite!"}
          </p>
          <p className="text-sm text-gray-300 mt-1">{explanation}</p>
        </div>
      )}
    </div>
  );
}