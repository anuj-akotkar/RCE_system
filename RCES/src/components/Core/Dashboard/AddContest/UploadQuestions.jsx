import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuestion, updateQuestion, deleteQuestion } from "../../../../slices/contestSlice";

export default function UploadQuestions({ onNext }) {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.contest.questions) || [];
  const [form, setForm] = useState({
    title: "",
    description: "",
    sampleInputs: ["", ""],
    sampleOutputs: ["", ""],
    testCases: [{ input: "", output: "" }],
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [error, setError] = useState("");

  // Handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSampleChange = (idx, type, value) => {
    const arr = [...form[type]];
    arr[idx] = value;
    setForm({ ...form, [type]: arr });
  };
  const handleTestCaseChange = (idx, field, value) => {
    const updated = form.testCases.map((tc, i) =>
      i === idx ? { ...tc, [field]: value } : tc
    );
    setForm({ ...form, testCases: updated });
  };
  const addTestCase = () => setForm({ ...form, testCases: [...form.testCases, { input: "", output: "" }] });
  const removeTestCase = (idx) => setForm({ ...form, testCases: form.testCases.filter((_, i) => i !== idx) });

  // Validation
  const isValidQuestion =
    form.title &&
    form.description &&
    form.sampleInputs.every((s) => s) &&
    form.sampleOutputs.every((s) => s) &&
    form.testCases.every(tc => tc.input && tc.output);
  const isValidStep = questions.length > 0;

  // Add or update question
  const handleAddOrUpdate = () => {
    if (!isValidQuestion) {
      setError("Please fill all fields and test cases.");
      return;
    }
    setError("");
    const questionData = {
      title: form.title,
      description: form.description,
      sampleInputs: form.sampleInputs,
      sampleOutputs: form.sampleOutputs,
      testCases: form.testCases,
    };
    if (editIndex !== null) {
      dispatch(updateQuestion({ index: editIndex, question: questionData }));
      setEditIndex(null);
    } else {
      dispatch(addQuestion(questionData));
    }
    setForm({
      title: "",
      description: "",
      sampleInputs: ["", ""],
      sampleOutputs: ["", ""],
      testCases: [{ input: "", output: "" }],
    });
  };

  // Edit & Delete
  const handleEdit = (idx) => {
    const q = questions[idx];
    setForm({
      title: q.title,
      description: q.description,
      sampleInputs: q.sampleInputs || ["", ""],
      sampleOutputs: q.sampleOutputs || ["", ""],
      testCases: q.testCases || [{ input: "", output: "" }],
    });
    setEditIndex(idx);
    setError("");
  };
  const handleDelete = (idx) => {
    setDeleteIdx(idx);
    setShowConfirm(true);
  };
  const confirmDelete = () => {
    dispatch(deleteQuestion(deleteIdx));
    setShowConfirm(false);
    setDeleteIdx(null);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {editIndex !== null ? "Edit Question" : "Add New Question"}
      </h2>

      {/* Question Form */}
      <div className="space-y-4 border-b pb-6 mb-6">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter question title"
            className="w-full border px-3 py-2 rounded"
          />
          {!form.title && <span className="text-xs text-red-500">Title is required</span>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter question description"
            className="w-full border px-3 py-2 rounded min-h-[80px]"
          />
          {!form.description && <span className="text-xs text-red-500">Description is required</span>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Sample Input 1</label>
            <input
              value={form.sampleInputs[0]}
              onChange={e => handleSampleChange(0, "sampleInputs", e.target.value)}
              placeholder="Sample Input 1"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sample Output 1</label>
            <input
              value={form.sampleOutputs[0]}
              onChange={e => handleSampleChange(0, "sampleOutputs", e.target.value)}
              placeholder="Sample Output 1"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sample Input 2</label>
            <input
              value={form.sampleInputs[1]}
              onChange={e => handleSampleChange(1, "sampleInputs", e.target.value)}
              placeholder="Sample Input 2"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Sample Output 2</label>
            <input
              value={form.sampleOutputs[1]}
              onChange={e => handleSampleChange(1, "sampleOutputs", e.target.value)}
              placeholder="Sample Output 2"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        {(!form.sampleInputs.every(s => s) || !form.sampleOutputs.every(s => s)) && (
          <span className="text-xs text-red-500">Both sample inputs and outputs are required</span>
        )}

        {/* Hidden Test Cases */}
        <div>
          <label className="block font-semibold mb-2 mt-4">Hidden Test Cases</label>
          {form.testCases.map((tc, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={tc.input}
                onChange={e => handleTestCaseChange(idx, "input", e.target.value)}
                placeholder={`Input #${idx + 1}`}
                className="border px-2 py-1 rounded w-1/2"
              />
              <input
                value={tc.output}
                onChange={e => handleTestCaseChange(idx, "output", e.target.value)}
                placeholder={`Output #${idx + 1}`}
                className="border px-2 py-1 rounded w-1/2"
              />
              {form.testCases.length > 1 && (
                <button
                  onClick={() => removeTestCase(idx)}
                  type="button"
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {!form.testCases.every(tc => tc.input && tc.output) && (
            <span className="text-xs text-red-500">All test cases must have input and output</span>
          )}
          <button
            onClick={addTestCase}
            type="button"
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Test Case
          </button>
        </div>

        {error && <div className="text-red-500 text-xs mt-2">{error}</div>}

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddOrUpdate}
            className={`px-6 py-2 rounded font-semibold ${isValidQuestion ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!isValidQuestion}
          >
            {editIndex !== null ? "Update Question" : "Add Question"}
          </button>
          {editIndex !== null && (
            <button
              onClick={() => {
                setEditIndex(null);
                setForm({
                  title: "",
                  description: "",
                  sampleInputs: ["", ""],
                  sampleOutputs: ["", ""],
                  testCases: [{ input: "", output: "" }],
                });
                setError("");
              }}
              className="px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Questions Added</h2>
        {questions.length === 0 && (
          <div className="text-gray-500 mb-4">No questions added yet.</div>
        )}
        <ul className="space-y-2">
          {questions.map((q, idx) => (
            <li key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded shadow">
              <div>
                <span className="font-semibold">{idx + 1}. {q.title}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(idx)}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal for Delete */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this question?</p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!isValidStep}
          className={`px-6 py-2 rounded font-semibold ${isValidStep ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}