import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const SubmissionsButton = ({ contestId }) => {
  const navigate = useNavigate();
  // Use contestId from props or from URL if not provided
  const params = useParams();
  const id = contestId || params.contestId;

  return (
    <button
      className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      onClick={() => navigate(`/contests/${id}/submissions`)}
    >
      View Submissions
    </button>
  );
};

export default SubmissionsButton;