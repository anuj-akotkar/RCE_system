import React from "react";

const OutputPanel = ({ output }) => {
  if (!output) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow text-sm">
      <h2 className="text-lg font-semibold mb-2">Output</h2>

      {output.success ? (
        <div className="text-green-600">
          {output?.results?.map((res, i) => (
            <div key={i} className="mb-1">
              ✅ Test Case {res.testCase}: {res.passed ? "Passed" : "Failed"}
              {!res.passed && (
                <div className="text-red-500 ml-2">
                  <strong>Expected:</strong> {res.expected} <br />
                  <strong>Got:</strong> {res.output}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-red-600">
          ❌ {output.error || "Something went wrong"}
        </div>
      )}
    </div>
  );
};

export default OutputPanel;
