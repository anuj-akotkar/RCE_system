import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { fetchQuestionBoilerplate } from "../../../services/operations/questionAPI";

// ✅ CORRECTED: Props are cleaned up.
const CodeEditor = ({ onRun, onSubmit, loading, questionName, questionId, contestId, contestName, token }) => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [isLoadingBoilerplate, setIsLoadingBoilerplate] = useState(false);

  const defaultCodeTemplates = {
    cpp: `#include<iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
    python: `# Write your code here\nprint("Hello, World!")`,
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`
  };

  useEffect(() => {
    const fetchBoilerplate = async () => {
      if (!contestName || !questionName || !token || !questionId || !contestId) {
        setCode(defaultCodeTemplates[language]);
        return;
      }

      setIsLoadingBoilerplate(true);
      try {
        const boilerplateData = await fetchQuestionBoilerplate(questionId, language, token, contestId, contestName, questionName);
        if (boilerplateData) {
          setCode(boilerplateData);
        } else {
          setCode(defaultCodeTemplates[language]);
        }
      } catch (error) {
        console.error("Failed to fetch boilerplate:", error);
        setCode(defaultCodeTemplates[language]);
      } finally {
        setIsLoadingBoilerplate(false);
      }
    };

    fetchBoilerplate();
  }, [questionId, language, token, contestId, contestName, questionName]);

  const mapLang = {
    cpp: "cpp",
    python: "python",
    java: "java",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 p-1 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          disabled={isLoadingBoilerplate}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        {isLoadingBoilerplate && (
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading boilerplate...</span>
        )}
      </div>

      <div className="flex-grow border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language={mapLang[language]}
          value={code}
          onChange={(value) => setCode(value)}
          loading={isLoadingBoilerplate ? "Loading boilerplate..." : "Loading Editor..."}
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onRun(code, language)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || isLoadingBoilerplate}
        >
          Run
        </button>
        <button
          onClick={() => onSubmit(code, language)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || isLoadingBoilerplate}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
