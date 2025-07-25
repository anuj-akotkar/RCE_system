import React, { useState } from "react";
import SubmissionHistory from "./SubmissionHistory";

const QuestionPanel = ({ questions, selected, onSelect }) => {
  const [showSubmissions, setShowSubmissions] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-200 text-green-800';
      case 'Medium': return 'bg-yellow-200 text-yellow-800';
      case 'Hard': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full overflow-y-auto">
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
      
      <ul className="space-y-3 mb-6">
        {questions.map((q, index) => (
          <li
            key={q._id}
            onClick={() => onSelect(q)}
            className={`cursor-pointer p-4 rounded-lg border-2 font-medium transition-all hover:shadow-md
              ${selected?._id === q._id
                ? "bg-blue-50 border-blue-500 text-blue-900 shadow-md"
                : "hover:bg-gray-50 border-gray-200 text-gray-800"}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Q{index + 1}. {q.title}</span>
                  {q.difficulty && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 space-x-3">
                  {q.functionName && <span>Function: {q.functionName}</span>}
                  {q.memoryLimitMB && <span>Memory: {q.memoryLimitMB}MB</span>}
                  {q.timeLimitSec && <span>Time: {q.timeLimitSec}s</span>}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="border-t pt-4">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-blue-700">{selected.title}</h3>
              {selected.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selected.difficulty)}`}>
                  {selected.difficulty}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.memoryLimitMB && (
                <span className="inline-block bg-purple-100 text-purple-800 font-medium px-3 py-1 rounded-full text-sm">
                  Memory: {selected.memoryLimitMB}MB
                </span>
              )}
              {selected.timeLimitSec && (
                <span className="inline-block bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm">
                  Time: {selected.timeLimitSec}s
                </span>
              )}
            </div>
          </div>

          {/* Problem Description */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Problem Description</h4>
            <p className="text-sm text-gray-700 mb-3 whitespace-pre-line leading-relaxed">
              {selected.description}
            </p>
          </div>

          {/* Constraints */}
          {selected.constraints && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Constraints</h4>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {selected.constraints}
                </p>
              </div>
            </div>
          )}

          {/* Function Structure */}
          {selected.functionName && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Function Structure</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-600">Function Name:</span>
                  <span className="ml-2 font-mono text-blue-600 font-semibold">{selected.functionName}</span>
                </div>
                
                {selected.inputFields && selected.inputFields.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">Input Parameters:</span>
                    <div className="ml-2 space-y-1">
                      {selected.inputFields.map((field, i) => (
                        <div key={i} className="font-mono text-sm text-gray-700">
                          <span className="text-blue-600">{selected.inputTypes?.[i] || 'unknown'}</span> {field}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selected.outputFields && selected.outputFields.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Output Parameters:</span>
                    <div className="ml-2 space-y-1">
                      {selected.outputFields.map((field, i) => (
                        <div key={i} className="font-mono text-sm text-gray-700">
                          <span className="text-green-600">{selected.outputTypes?.[i] || 'unknown'}</span> {field}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sample Test Cases */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-blue-800 mb-3">Sample Test Cases</h4>
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-medium text-blue-700 mb-2">Example {i + 1}</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-blue-700 text-sm">Input:</span>
                      <div className="bg-white mt-1 p-2 rounded border border-blue-200">
                        <code className="text-sm text-gray-800 whitespace-pre-wrap">
                          {selected.sampleInputs?.[i] || "N/A"}
                        </code>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-green-700 text-sm">Output:</span>
                      <div className="bg-white mt-1 p-2 rounded border border-green-200">
                        <code className="text-sm text-gray-800 whitespace-pre-wrap">
                          {selected.sampleOutputs?.[i] || "N/A"}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
            <div className="flex justify-between items-center">
              <span>
                Test Cases: {selected.testCases?.length || 0} 
                {selected.testCases && (
                  <span className="ml-2">
                    (Public: {selected.testCases.filter(tc => tc.isPublic).length})
                  </span>
                )}
              </span>
              <span>ID: {selected._id?.slice(-8)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submission History Modal */}
      <SubmissionHistory
        questionId={selected?._id}
        isOpen={showSubmissions}
        onClose={() => setShowSubmissions(false)}
      />
    </div>
  );
};

export default QuestionPanel;