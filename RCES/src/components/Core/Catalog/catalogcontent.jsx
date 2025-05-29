import React from "react";
import { useNavigate } from "react-router-dom";

const CatalogCard = ({ contest }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full max-w-sm hover:scale-105 transition">
      <img
        src={contest.thumbnail}
        alt={contest.title}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h2 className="text-xl font-bold mb-1">{contest.title}</h2>
      <p className="text-sm text-gray-600 mb-2">{contest.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Instructor: {contest.instructor?.name || "Unknown"}</span>
        <span className="text-right">⏳ {contest.difficulty}</span>
      </div>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        onClick={() => navigate(`/contest/${contest._id}`)}
      >
        View Details
      </button>
    </div>
  );
};

export default CatalogCard;
