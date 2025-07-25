import React, { useState, useEffect } from "react";
import { getSubmissionsByQuestion, getSubmissionById } from "../../../services/operations/codeAPI";

const SubmissionHistory = ({ questionId, isOpen, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && questionId) fetchSubmissions();
  }, [isOpen, questionId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const result = await getSubmissionsByQuestion(questionId);
      if (result?.success) setSubmissions(result.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
    setLoading(false);
  };

  const viewSubmissionDetails = async (submissionId) => {
    setDetailsLoading(true);
    try {
      const result = await getSubmissionById(submissionId);
      if (result?.success) setSelectedSubmission(result.submission);
    } catch (error) {
      console.error("Error fetching submission details:", error);
    }
    setDetailsLoading(false);
  };

  const formatTime = (time) => (parseFloat(time) ? `${parseFloat(time)}s` : "0s");
  const formatMemory = (memory) => (parseInt(memory) ? `${parseInt(memory)} KB` : "0 KB");

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted": return "text-green-400";
      case "Wrong Answer": return "text-red-400";
      case "Runtime Error": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Submission History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/2 border-r overflow-y-auto p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Your Submissions</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No submissions found.</div>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission, index) => (
                  <div
                    key={submission._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => viewSubmissionDetails(submission._id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-600">Submission #{submissions.length - index}</span>
                      <span className={`text-sm font-bold ${getStatusColor(submission.status)}`}>
                        {submission.status || "Unknown"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Language: <span className="font-medium">{submission.language}</span></div>
                      <div>Passed: <span className="font-medium">{submission.passedTestCases || 0}/{submission.totalTestCases || 0}</span></div>
                      <div>Time: <span className="font-medium">{formatTime(submission.timeUsedSec || submission.executionTime)}</span></div>
                      <div>Memory: <span className="font-medium">{formatMemory(submission.memoryUsedMB || submission.memory)}</span></div>
                      <div className="text-xs text-gray-500">
                        {new Date(submission.submittedAt || submission.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-1/2 overflow-y-auto p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Submission Details</h3>
            {detailsLoading ? (
              <div className="text-center py-8 text-gray-600">Loading details...</div>
            ) : selectedSubmission ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Status: <span className={`font-bold ${getStatusColor(selectedSubmission.status)}`}>{selectedSubmission.status}</span></div>
                    <div>Language: <span className="font-medium">{selectedSubmission.language}</span></div>
                    <div>Total Time: <span className="font-medium">{formatTime(selectedSubmission.executionTime)}</span></div>
                    <div>Max Memory: <span className="font-medium">{formatMemory(selectedSubmission.memory)}</span></div>
                  </div>
                </div>

                {/* Code */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Code</h4>
                  <pre className="bg-black text-green-400 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">{selectedSubmission.code}</pre>
                </div>

                {/* Test Case Results */}
                {selectedSubmission.results?.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Test Case Results</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedSubmission.results.map((result, index) => (
                        <div key={index} className="border rounded p-3 bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Test Case {result.testCase}</span>
                            <div className="flex items-center gap-2">
                              <span className={result.passed ? "text-green-600" : "text-red-600"}>
                                {result.passed ? "✓ PASS" : "✗ FAIL"}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatTime(result.executionTime)} | {formatMemory(result.memory)}
                              </span>
                            </div>
                          </div>
                          {!result.passed && (
                            <div className="text-sm space-y-1">
                              <div>Expected: <span className="font-mono text-green-600">{result.expectedOutput}</span></div>
                              <div>Got: <span className="font-mono text-red-600">{result.actualOutput}</span></div>
                              {result.status && result.status !== "Unknown" && (
                                <div>Status: <span className="text-yellow-600">{result.status}</span></div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Select a submission to view details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;
