import React, { useState, useEffect } from "react";
import { getSubmissionsByQuestion, getSubmissionById } from "../../../services/operations/codeAPI";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { VscCode } from "react-icons/vsc";
import { useSelector } from "react-redux"; // ✅ 1. Import useSelector

const SubmissionHistory = ({ questionId, isOpen, onClose }) => { // ✅ 2. Removed token from props
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // ✅ 3. Get the token directly from the Redux store
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // The token from the store will be available here
    if (isOpen && questionId && token) {
      fetchSubmissions();
      // Reset selected submission when modal is reopened
      setSelectedSubmission(null);
    }
  }, [isOpen, questionId, token]); // Added token to dependency array

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // ✅ 4. Use the token from the Redux store in the API call
      const result = await getSubmissionsByQuestion(questionId, token);
      console.log("From fetchSubmissions of SubmissionHistory:", result); // Your console log
      if (result?.success) {
        setSubmissions(result.submissions || []);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissions([]);
    }
    setLoading(false);
  };

  const viewSubmissionDetails = async (submissionId) => {
    if (selectedSubmission?._id === submissionId) return;
    
    setDetailsLoading(true);
    try {
      // ✅ 5. Use the token from the Redux store in the API call
      const result = await getSubmissionById(submissionId, token);
      console.log("From viewSubmissionDetails of SubmissionHistory:", result); // Your console log
      if (result?.success) {
        setSelectedSubmission(result.submission);
      }
    } catch (error) {
      console.error("Error fetching submission details:", error);
    }
    setDetailsLoading(false);
  };

  const StatusIcon = ({ status }) => {
    if (status === 'Success') {
        return <FaCheckCircle className="text-green-500" />;
    }
    if (status === 'Failed') {
        return <FaTimesCircle className="text-red-500" />;
    }
    return <FaHourglassHalf className="text-yellow-500" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="bg-gray-800 text-white rounded-xl shadow-2xl w-11/12 max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-2xl font-bold flex items-center gap-3"><VscCode /> Submission History</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
            </div>
            
            <div className="flex flex-grow overflow-hidden">
                {/* Left Pane: Submissions List (Tabs) */}
                <div className="w-1/3 border-r border-gray-700 overflow-y-auto p-4 space-y-2">
                    {loading ? (
                        <p className="text-center text-gray-400">Loading...</p>
                    ) : submissions.length > 0 ? (
                        submissions.map(sub => (
                            <div 
                                key={sub._id} 
                                onClick={() => viewSubmissionDetails(sub._id)} 
                                className={`cursor-pointer p-3 rounded-lg border-l-4 transition-all duration-200 ${
                                    selectedSubmission?._id === sub._id 
                                    ? 'bg-blue-900/50 border-blue-500' 
                                    : 'bg-gray-700/50 border-transparent hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2 font-bold">
                                        <StatusIcon status={sub.status} />
                                        <span>{sub.status}</span>
                                    </div>
                                    <span className="text-xs font-mono bg-gray-600 px-2 py-1 rounded">{sub.language}</span>
                                </div>
                                <div className="text-xs text-gray-400 flex justify-between">
                                    <span>{new Date(sub.createdAt).toLocaleString()}</span>
                                    <span>{sub.passedTestCases}/{sub.totalTestCases} Passed</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No submissions found.</p>
                    )}
                </div>

                {/* Right Pane: Submission Details */}
                <div className="w-2/3 p-6 overflow-y-auto">
                    {detailsLoading ? (
                        <div className="flex items-center justify-center h-full text-gray-400">Loading Details...</div>
                    ) : selectedSubmission ? (
                        <div>
                            <h3 className="font-bold text-xl mb-4">Submission Details</h3>
                            <div className="bg-gray-900 p-4 rounded-lg">
                                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                                    <code>{selectedSubmission.code}</code>
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Select a submission from the left to view its code.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SubmissionHistory;
