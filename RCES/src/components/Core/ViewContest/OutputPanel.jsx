// Enhanced OutputPanel.jsx for Judge0 Integration
import React, { useState } from "react";
import { FaCheck, FaTimes, FaClock, FaMemory, FaCode, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";

const OutputPanel = ({ output }) => {
  const [showHiddenTests, setShowHiddenTests] = useState(false);

  if (!output) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow text-gray-400 h-full">
        <h2 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
          <FaCode />
          Output
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p>Run or submit your code to see results here</p>
        </div>
      </div>
    );
  }

  const formatTime = (time) => {
    const t = parseFloat(time);
    return t ? `${t.toFixed(3)}s` : "0.000s";
  };

  const formatMemory = (memory) => {
    const m = parseInt(memory);
    if (m >= 1024) {
      return `${(m / 1024).toFixed(2)} MB`;
    }
    return m ? `${m} KB` : "0 KB";
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase().includes('accepted') || status?.toLowerCase().includes('success')) {
      return 'text-green-400';
    } else if (status?.toLowerCase().includes('wrong') || status?.toLowerCase().includes('failed')) {
      return 'text-red-400';
    } else if (status?.toLowerCase().includes('time') || status?.toLowerCase().includes('runtime')) {
      return 'text-yellow-400';
    }
    return 'text-gray-400';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow text-gray-400 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <FaCode />
        Execution Results
      </h2>

      {output.success ? (
        <div className="space-y-4">
          {/* Custom Input Result */}
          {output.customResult && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-3 text-blue-400 flex items-center gap-2">
                <FaCode />
                Custom Input Result
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-yellow-400" />
                    <span>Execution Time: {formatTime(output.customResult.executionTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMemory className="text-purple-400" />
                    <span>Memory: {formatMemory(output.customResult.memory)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getStatusColor(output.customResult.status)}`}>
                      Status: {output.customResult.status}
                    </span>
                  </div>
                  <div className="text-gray-300">
                    Exit Code: {output.customResult.exitCode}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-blue-300 font-medium">Input:</span>
                    <div className="bg-gray-900 p-2 rounded mt-1">
                      <pre className="text-blue-200 text-sm whitespace-pre-wrap overflow-x-auto">
                        {output.customResult.input || "(empty)"}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <span className="text-green-300 font-medium">Output:</span>
                    <div className="bg-gray-900 p-2 rounded mt-1">
                      <pre className="text-green-200 text-sm whitespace-pre-wrap overflow-x-auto">
                        {output.customResult.output || "(no output)"}
                      </pre>
                    </div>
                  </div>
                  {output.customResult.stderr && (
                    <div>
                      <span className="text-red-300 font-medium">Error Output:</span>
                      <div className="bg-gray-900 p-2 rounded mt-1">
                        <pre className="text-red-200 text-sm whitespace-pre-wrap overflow-x-auto">
                          {output.customResult.stderr}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Test Case Results */}
          {output.results && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium text-green-400 flex items-center gap-2">
                  {output.results.allPassed ? <FaCheck /> : <FaTimes />}
                  Test Case Results
                </h3>
                <div className="text-sm text-gray-300">
                  {output.results.passedTests}/{output.results.totalTests} passed
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div className="bg-gray-600 p-2 rounded text-center">
                  <div className="font-medium text-white">{output.results.passedTests}</div>
                  <div className="text-green-400">Passed</div>
                </div>
                <div className="bg-gray-600 p-2 rounded text-center">
                  <div className="font-medium text-white">{output.results.totalTests - output.results.passedTests}</div>
                  <div className="text-red-400">Failed</div>
                </div>
                <div className="bg-gray-600 p-2 rounded text-center">
                  <div className="font-medium text-white">
                    {Math.round((output.results.passedTests / output.results.totalTests) * 100)}%
                  </div>
                  <div className="text-blue-400">Score</div>
                </div>
                <div className="bg-gray-600 p-2 rounded text-center">
                  <div className="font-medium text-white">{output.results.totalTests}</div>
                  <div className="text-gray-400">Total</div>
                </div>
              </div>

              {/* Test Cases */}
              <div className="space-y-2">
                {output.results.testResults && output.results.testResults.map((result, index) => {
                  const isHidden = !result.isPublic;
                  const shouldShow = !isHidden || showHiddenTests || !result.passed;

                  if (!shouldShow) {
                    return (
                      <div key={index} className="bg-gray-600 p-3 rounded flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={result.passed ? "text-green-400" : "text-red-400"}>
                            {result.passed ? <FaCheck /> : <FaTimes />}
                          </span>
                          <span className="text-white font-medium">Test Case {result.testCase}</span>
                          <span className="text-yellow-400 text-xs">(Hidden)</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span>{formatTime(result.executionTime)}</span>
                          <span>{formatMemory(result.memory)}</span>
                          <span className={result.passed ? "text-green-400" : "text-red-400"}>
                            {result.passed ? "PASS" : "FAIL"}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="bg-gray-600 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className={result.passed ? "text-green-400" : "text-red-400"}>
                            {result.passed ? <FaCheck /> : <FaTimes />}
                          </span>
                          <span className="text-white font-medium">Test Case {result.testCase}</span>
                          {isHidden && <span className="text-yellow-400 text-xs">(Hidden)</span>}
                          <span className={result.passed ? "text-green-400" : "text-red-400"}>
                            {result.passed ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <FaClock />
                            {formatTime(result.executionTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaMemory />
                            {formatMemory(result.memory)}
                          </div>
                        </div>
                      </div>

                      {result.input !== undefined && (
                        <div className="mt-2 space-y-2 text-sm">
                          <div>
                            <span className="text-blue-300 font-medium">Input:</span>
                            <div className="bg-gray-900 p-2 rounded mt-1">
                              <pre className="text-blue-200 whitespace-pre-wrap overflow-x-auto">
                                {result.input}
                              </pre>
                            </div>
                          </div>
                          <div>
                            <span className="text-green-300 font-medium">Expected:</span>
                            <div className="bg-gray-900 p-2 rounded mt-1">
                              <pre className="text-green-200 whitespace-pre-wrap overflow-x-auto">
                                {result.expectedOutput}
                              </pre>
                            </div>
                          </div>
                          <div>
                            <span className="text-yellow-300 font-medium">Got:</span>
                            <div className="bg-gray-900 p-2 rounded mt-1">
                              <pre className={`whitespace-pre-wrap overflow-x-auto ${
                                result.passed ? "text-green-200" : "text-red-200"
                              }`}>
                                {result.actualOutput || "(no output)"}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.stderr && (
                        <div className="mt-2">
                          <span className="text-red-300 font-medium text-sm">Runtime Error:</span>
                          <div className="bg-gray-900 p-2 rounded mt-1">
                            <pre className="text-red-200 text-sm whitespace-pre-wrap overflow-x-auto">
                              {result.stderr}
                            </pre>
                          </div>
                        </div>
                      )}

                      {result.compileOutput && (
                        <div className="mt-2">
                          <span className="text-orange-300 font-medium text-sm">Compile Output:</span>
                          <div className="bg-gray-900 p-2 rounded mt-1">
                            <pre className="text-orange-200 text-sm whitespace-pre-wrap overflow-x-auto">
                              {result.compileOutput}
                            </pre>
                          </div>
                        </div>
                      )}

                      {result.error && (
                        <div className="mt-2">
                          <span className="text-red-300 font-medium text-sm">Error:</span>
                          <div className="bg-gray-900 p-2 rounded mt-1">
                            <pre className="text-red-200 text-sm whitespace-pre-wrap overflow-x-auto">
                              {result.error}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Toggle for hidden test cases */}
                {output.results.testResults?.some(r => !r.isPublic) && (
                  <button
                    onClick={() => setShowHiddenTests(!showHiddenTests)}
                    className="w-full bg-gray-600 hover:bg-gray-500 p-2 rounded flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {showHiddenTests ? <FaEyeSlash /> : <FaEye />}
                    {showHiddenTests ? "Hide" : "Show"} Hidden Test Cases
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Submission Results */}
          {output.submission && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-3 text-purple-400 flex items-center gap-2">
                <FaCheck />
                Final Submission Result
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Status:</span>
                  <span className={`font-bold text-lg ${getStatusColor(output.submission.status)}`}>
                    {output.submission.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">Tests Passed:</span>
                    <span className="ml-2 text-white font-medium">
                      {output.submission.passedTests}/{output.submission.totalTests}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300">Total Time:</span>
                    <span className="ml-2 text-white font-medium">
                      {formatTime(output.submission.totalExecutionTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300">Max Memory:</span>
                    <span className="ml-2 text-white font-medium">
                      {formatMemory(output.submission.maxMemory * 1024)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300">Submission ID:</span>
                    <span className="ml-2 text-blue-300 font-mono text-xs">
                      {output.submission.id}
                    </span>
                  </div>
                </div>

                {output.submission.status === 'Accepted' && (
                  <div className="bg-green-900 bg-opacity-30 border border-green-500 p-3 rounded flex items-center gap-2">
                    <FaCheck className="text-green-400" />
                    <span className="text-green-300 font-medium">
                      🎉 Solution Accepted! Question completed successfully.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Error Display
        <div className="bg-red-900 bg-opacity-30 border border-red-500 p-4 rounded">
          <div className="flex items-center gap-2 text-red-300 font-medium mb-2">
            <FaExclamationTriangle />
            Execution Failed
          </div>
          <div className="text-red-200">
            {output.error || output.message || "Something went wrong"}
          </div>
          {output.details && (
            <div className="mt-3 bg-gray-900 p-2 rounded">
              <pre className="text-red-200 text-sm whitespace-pre-wrap overflow-x-auto">
                {output.details}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OutputPanel;