import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { runCode, submitCode, checkJudge0Health } from '../../services/codeAPI';
import { apiConnector } from '../../services/apiconnector';
import { questionEndpoints } from '../../services/apis';
import toast from 'react-hot-toast';

const CodeEditor = ({ question, contestId }) => {
  const { token } = useSelector((state) => state.auth);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('problem');
  const [boilerplateLoading, setBoilerplateLoading] = useState(false);
  const [judge0Status, setJudge0Status] = useState(null);

  // Language configuration
  const languages = [
    { value: 'cpp', label: 'C++', monacoLang: 'cpp' },
    { value: 'java', label: 'Java', monacoLang: 'java' },
    { value: 'python', label: 'Python', monacoLang: 'python' }
  ];

  // Fetch boilerplate code when language changes
  useEffect(() => {
    if (question?._id) {
      fetchBoilerplate();
    }
  }, [language, question]);

  // Check Judge0 status on component mount
  useEffect(() => {
    checkJudge0Status();
  }, []);

  const fetchBoilerplate = async () => {
    setBoilerplateLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        `${questionEndpoints.GET_QUESTION_BOILERPLATE_API}/${question._id}/boilerplate/${language}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.data?.success) {
        setCode(response.data.boilerplate.code);
      }
    } catch (error) {
      console.error("Error fetching boilerplate:", error);
      toast.error("Failed to load boilerplate code");
    } finally {
      setBoilerplateLoading(false);
    }
  };

  const checkJudge0Status = async () => {
    try {
      const response = await checkJudge0Health(token);
      setJudge0Status(response.judge0);
      
      if (!response.judge0?.success) {
        toast.error('Judge0 service is not available. Code execution may not work properly.');
      }
    } catch (error) {
      console.error('Error checking Judge0 status:', error);
      setJudge0Status({ success: false, error: 'Failed to check status' });
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    if (!judge0Status?.success) {
      toast.error("Judge0 service is not available. Please try again later.");
      return;
    }

    setLoading(true);
    try {
      const response = await runCode(question._id, language, code, token);
      setResults({
        type: 'run',
        data: response.results
      });
      setActiveTab('results');
    } catch (error) {
      console.error("Run code error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    if (!judge0Status?.success) {
      toast.error("Judge0 service is not available. Please try again later.");
      return;
    }

    setLoading(true);
    try {
      const response = await submitCode(question._id, language, code, token);
      setResults({
        type: 'submit',
        data: response.submission
      });
      setActiveTab('results');
    } catch (error) {
      console.error("Submit code error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">{question?.title}</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || boilerplateLoading}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          {/* Judge0 Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              judge0Status?.success ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-xs text-gray-300">
              {judge0Status?.success ? 'Judge0 Online' : 'Judge0 Offline'}
            </span>
          </div>
          
          <button
            onClick={handleRunCode}
            disabled={loading || !judge0Status?.success}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && results?.type !== 'submit' ? 'Running...' : 'Run Code'}
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={loading || !judge0Status?.success}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && results?.type === 'submit' ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Problem/Results */}
        <div className="w-1/2 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'problem'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'results'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Results
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'problem' ? (
              <div className="text-gray-300">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="whitespace-pre-wrap">{question?.description}</p>
                </div>

                {question?.constraints && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
                    <p className="whitespace-pre-wrap">{question.constraints}</p>
                  </div>
                )}

                {question?.sampleInputs?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Sample Test Cases</h3>
                    {question.sampleInputs.map((input, index) => (
                      <div key={index} className="mb-4 bg-gray-700 p-3 rounded-md">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-400">Input:</span>
                          <pre className="mt-1 text-sm bg-gray-800 p-2 rounded">{input}</pre>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-400">Output:</span>
                          <pre className="mt-1 text-sm bg-gray-800 p-2 rounded">
                            {question.sampleOutputs[index]}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <ResultsPanel results={results} />
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {boilerplateLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-400">Loading boilerplate...</div>
            </div>
          ) : (
            <Editor
              height="100%"
              language={languages.find(l => l.value === language)?.monacoLang}
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Results Panel Component
const ResultsPanel = ({ results }) => {
  if (!results) {
    return (
      <div className="text-gray-400 text-center py-8">
        Run your code to see results here
      </div>
    );
  }

  if (results.type === 'run') {
    return (
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Sample Test Results</h3>
        {results.data.map((result, index) => (
          <div key={index} className="mb-4 bg-gray-700 p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">Test Case {result.testCase}</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                result.passed 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {result.passed ? 'Passed' : 'Failed'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Input:</span>
                <pre className="mt-1 bg-gray-800 p-2 rounded overflow-x-auto">{result.input}</pre>
              </div>
              <div>
                <span className="text-gray-400">Expected Output:</span>
                <pre className="mt-1 bg-gray-800 p-2 rounded overflow-x-auto">{result.expectedOutput}</pre>
              </div>
              <div>
                <span className="text-gray-400">Your Output:</span>
                <pre className="mt-1 bg-gray-800 p-2 rounded overflow-x-auto">{result.output || 'No output'}</pre>
              </div>
              {result.error && (
                <div>
                  <span className="text-gray-400">Error:</span>
                  <pre className="mt-1 bg-gray-800 p-2 rounded overflow-x-auto text-red-400">{result.error}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.type === 'submit') {
    const submission = results.data;
    return (
      <div>
        <div className="mb-6 bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-white mb-2">Submission Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Status:</span>
              <span className={`ml-2 font-medium ${
                submission.passed ? 'text-green-400' : 'text-red-400'
              }`}>
                {submission.status}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Score:</span>
              <span className="ml-2 font-medium text-white">{submission.score}/100</span>
            </div>
            <div>
              <span className="text-gray-400">Test Cases:</span>
              <span className="ml-2 font-medium text-white">
                {submission.passedTests}/{submission.totalTests} passed
              </span>
            </div>
            <div>
              <span className="text-gray-400">Total Time:</span>
              <span className="ml-2 font-medium text-white">{submission.totalExecutionTime}s</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
        {submission.results.map((result, index) => (
          <div key={index} className="mb-3 bg-gray-700 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Test Case {result.testCase}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {result.executionTime}s | {(result.memory / 1024).toFixed(2)}MB
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  result.passed 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-red-900 text-red-300'
                }`}>
                  {result.status}
                </span>
              </div>
            </div>
            {result.error && (
              <pre className="mt-2 text-xs bg-gray-800 p-2 rounded overflow-x-auto text-red-400">
                {result.error}
              </pre>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CodeEditor;