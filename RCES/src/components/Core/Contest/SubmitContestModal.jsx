import React from "react";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const SubmitContestModal = ({ isOpen, onClose, onConfirm, contestTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-yellow-400 text-2xl mr-3" />
          <h3 className="text-xl font-bold text-white">Confirm Contest Submission</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to submit your contest?
          </p>
          <p className="text-gray-400 text-sm">
            Contest: <span className="text-blue-400 font-semibold">{contestTitle}</span>
          </p>
          <p className="text-red-400 text-sm mt-2">
            ⚠️ You cannot make more changes after submission.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <FaCheckCircle className="mr-2" />
            Submit Contest
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitContestModal; 