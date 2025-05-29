import React from "react";

const QuestionPanel = ({ questions, selected, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Questions</h2>
      <ul className="space-y-2">
        {questions.map((q, index) => (
          <li
            key={q._id}
            onClick={() => onSelect(q)}
            className={`cursor-pointer p-2 rounded-md border 
              ${selected?._id === q._id ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"}`}
          >
            Q{index + 1}. {q.title}
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-1">{selected.title}</h3>
          <p className="text-sm text-gray-700 mb-2">{selected.description}</p>
          <p className="text-xs text-gray-500 italic">
            <strong>Sample Input:</strong> <br /> {selected.publicTestCases?.[0]?.input || "N/A"}
          </p>
          <p className="text-xs text-gray-500 italic">
            <strong>Expected Output:</strong> <br /> {selected.publicTestCases?.[0]?.output || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
