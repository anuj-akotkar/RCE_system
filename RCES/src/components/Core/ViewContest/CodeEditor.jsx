import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, setLanguage, onRun, onSubmit, loading }) => {
  const defaultCodeTemplates = {
    cpp: `#include<iostream>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`,
    python: `# Write your code here
print("Hello, World!")`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // your code here
    }
}`
  };

  const [code, setCode] = useState(defaultCodeTemplates[language]);

  // Update code whenever language changes
  useEffect(() => {
    setCode(defaultCodeTemplates[language]);
  }, [language]);

  const mapLang = {
    cpp: "cpp",
    python: "python",
    java: "java",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between mb-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <Editor
        height="400px"
        theme="vs-dark"
        language={mapLang[language]}
        value={code}
        onChange={(value) => setCode(value)}
        className="border rounded"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onRun(code)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Run
        </button>
        <button
          onClick={() => onSubmit(code)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
