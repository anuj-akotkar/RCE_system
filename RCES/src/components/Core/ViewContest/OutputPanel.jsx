import React from "react";

const OutputPanel = ({ output }) => {
  if (!output) return null;

  const formatTime = (time) => {
    const t = parseFloat(time);
    return t ? `${t}s` : '0s';
  };

  const formatMemory = (memory) => {
    const m = parseInt(memory);
    return m ? `${m} KB` : '0 KB';
  };

  return (
    <div className="bg-black p-4 rounded-lg shadow text-pure-greys-400 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2 text-white">Output</h2>

      {output.success ? (
        <div>
          {/* Sample Test Results */}
          {output.results && Array.isArray(output.results) && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2 text-yellow-400">Sample Test Cases</h3>
              {output.results.map((res, i) => (
                <div key={i} className="mb-3 p-2 border border-gray-600 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={res.passed ? "text-green-400" : "text-red-400"}>
                      {res.passed ? "✅" : "❌"}
                    </span>
                    <span className="text-white">Test Case {i + 1}</span>
                    <span className={res.passed ? "text-green-400" : "text-red-400"}>
                      ({res.passed ? "Passed" : "Failed"})
                    </span>
                  </div>
                  
                  <div className="ml-4 text-sm">
                    <div><strong>Input:</strong> <span className="text-blue-300">{res.input}</span></div>
                    <div><strong>Expected:</strong> <span className="text-green-300">{res.expectedOutput}</span></div>
                    <div><strong>Got:</strong> <span className={res.passed ? "text-green-300" : "text-red-300"}>{res.output || res.actualOutput}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submission Results */}
          {output.submission && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2 text-green-400">Submission Results</h3>
              <div className="p-3 border border-gray-600 rounded bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Status:</span>
                  <span className={`font-bold ${
                    output.submission.status === 'Accepted' ? 'text-green-400' : 
                    output.submission.status === 'Wrong Answer' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {output.submission.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">Passed Tests:</span>
                    <span className="ml-2 text-white">{output.submission.passedTests}/{output.submission.totalTests}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Execution Time:</span>
                    <span className="ml-2 text-white">{formatTime(output.submission.totalExecutionTime)}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Memory:</span>
                    <span className="ml-2 text-white">{formatMemory(output.submission.maxMemory)}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Submission ID:</span>
                    <span className="ml-2 text-blue-300 font-mono text-xs">{output.submission.id}</span>
                  </div>
                </div>

                {/* Detailed Test Case Results */}
                {output.submission.results && output.submission.results.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-yellow-400">Test Case Details</h4>
                    <div className="max-h-40 overflow-y-auto">
                      {output.submission.results.map((res, i) => (
                        <div key={i} className="mb-2 p-2 border border-gray-700 rounded text-xs">
                          <div className="flex justify-between items-center">
                            <span className={res.passed ? "text-green-400" : "text-red-400"}>
                              Test {res.testCase}: {res.passed ? "PASS" : "FAIL"}
                            </span>
                            <div className="text-gray-400">
                              {formatTime(res.executionTime)} | {formatMemory(res.memory)}
                            </div>
                          </div>
                          {!res.passed && (
                            <div className="mt-1 text-gray-300">
                              <div>Expected: <span className="text-green-300">{res.expectedOutput}</span></div>
                              <div>Got: <span className="text-red-300">{res.actualOutput}</span></div>
                              {res.status && res.status !== 'Unknown' && (
                                <div>Status: <span className="text-yellow-300">{res.status}</span></div>
                              )}
                              {res.error && (
                                <div>Error: <span className="text-red-300">{res.error}</span></div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 border border-red-600 rounded bg-red-900 bg-opacity-20">
          <div className="text-red-400 font-medium">❌ Execution Failed</div>
          <div className="text-red-300 mt-1">{output.error || output.message || "Something went wrong"}</div>
        </div>
      )}
    </div>
  );
};

export default OutputPanel;