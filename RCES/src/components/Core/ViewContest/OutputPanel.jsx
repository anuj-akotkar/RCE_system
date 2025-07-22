import React from "react";

const OutputPanel = ({ output }) => {
  if (!output) return null;

  return (
    <div className="bg-black p-4 rounded-lg shadow text-pure-greys-400 h-full">
      <h2 className="text-lg font-semibold mb-2">Output</h2>

      {output.success ? (
        <div>
          {output?.results?.map((res, i) => (
            <div key={i} className="mb-1">
              ✅ Test Case {res.testCase}: {res.passed ? "Passed" : "Failed"}
              {!res.passed && (
                <div className="ml-2">
                  <strong>Expected:</strong> {res.expected} <br />
                  <strong>Got:</strong> {res.output}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          ❌ {output.error || "Something went wrong"}
        </div>
      )}
    </div>
  );
};

export default OutputPanel;