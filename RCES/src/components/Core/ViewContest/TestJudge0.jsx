import React, { useState } from 'react';
import { judge0Run } from '../../../services/operations/judge0API';

const TestJudge0 = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testJudge0 = async () => {
    setLoading(true);
    try {
      const testCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from Judge0!" << endl;
    return 0;
}`;
      
      const response = await judge0Run({
        source_code: testCode,
        language_id: 54, // C++
        stdin: ""
      });
      
      setResult(response);
      console.log("Test result:", response);
    } catch (error) {
      console.error("Test error:", error);
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Judge0 Integration Test</h3>
      <button 
        onClick={testJudge0}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Testing..." : "Test Judge0"}
      </button>
      
      {result && (
        <div className="mt-4">
          <h4 className="font-semibold">Result:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestJudge0;