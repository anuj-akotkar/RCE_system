import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createContest } from "../../../../services/operations/contestAPI";
// import { useNavigate } from "react-router-dom"; // Uncomment if you want to redirect

export default function Step3_ReviewSubmit() {
  const dispatch = useDispatch();
  // const navigate = useNavigate(); // Uncomment if you want to redirect
  const contestData = useSelector((state) => state.contest);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Enhanced validation for all new fields
  const isValid =
    contestData.title &&
    contestData.description &&
    contestData.duration > 0 &&
    Array.isArray(contestData.questions) &&
    contestData.questions.length > 0 &&
    contestData.questions.every(
      (q) =>
        q.title &&
        q.description &&
        q.functionName &&
        Array.isArray(q.inputFields) &&
        Array.isArray(q.inputTypes) &&
        Array.isArray(q.outputFields) &&
        Array.isArray(q.outputTypes) &&
        q.inputFields.length > 0 &&
        q.outputFields.length > 0 &&
        q.inputFields.every((field) => field.trim()) &&
        q.outputFields.every((field) => field.trim()) &&
        Array.isArray(q.sampleInputs) &&
        Array.isArray(q.sampleOutputs) &&
        q.sampleInputs.length === 2 &&
        q.sampleOutputs.length === 2 &&
        q.sampleInputs.every((s) => s) &&
        q.sampleOutputs.every((s) => s) &&
        Array.isArray(q.testCases) &&
        q.testCases.length > 0 &&
        q.testCases.every((tc) => tc.input && tc.expectedOutput)
    );

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Contest payload:", contestData);
      const result = await dispatch(createContest(contestData, token));
      if (result?.error) {
        setError(result.error.message || "Failed to create contest. Please try again.");
        setSuccess(false);
      } else {
        setSuccess(true);
        // Optionally reset form or redirect:
        // navigate("/dashboard/my-contests");
        // or dispatch(resetContestState());
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create contest. Please try again."
      );
      setSuccess(false);
    }
    setLoading(false);
    setShowConfirm(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Review Contest Details
      </h2>
      
      {/* Contest Overview */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Contest Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-semibold text-blue-700">Title:</span>
            <p className="text-gray-800 mt-1">{contestData.title}</p>
          </div>
          <div>
            <span className="font-semibold text-blue-700">Duration:</span>
            <p className="text-gray-800 mt-1">{contestData.duration} minutes ({Math.floor(contestData.duration / 60)}h {contestData.duration % 60}m)</p>
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold text-blue-700">Description:</span>
            <p className="text-gray-800 mt-1">{contestData.description}</p>
          </div>
          {contestData.startTime && (
            <div>
              <span className="font-semibold text-blue-700">Start Time:</span>
              <p className="text-gray-800 mt-1">{new Date(contestData.startTime).toLocaleString()}</p>
            </div>
          )}
          {contestData.endTime && (
            <div>
              <span className="font-semibold text-blue-700">End Time:</span>
              <p className="text-gray-800 mt-1">{new Date(contestData.endTime).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Questions Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Questions ({contestData.questions.length})
        </h3>
        
        <div className="space-y-6">
          {contestData.questions.map((q, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {idx + 1}. {q.title}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{q.description}</p>
                  {q.constraints && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Constraints:</span>
                      <p className="text-gray-600 text-sm mt-1">{q.constraints}</p>
                    </div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Memory: {q.memoryLimitMB}MB</div>
                  <div>Time: {q.timeLimitSec}s</div>
                </div>
              </div>

              {/* Function Structure */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-gray-700 mb-3">Function Structure</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Function Name:</span>
                    <p className="font-mono text-blue-600">{q.functionName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Input Parameters:</span>
                    <div className="space-y-1">
                      {q.inputFields?.map((field, i) => (
                        <p key={i} className="font-mono text-sm text-gray-700">
                          {q.inputTypes?.[i]} {field}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Output Parameters:</span>
                    <div className="space-y-1">
                      {q.outputFields?.map((field, i) => (
                        <p key={i} className="font-mono text-sm text-gray-700">
                          {q.outputTypes?.[i]} {field}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Test Cases */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-blue-700 mb-3">Sample Test Cases</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1].map((i) => (
                    <div key={i} className="bg-white rounded p-3">
                      <h6 className="font-medium text-gray-700 mb-2">Sample {i + 1}</h6>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-600">Input:</span>
                          <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
                            {q.sampleInputs[i]}
                          </pre>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-600">Output:</span>
                          <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
                            {q.sampleOutputs[i]}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Cases Summary */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h5 className="font-semibold text-gray-700 mb-3">
                  Test Cases ({q.testCases?.length || 0})
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.testCases?.map((tc, i) => (
                    <div key={i} className="bg-white rounded p-3 border-l-4 border-gray-400">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-700">Test Case {i + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            tc.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {tc.isPublic ? 'Public' : 'Hidden'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {tc.memoryLimitMB}MB | {tc.timeLimitSec}s
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-xs font-medium text-gray-600">Input:</span>
                          <div className="bg-gray-50 p-1 rounded text-xs font-mono truncate">
                            {tc.input}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-600">Expected Output:</span>
                          <div className="bg-gray-50 p-1 rounded text-xs font-mono truncate">
                            {tc.expectedOutput}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {!isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-red-800 font-semibold mb-2">Please fix the following issues:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {!contestData.title && <li>• Contest title is missing</li>}
            {!contestData.description && <li>• Contest description is missing</li>}
            {contestData.duration <= 0 && <li>• Contest duration must be positive</li>}
            {contestData.questions.length === 0 && <li>• At least one question is required</li>}
            {contestData.questions.some(q => !q.title) && <li>• All questions must have titles</li>}
            {contestData.questions.some(q => !q.functionName) && <li>• All questions must have function names</li>}
            {contestData.questions.some(q => !q.inputFields?.length) && <li>• All questions must have input parameters</li>}
            {contestData.questions.some(q => !q.outputFields?.length) && <li>• All questions must have output parameters</li>}
          </ul>
        </div>
      )}

      {/* Feedback */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-semibold text-center">
            ✅ Contest created successfully!
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold text-center">
            ❌ {error}
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Contest Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to create this contest? Once created, it will be available to students.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Contest"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => setShowConfirm(true)}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isValid && !loading
              ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isValid || loading}
        >
          {loading ? "Creating Contest..." : "Create Contest"}
        </button>
      </div>
    </div>
  );
}