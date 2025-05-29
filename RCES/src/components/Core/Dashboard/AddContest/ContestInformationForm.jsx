import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  setDescription,
  setDuration,
  setthumbnail,
} from "../../../../slices/contestSlice";
import Upload from "./Upload.jsx";

const ContestInformationForm = ({ onNext }) => {
  const dispatch = useDispatch();
  const { title, description, duration,thumbnail } = useSelector((state) => state.contest);

  const isValid = title && description && duration > 0 && thumbnail;

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Contest Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="Enter contest title"
        />
        {!title && <span className="text-xs text-red-500">Title is required</span>}
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => dispatch(setDescription(e.target.value))}
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Enter a short description of the contest"
        />
        {!description && <span className="text-xs text-red-500">Description is required</span>}
      </div>

      <div>
        <label className="block font-medium mb-1">Duration (in minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => dispatch(setDuration(Number(e.target.value)))}
          className="w-full p-2 border rounded"
          placeholder="Enter contest duration"
        />
        {(!duration || duration <= 0) && (
          <span className="text-xs text-red-500">Duration must be positive</span>
        )}
      </div>
       
       <div>
        <label className="block font-medium mb-1">Thumbnail</label>
        <Upload
          name="thumbnail"
          label="Contest Thumbnail"
          setValue={(_, value) => dispatch(setthumbnail(value))}
          errors={{ thumbnail: !thumbnail }}
          viewData={typeof thumbnail === "string" ? thumbnail : null}
        />
        {!thumbnail && <span className="text-xs text-red-500">Thumbnail is required</span>}
       </div>
       
      <button
        onClick={onNext}
        disabled={!isValid}
        className={`mt-4 px-4 py-2 rounded ${isValid ? "bg-green-500 text-white" : "bg-gray-300 cursor-not-allowed"}`}
      >
        Next
      </button>
    </div>
  );
};

export default ContestInformationForm;