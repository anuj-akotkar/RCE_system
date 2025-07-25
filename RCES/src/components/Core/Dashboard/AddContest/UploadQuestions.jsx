import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuestion, updateQuestion, deleteQuestion } from "../../../../slices/contestSlice";

export default function UploadQuestions({ onNext }) {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.contest.questions) || [];
  const [form, setForm] = useState({
    title: "",
    description: "",
    constraints: "",
    difficulty: "Easy",
    memoryLimitMB: 128,
    timeLimitSec: 2,
    functionName: "",
    inputFields: [""],
    inputTypes: ["int"],
    outputFields: ["result"],
    outputTypes: ["int"],
    sampleInputs: ["", ""],
    sampleOutputs: ["", ""],
    testCases: [{ input: "", expectedOutput: "", isPublic: true, memoryLimitMB: 128, timeLimitSec: 2 }],
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [error, setError] = useState("");

  const dataTypes = ["int", "long", "string", "double", "boolean", "int[]", "string[]", "double[]"];
  const difficulties = ["Easy", "Medium", "Hard"];

  // Handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSampleChange = (idx, type, value) => {
    const arr = [...form[type]];
    arr[idx] = value;
    setForm({ ...form, [type]: arr });
  };
  
  const handleTestCaseChange = (idx, field, value) => {
    const updated = form.testCases.map((tc, i) =>
      i === idx ? { ...tc, [field]: field === 'isPublic' ? Boolean(value) : value } : tc
    );
    setForm({ ...form, testCases: updated });
  };

  const handleInputFieldChange = (idx, value) => {
    const updated = [...form.inputFields];
    updated[idx] = value;
    setForm({ ...form, inputFields: updated });
  };

  const handleInputTypeChange = (idx, value) => {
    const updated = [...form.inputTypes];
    updated[idx] = value;
    setForm({ ...form, inputTypes: updated });
  };

  const handleOutputFieldChange = (idx, value) => {
    const updated = [...form.outputFields];
    updated[idx] = value;
    setForm({ ...form, outputFields: updated });
  };

  const handleOutputTypeChange = (idx, value) => {
    const updated = [...form.outputTypes];
    updated[idx] = value;
    setForm({ ...form, outputTypes: updated });
  };

  const addInputField = () => {
    setForm({
      ...form,
      inputFields: [...form.inputFields, ""],
      inputTypes: [...form.inputTypes, "int"]
    });
  };

  const removeInputField = (idx) => {
    if (form.inputFields.length > 1) {
      setForm({
        ...form,
        inputFields: form.inputFields.filter((_, i) => i !== idx),
        inputTypes: form.inputTypes.filter((_, i) => i !== idx)
      });
    }
  };

  const addOutputField = () => {
    setForm({
      ...form,
      outputFields: [...form.outputFields, ""],
      outputTypes: [...form.outputTypes, "int"]
    });
  };

  const removeOutputField = (idx) => {
    if (form.outputFields.length > 1) {
      setForm({
        ...form,
        outputFields: form.outputFields.filter((_, i) => i !== idx),
        outputTypes: form.outputTypes.filter((_, i) => i !== idx)
      });
    }
  };

  const addTestCase = () => setForm({ 
    ...form, 
    testCases: [...form.testCases, { 
      input: "", 
      expectedOutput: "", 
      isPublic: false, 
      memoryLimitMB: form.memoryLimitMB, 
      timeLimitSec: form.timeLimitSec 
    }] 
  });
  
  const removeTestCase = (idx) => setForm({ ...form, testCases: form.testCases.filter((_, i) => i !== idx) });

  // Validation
  const isValidQuestion =
    form.title &&
    form.description &&
    form.functionName &&
    form.inputFields.every((field) => field.trim()) &&
    form.outputFields.every((field) => field.trim()) &&
    form.sampleInputs.every((s) => s) &&
    form.sampleOutputs.every((s) => s) &&
    form.testCases.every(tc => tc.input && tc.expectedOutput) &&
    form.memoryLimitMB > 0 &&
    form.timeLimitSec > 0;
  
  const isValidStep = questions.length > 0;

  // Add or update question
  const handleAddOrUpdate = () => {
    if (!isValidQuestion) {
      setError("Please fill all required fields correctly.");
      return;
    }
    setError("");
    const questionData = {
      title: form.title,
      description: form.description,
      constraints: form.constraints,
      difficulty: form.difficulty,
      memoryLimitMB: form.memoryLimitMB,
      timeLimitSec: form.timeLimitSec,
      functionName: form.functionName,
      inputFields: form.inputFields,
      inputTypes: form.inputTypes,
      outputFields: form.outputFields,
      outputTypes: form.outputTypes,
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
    // Reset form
    setForm({
      title: "",
      description: "",
      constraints: "",
      difficulty: "Easy",
      memoryLimitMB: 128,
      timeLimitSec: 2,
      functionName: "",
      inputFields: [""],
      inputTypes: ["int"],
      outputFields: ["result"],
      outputTypes: ["int"],
      sampleInputs: ["", ""],
      sampleOutputs: ["", ""],
      testCases: [{ input: "", expectedOutput: "", isPublic: true, memoryLimitMB: 128, timeLimitSec: 2 }],
    });
  };

  // Edit & Delete
  const handleEdit = (idx) => {
    const q = questions[idx];
    setForm({
      title: q.title || "",
      description: q.description || "",
      constraints: q.constraints || "",
      difficulty: q.difficulty || "Easy",
      memoryLimitMB: q.memoryLimitMB || 128,
      timeLimitSec: q.timeLimitSec || 2,
      functionName: q.functionName || "",
      inputFields: q.inputFields || [""],
      inputTypes: q.inputTypes || ["int"],
      outputFields: q.outputFields || ["result"],
      outputTypes: q.outputTypes || ["int"],
      sampleInputs: q.sampleInputs || ["", ""],
      sampleOutputs: q.sampleOutputs || ["", ""],
      testCases: q.testCases || [{ input: "", expectedOutput: "", isPublic: true, memoryLimitMB: 128, timeLimitSec: 2 }],
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
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {editIndex !== null ? "Edit Question" : "Add New Question"}
      </h2>

      {/* Question Form */}
      <div className="space-y-6 border-b pb-6 mb-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter question title"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            {!form.title && <span className="text-xs text-red-500">Title is required</span>}
          </div>
          
          <div>
            <label className="block font-semibold mb-1">Difficulty *</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter detailed problem description"
            className="w-full border px-3 py-2 rounded min-h-[100px] focus:ring-2 focus:ring-blue-500"
          />
          {!form.description && <span className="text-xs text-red-500">Description is required</span>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Constraints</label>
          <textarea
            name="constraints"
            value={form.constraints}
            onChange={handleChange}
            placeholder="Enter problem constraints (e.g., 1 ≤ n ≤ 10^5)"
            className="w-full border px-3 py-2 rounded min-h-[80px] focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Memory Limit (MB) *</label>
            <input
              type="number"
              name="memoryLimitMB"
              value={form.memoryLimitMB}
              onChange={handleChange}
              min="16"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-1">Time Limit (seconds) *</label>
            <input
              type="number"
              name="timeLimitSec"
              value={form.timeLimitSec}
              onChange={handleChange}
              min="1"
              step="0.1"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Function Structure */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Function Structure</h3>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Function Name *</label>
            <input
              name="functionName"
              value={form.functionName}
              onChange={handleChange}
              placeholder="e.g., twoSum, findMax"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            {!form.functionName && <span className="text-xs text-red-500">Function name is required</span>}
          </div>

          {/* Input Parameters */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block font-semibold">Input Parameters *</label>
              <button
                type="button"
                onClick={addInputField}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                + Add Input
              </button>
            </div>
            {form.inputFields.map((field, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={form.inputTypes[idx]}
                  onChange={(e) => handleInputTypeChange(idx, e.target.value)}
                  className="border px-2 py-1 rounded w-32"
                >
                  {dataTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  value={field}
                  onChange={(e) => handleInputFieldChange(idx, e.target.value)}
                  placeholder={`Input parameter ${idx + 1}`}
                  className="border px-2 py-1 rounded flex-1"
                />
                {form.inputFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInputField(idx)}
                    className="text-red-500 hover:underline px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Output Parameters */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-semibold">Output Parameters *</label>
              <button
                type="button"
                onClick={addOutputField}
                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                + Add Output
              </button>
            </div>
            {form.outputFields.map((field, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={form.outputTypes[idx]}
                  onChange={(e) => handleOutputTypeChange(idx, e.target.value)}
                  className="border px-2 py-1 rounded w-32"
                >
                  {dataTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  value={field}
                  onChange={(e) => handleOutputFieldChange(idx, e.target.value)}
                  placeholder={`Output parameter ${idx + 1}`}
                  className="border px-2 py-1 rounded flex-1"
                />
                {form.outputFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOutputField(idx)}
                    className="text-red-500 hover:underline px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sample Cases */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Sample Test Cases</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Sample Input 1 *</label>
              <textarea
                value={form.sampleInputs[0]}
                onChange={e => handleSampleChange(0, "sampleInputs", e.target.value)}
                placeholder="Sample Input 1"
                className="w-full border px-3 py-2 rounded min-h-[60px]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Sample Output 1 *</label>
              <textarea
                value={form.sampleOutputs[0]}
                onChange={e => handleSampleChange(0, "sampleOutputs", e.target.value)}
                placeholder="Sample Output 1"
                className="w-full border px-3 py-2 rounded min-h-[60px]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Sample Input 2 *</label>
              <textarea
                value={form.sampleInputs[1]}
                onChange={e => handleSampleChange(1, "sampleInputs", e.target.value)}
                placeholder="Sample Input 2"
                className="w-full border px-3 py-2 rounded min-h-[60px]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Sample Output 2 *</label>
              <textarea
                value={form.sampleOutputs[1]}
                onChange={e => handleSampleChange(1, "sampleOutputs", e.target.value)}
                placeholder="Sample Output 2"
                className="w-full border px-3 py-2 rounded min-h-[60px]"
              />
            </div>
          </div>
          {(!form.sampleInputs.every(s => s) || !form.sampleOutputs.every(s => s)) && (
            <span className="text-xs text-red-500">All sample inputs and outputs are required</span>
          )}
        </div>

        {/* Test Cases */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Test Cases *</h3>
            <button
              onClick={addTestCase}
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + Add Test Case
            </button>
          </div>
          
          {form.testCases.map((tc, idx) => (
            <div key={idx} className="border border-gray-300 p-4 mb-4 rounded-lg bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Test Case {idx + 1}</h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tc.isPublic}
                      onChange={e => handleTestCaseChange(idx, "isPublic", e.target.checked)}
                    />
                    <span className="text-sm">Public (visible to students)</span>
                  </label>
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block font-medium mb-1">Input</label>
                  <textarea
                    value={tc.input}
                    onChange={e => handleTestCaseChange(idx, "input", e.target.value)}
                    placeholder={`Input for test case ${idx + 1}`}
                    className="w-full border px-2 py-1 rounded min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Expected Output</label>
                  <textarea
                    value={tc.expectedOutput}
                    onChange={e => handleTestCaseChange(idx, "expectedOutput", e.target.value)}
                    placeholder={`Expected output for test case ${idx + 1}`}
                    className="w-full border px-2 py-1 rounded min-h-[60px]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Memory Limit (MB)</label>
                  <input
                    type="number"
                    value={tc.memoryLimitMB}
                    onChange={e => handleTestCaseChange(idx, "memoryLimitMB", Number(e.target.value))}
                    min="16"
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Time Limit (seconds)</label>
                  <input
                    type="number"
                    value={tc.timeLimitSec}
                    onChange={e => handleTestCaseChange(idx, "timeLimitSec", Number(e.target.value))}
                    min="1"
                    step="0.1"
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {!form.testCases.every(tc => tc.input && tc.expectedOutput) && (
            <span className="text-xs text-red-500">All test cases must have input and expected output</span>
          )}
        </div>

        {error && <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded">{error}</div>}

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddOrUpdate}
            className={`px-6 py-3 rounded font-semibold ${
              isValidQuestion 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
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
                  constraints: "",
                  difficulty: "Easy",
                  memoryLimitMB: 128,
                  timeLimitSec: 2,
                  functionName: "",
                  inputFields: [""],
                  inputTypes: ["int"],
                  outputFields: ["result"],
                  outputTypes: ["int"],
                  sampleInputs: ["", ""],
                  sampleOutputs: ["", ""],
                  testCases: [{ input: "", expectedOutput: "", isPublic: true, memoryLimitMB: 128, timeLimitSec: 2 }],
                });
                setError("");
              }}
              className="px-6 py-3 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Questions Added ({questions.length})</h2>
        {questions.length === 0 && (
          <div className="text-gray-500 mb-4 p-4 bg-gray-50 rounded">No questions added yet.</div>
        )}
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-lg">{idx + 1}. {q.title}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{q.description?.substring(0, 100)}...</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Function: {q.functionName}</span>
                    <span>Inputs: {q.inputFields?.length || 0}</span>
                    <span>Outputs: {q.outputFields?.length || 0}</span>
                    <span>Test Cases: {q.testCases?.length || 0}</span>
                    <span>Memory: {q.memoryLimitMB}MB</span>
                    <span>Time: {q.timeLimitSec}s</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end mt-8 pt-6 border-t">
        <button
          onClick={onNext}
          disabled={!isValidStep}
          className={`px-8 py-3 rounded font-semibold ${
            isValidStep 
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
}