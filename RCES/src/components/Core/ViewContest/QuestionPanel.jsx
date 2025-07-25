import React, { useState } from "react";
import SubmissionHistory from "./SubmissionHistory";

const QuestionPanel = ({ questions, selected, onSelect }) => {
  const [showSubmissions, setShowSubmissions] = useState(false);

  return (
    <div className="bg-black p-4 rounded-lg shadow h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-blue-800 tracking-wide">Questions</h2>
        {selected && (
          <button
            onClick={() => setShowSubmissions(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            View Submissions
          </button>
        )}
      </div>

      <ul className="space-y-2 mb-6">
        {questions.map((q, index) => (
          <li
            key={q._id}
            onClick={() => onSelect(q)}
            className={`cursor-pointer p-3 rounded-md border font-semibold transition
              ${selected?._id === q._id
                ? "bg-blue-100 border-blue-500 text-blue-900 shadow"
                : "hover:bg-blue-50 border-gray-200 text-gray-800"}`}
          >
            Q{index + 1}. {q.title}
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2 text-blue-700">{selected.title}</h3>
          <p className="text-base text-gray-700 mb-4 font-medium whitespace-pre-line">{selected.description}</p>
          <div className="mb-2">
            <span className="inline-block bg-blue-200 text-blue-800 font-semibold px-3 py-1 rounded-full mr-2">
              Difficulty: {selected.difficulty}
            </span>
            <span className="inline-block bg-green-200 text-green-800 font-semibold px-3 py-1 rounded-full mr-2">
              Time: {selected.timeLimitSec || 2}s
            </span>
            <span className="inline-block bg-purple-200 text-purple-800 font-semibold px-3 py-1 rounded-full">
              Memory: {selected.memoryLimitMB || 128}MB
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Sample Inputs & Outputs</h4>
            {[0, 1].map((i) => (
              <div key={i} className="mb-4">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700">Input {i + 1}:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">
                    {selected.sampleInputs?.[i] || "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <span className="font-bold text-green-700">Output {i + 1}:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">
                    {selected.sampleOutputs?.[i] || "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SubmissionHistory
        questionId={selected?._id}
        isOpen={showSubmissions}
        onClose={() => setShowSubmissions(false)}
      />
    </div>
  );
};

export default QuestionPanel;
