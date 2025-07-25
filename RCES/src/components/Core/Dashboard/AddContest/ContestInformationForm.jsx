import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  setDescription,
  setDuration,
  setthumbnail,
  setStartTime,
  setEndTime,
} from "../../../../slices/contestSlice";
import Upload from "./Upload.jsx";

const ContestInformationForm = ({ onNext }) => {
  const dispatch = useDispatch();
  const { title, description, duration, thumbnail, startTime, endTime } = useSelector(
    (state) => state.contest
  );

  const handleStartTimeChange = (value) => {
    dispatch(setStartTime(value));
    if (duration && value) {
      const startDate = new Date(value);
      const endDate = new Date(startDate.getTime() + duration * 60000);
      dispatch(setEndTime(endDate.toISOString().slice(0, 16)));
    }
  };

  const handleDurationChange = (value) => {
    const numericValue = Number(value);
    dispatch(setDuration(numericValue));
    if (startTime && numericValue) {
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + numericValue * 60000);
      dispatch(setEndTime(endDate.toISOString().slice(0, 16)));
    }
  };

  const isValid = title && description && duration > 0 && thumbnail;
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-xl shadow-lg p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Contest Information</h2>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block font-semibold mb-2 text-gray-700">Contest Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a descriptive contest title"
            />
            {!title && <span className="text-xs text-red-500 mt-1">Title is required</span>}
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2 text-gray-700">Description *</label>
            <textarea
              value={description}
              onChange={(e) => dispatch(setDescription(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Provide a detailed contest description"
            />
            {!description && (
              <span className="text-xs text-red-500 mt-1">Description is required</span>
            )}
          </div>
        </div>

        {/* Timing */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Contest Schedule</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                value={startTime || minDateTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                min={minDateTime}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <span className="text-xs text-gray-500 mt-1">Leave blank to start immediately</span>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700">Duration (minutes) *</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 120 for 2 hours"
                min="1"
              />
              {(!duration || duration <= 0) && (
                <span className="text-xs text-red-500 mt-1">Duration must be positive</span>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700">End Time</label>
              <input
                type="datetime-local"
                value={endTime || ""}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <span className="text-xs text-gray-500 mt-1">Auto-calculated</span>
            </div>
          </div>

          {duration > 0 && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Contest Duration:</strong> {Math.floor(duration / 60)}h {duration % 60}m
                {startTime && (
                  <>
                    <br />
                    <strong>Starts:</strong> {new Date(startTime).toLocaleString()}
                    <br />
                    <strong>Ends:</strong> {endTime ? new Date(endTime).toLocaleString() : "Not set"}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contest Media</h3>
          <label className="block font-semibold mb-2 text-gray-700">Contest Thumbnail *</label>
          <Upload
            name="thumbnail"
            label="Upload Contest Thumbnail"
            setValue={(_, value) => dispatch(setthumbnail(value))}
            errors={{ thumbnail: !thumbnail }}
            viewData={typeof thumbnail === "string" ? thumbnail : null}
          />
          {!thumbnail && <span className="text-xs text-red-500 mt-1">Thumbnail is required</span>}
          <div className="text-xs text-gray-500 mt-2">
            Recommended: 1200x630px, max 2MB, JPG/PNG
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Contest Guidelines</h3>
          <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
            <li>Ensure clear problem statements and test cases</li>
            <li>Set appropriate difficulty and time limits</li>
            <li>Provide meaningful sample inputs/outputs</li>
            <li>Ensure duration fits number & complexity of questions</li>
          </ul>
        </div>

        {/* Error summary */}
        {!isValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-semibold mb-2">Please complete the following:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {!title && <li>• Contest title is required</li>}
              {!description && <li>• Contest description is required</li>}
              {(!duration || duration <= 0) && <li>• Valid contest duration is required</li>}
              {!thumbnail && <li>• Contest thumbnail is required</li>}
            </ul>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              isValid
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next: Add Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestInformationForm;
