import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchContestDetails } from "../services/operations/contestAPI";
import { useSelector } from "react-redux";
import { FaUserTie, FaPuzzlePiece, FaFire, FaClock, FaFlagCheckered } from "react-icons/fa";

const ContestDetailsPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchContestDetails(contestId, token)
      .then((data) => {
        setContest(data);
        setError("");
      })
      .catch((err) => {
        setError("Could not fetch contest details");
        setContest(null);
      })
      .finally(() => setLoading(false));
    document.title = "Contest Details | RCE System";
  }, [contestId, token]);

  const handleStartTest = () => {
    navigate(`/contest/${contestId}/take`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-500">Loading contest...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-red-500">
        {error}
      </div>
    );
  }

  if (!contest) return null;

  return (
    <div className="w-11/12 max-w-[1080px] mx-auto py-12 flex justify-center items-center min-h-[80vh]">
      <div className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row gap-10 items-center border-4 border-blue-600">
        <img
          src={contest.thumbnail || "https://via.placeholder.com/400x240?text=No+Image"}
          alt={contest.title ? `Thumbnail for ${contest.title}` : "Contest thumbnail"}
          className="rounded-2xl w-full max-w-md h-72 object-cover shadow-xl border-4 border-blue-500"
        />
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              {contest.title}
            </h1>
            <span className="inline-block bg-blue-600 text-white text-lg font-bold px-6 py-2 rounded-full shadow mb-2 w-fit">
              {contest.timeLimit} min
            </span>
          </div>
          <p className="text-blue-100 text-lg font-semibold mb-2">{contest.description}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="flex items-center gap-2 bg-blue-800 text-blue-200 px-4 py-2 rounded-full text-lg font-bold">
              <FaUserTie className="text-yellow-400" /> {contest.instructor?.name || "N/A"}
            </span>
            <span className="flex items-center gap-2 bg-blue-800 text-blue-200 px-4 py-2 rounded-full text-lg font-bold">
              <FaPuzzlePiece className="text-green-400" /> {contest.questions?.length || 0} Questions
            </span>
            {contest.difficulty && (
              <span className="flex items-center gap-2 bg-blue-800 text-blue-200 px-4 py-2 rounded-full text-lg font-bold">
                <FaFire className="text-red-400" /> {contest.difficulty}
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-6 mt-6">
            <span className="flex items-center gap-2 text-blue-200 text-lg font-bold">
              <FaClock className="text-cyan-400" /> 
              <span>Starts:</span>
              <span className="text-white">{contest.startTime ? new Date(contest.startTime).toLocaleString() : "N/A"}</span>
            </span>
            <span className="flex items-center gap-2 text-blue-200 text-lg font-bold">
              <FaFlagCheckered className="text-pink-400" /> 
              <span>Ends:</span>
              <span className="text-white">{contest.endTime ? new Date(contest.endTime).toLocaleString() : "N/A"}</span>
            </span>
          </div>
          <button
            className="mt-10 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-extrabold py-4 px-12 rounded-xl shadow-lg transition-all duration-200 text-2xl tracking-wide"
            onClick={handleStartTest}
            aria-label="Start Test"
          >
            Start Contest
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsPage;