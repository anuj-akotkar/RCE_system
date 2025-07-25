import React from "react";

const OutputPanel = ({ output }) => {
  if (!output) return null;

  const getResultsArray = () => {
    // For /code/run response -> { success, results: [] }
    if (Array.isArray(output?.results)) {
      return output.results;
    }

    // For /code/submit response -> { success, submission: { results: [] } }
    if (output?.submission && Array.isArray(output.submission.results)) {
      return output.submission.results;
    }

    return [];
  };

  const results = getResultsArray();

  return (
    <div className="bg-black p-4 rounded-lg shadow text-pure-greys-400 h-full">
      <h2 className="text-lg font-semibold mb-2">Output</h2>

      {output?.success ? (
        <div>
          {results.length === 0 && <div>No results available</div>}
          {results.map((res, i) => {
            const passed = res.passed;
            // Determine expected/actual field names based on response structure
            const expected = res.expectedOutput ?? res.expected;
            const actual = res.actualOutput ?? res.output;

            return (
              <div key={i} className="mb-1">
                {passed ? "✅" : "❌"} Test Case {res.testCase ?? i + 1}: {passed ? "Passed" : "Failed"}
                {!passed && (
                  <div className="ml-2">
                    <strong>Expected:</strong> {expected} <br />
                    <strong>Got:</strong> {actual}
                  </div>
                )}
              </div>
            );
          })}

          {/* Show aggregate stats if available (submission response) */}
          {output?.submission && (
            <div className="mt-2 text-sm">
              <div>Total Tests: {output.submission.totalTests}</div>
              <div>Passed Tests: {output.submission.passedTests}</div>
              <div>Execution Time: {output.submission.totalExecutionTime}s</div>
              <div>Max Memory: {output.submission.maxMemory} KB</div>
            </div>
          )}
        </div>
      ) : (
        <div>❌ {output?.error || "Something went wrong"}</div>
      )}
    </div>
  );
};

export default OutputPanel;