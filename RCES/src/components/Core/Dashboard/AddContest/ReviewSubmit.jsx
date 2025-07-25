import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createContest } from "../../../../services/operations/contestAPI";
// import { useNavigate } from "react-router-dom"; // Uncomment if you want to redirect

export default function Step3_ReviewSubmit() {
  const dispatch = useDispatch();
  const contestData = useSelector((state) => state.contest);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
        // navigate("/dashboard/my-contests");
        // dispatch(resetContestState());
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
            <p className="text-gray-800 mt-1">
              {contestData.duration} minutes ({Math.floor(contestData.duration / 60)}h {contestData.duration % 60}m)
            </p>
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

      {/* Questions List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Questions ({contestData.questions.length})
        </h3>
        <div className="space-y-6">
          {contestData.questions.map((q, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between mb-2">
                <h4 className="text-lg font-semibold">
                  {idx + 1}. {q.title}
                </h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                  {q.difficulty}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{q.description}</p>
              {q.constraints && (
                <p className="text-sm text-gray-500 mb-4">Constraints: {q.constraints}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Function:</p>
                  <p className="font-mono text-blue-600">{q.functionName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Input Params:</p>
                  {q.inputFields.map((field, i) => (
                    <p key={i} className="font-mono text-sm">{q.inputTypes[i]} {field}</p>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Output Params:</p>
                  {q.outputFields.map((field, i) => (
                    <p key={i} className="font-mono text-sm">{q.outputTypes[i]} {field}</p>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Sample Test Cases</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1].map(i => (
                    <div key={i} className="bg-white rounded border p-3">
                      <p className="text-xs font-medium">Input:</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{q.sampleInputs[i]}</pre>
                      <p className="text-xs font-medium mt-2">Output:</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{q.sampleOutputs[i]}</pre>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Test Cases ({q.testCases.length})
                </p>
                <div className="space-y-2">
                  {q.testCases.map((tc, i) => (
                    <div key={i} className="bg-white p-3 rounded border">
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span>Test Case {i + 1}</span>
                        <span>{tc.isPublic ? 'Public' : 'Hidden'} | {tc.memoryLimitMB}MB | {tc.timeLimitSec}s</span>
                      </div>
                      <p className="text-xs font-mono truncate">Input: {tc.input}</p>
                      <p className="text-xs font-mono truncate">Expected Output: {tc.expectedOutput}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-red-800 font-semibold mb-2">Please fix the following issues:</h4>
          <ul className="text-red-700 text-sm list-disc list-inside">
            {!contestData.title && <li>Contest title is missing</li>}
            {!contestData.description && <li>Contest description is missing</li>}
            {contestData.duration <= 0 && <li>Contest duration must be greater than 0</li>}
            {contestData.questions.length === 0 && <li>At least one question is required</li>}
            {contestData.questions.some(q => !q.title) && <li>All questions must have titles</li>}
            {contestData.questions.some(q => !q.functionName) && <li>All questions must have function names</li>}
            {contestData.questions.some(q => !q.inputFields?.length) && <li>Input parameters required</li>}
            {contestData.questions.some(q => !q.outputFields?.length) && <li>Output parameters required</li>}
          </ul>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center text-green-800 font-semibold">
          ✅ Contest created successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center text-red-800 font-semibold">
          ❌ {error}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black test-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Contest Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to create this contest? Once created, it will be visible to users.
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

      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => setShowConfirm(true)}
          className={`px-8 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:opacity-50`}
          disabled={!isValid || loading}
        >
          Submit Contest
        </button>
      </div>
    </div>
  );
}
