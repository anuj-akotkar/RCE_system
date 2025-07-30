import React, { useState } from "react";

const OutputPanel = ({ output }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!output) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
        Run or submit code to see the output here.
      </div>
    );
  }

  // Handle the response from the 'Submit' button
  if (output.submissionId) {
    const isSuccess = output.passedTestCases === output.totalTestCases;
    return (
      <div className={`p-4 rounded-lg shadow h-full overflow-y-auto ${isSuccess ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
        <h2 className={`text-lg font-semibold mb-2 ${isSuccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
          Submission Result
        </h2>
        <div className={`text-2xl font-bold ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {output.status}
        </div>
        <div className="mt-2 text-gray-700 dark:text-gray-300">
          Passed: {output.passedTestCases} / {output.totalTestCases}
        </div>
      </div>
    );
  }

  // Handle the response from the 'Run' button
  if (output.results) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Test Case Results</h2>
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-2">
          {output.results.map((res, index) => {
            const isPassed = res.status === "Accepted";
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === index
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                } ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                Case {index + 1}
              </button>
            );
          })}
        </div>
        <div className="flex-grow overflow-y-auto text-sm">
          {output.results[activeTab] && (
            <div>
              <div className="mb-2">
                <p className="font-semibold text-gray-600 dark:text-gray-300">Input:</p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-1 text-gray-800 dark:text-gray-200">{output.results[activeTab].input}</pre>
              </div>
              <div className="mb-2">
                <p className="font-semibold text-gray-600 dark:text-gray-300">Your Output:</p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-1 text-gray-800 dark:text-gray-200">{output.results[activeTab].actualOutput || '(no output)'}</pre>
              </div>
              <div>
                <p className="font-semibold text-gray-600 dark:text-gray-300">Expected Output:</p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-1 text-gray-800 dark:text-gray-200">{output.results[activeTab].expectedOutput}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle general errors
  return (
    <div className="p-4 rounded-lg shadow h-full overflow-y-auto bg-red-100 dark:bg-red-900">
      <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Error</h2>
      <p className="text-red-700 dark:text-red-300">{output.message || "An unknown error occurred."}</p>
    </div>
  );
};

export default OutputPanel;
