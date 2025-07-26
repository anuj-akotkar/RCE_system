import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { fetchQuestionBoilerplate } from "../../../services/operations/questionAPI";

const CodeEditor = ({ language, setLanguage, onRun, onSubmit, loading, questionName, questionId, contestId, contestName, token }) => {
  //console.log("CodeEditor props:", { language, questionId, questionName, contestId, contestName, token });
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
  const [isLoadingBoilerplate, setIsLoadingBoilerplate] = useState(false);

  // Fetch boilerplate code when questionId or language changes
  useEffect(() => {
    const fetchBoilerplate = async () => {
      if (!contestName ||!questionName || !token || !questionId || !contestId) {
        // Fallback to default templates if no questionId or token
        setCode(defaultCodeTemplates[language]);
        return;
      }

      setIsLoadingBoilerplate(true);
      try {
        const boilerplateData = await fetchQuestionBoilerplate(questionId, language, token, contestId, contestName,questionName);
        console.log("Boilerplate data:", boilerplateData);
        if (boilerplateData) {
          setCode(boilerplateData);
        } else {
          // Fallback to default template if no boilerplate found
          setCode(defaultCodeTemplates[language]);
        }
      } catch (error) {
        console.error("Failed to fetch boilerplate:", error);
        // Fallback to default template on error
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
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between mb-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-1 rounded"
          disabled={isLoadingBoilerplate}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        {isLoadingBoilerplate && (
          <span className="text-sm text-gray-500">Loading boilerplate...</span>
        )}
      </div>

      <Editor
        height="400px"
        theme="vs-dark"
        language={mapLang[language]}
        value={code}
        onChange={(value) => setCode(value)}
        className="border rounded"
        loading={isLoadingBoilerplate ? "Loading boilerplate..." : undefined}
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onRun(code)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          disabled={loading || isLoadingBoilerplate}
        >
          Run
        </button>
        <button
          onClick={() => onSubmit(code)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading || isLoadingBoilerplate}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;  