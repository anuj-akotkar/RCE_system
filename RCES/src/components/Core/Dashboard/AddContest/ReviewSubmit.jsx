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

  // Validation: all fields and at least one question
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
        Array.isArray(q.sampleInputs) &&
        Array.isArray(q.sampleOutputs) &&
        q.sampleInputs.length === 2 &&
        q.sampleOutputs.length === 2 &&
        q.sampleInputs.every((s) => s) &&
        q.sampleOutputs.every((s) => s) &&
        Array.isArray(q.testCases) &&
        q.testCases.length > 0 &&
        q.testCases.every((tc) => tc.input && tc.output)
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

  return (
    <div className="max-w-3xl mx-auto bg-blue-50 rounded-xl shadow-lg p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Review Contest Details
      </h2>
      <div className="mb-6 space-y-2">
        <p>
          <span className="font-semibold text-blue-800">Title:</span>{" "}
          <span className="text-blue-900">{contestData.title}</span>
        </p>
        <p>
          <span className="font-semibold text-blue-800">Description:</span>{" "}
          <span className="text-blue-900">{contestData.description}</span>
        </p>
        <p>
          <span className="font-semibold text-blue-800">Duration:</span>{" "}
          <span className="text-blue-900">{contestData.duration} minutes</span>
        </p>
      </div>
      <h3 className="font-semibold mb-2 text-blue-700">Questions:</h3>
      <ul className="mb-6 space-y-4">
        {contestData.questions.map((q, idx) => (
          <li key={idx} className="bg-white rounded shadow p-4">
            <div className="mb-2">
              <span className="font-semibold text-blue-900">{idx + 1}. {q.title}</span>
            </div>
            <div className="ml-2 space-y-1">
              <p className="text-gray-700">{q.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="font-semibold text-blue-700">Sample Input 1:</span>{" "}
                  <span className="font-mono">{q.sampleInputs[0]}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Sample Output 1:</span>{" "}
                  <span className="font-mono">{q.sampleOutputs[0]}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Sample Input 2:</span>{" "}
                  <span className="font-mono">{q.sampleInputs[1]}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Sample Output 2:</span>{" "}
                  <span className="font-mono">{q.sampleOutputs[1]}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-blue-700">Hidden Test Cases:</span>
                <ul className="ml-4 list-disc">
                  {q.testCases.map((tc, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-mono text-gray-700">Input:</span> <span className="font-mono">{tc.input}</span>{" "}
                      <span className="font-mono text-gray-700">| Output:</span> <span className="font-mono">{tc.output}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Feedback */}
      {success && (
        <p className="text-green-600 mb-2 text-center font-semibold" role="alert">
          Contest created successfully!
        </p>
      )}
      {error && (
        <p className="text-red-600 mb-2 text-center font-semibold" role="alert">
          {error}
        </p>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4 text-lg">Are you sure you want to submit this contest?</p>
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Yes, Submit"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setShowConfirm(true)}
          className={`bg-green-600 text-white px-6 py-2 rounded font-semibold shadow ${!isValid || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
          disabled={!isValid || loading}
        >
          Submit Contest
        </button>
      </div>
    </div>
  );
}