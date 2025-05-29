import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const LeaderboardButton = ({ contestId }) => {
  const navigate = useNavigate();
  // Use contestId from props or from URL if not provided
  const params = useParams();
  const id = contestId || params.contestId;

  return (
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={() => navigate(`/contests/${id}/leaderboard`)}
    >
      View Leaderboard
    </button>
  );
};

export default LeaderboardButton;