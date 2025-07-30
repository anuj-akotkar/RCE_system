import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchLeaderboard } from "../services/operations/leaderboardAPI";
import { FaTrophy, FaMedal, FaCrown, FaArrowLeft } from "react-icons/fa";

const Leaderboard = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userProfile);
  const { token } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await fetchLeaderboard(contestId, token);
        setLeaderboard(data);
        setError("");
      } catch (err) {
        setError("Failed to load leaderboard");
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    
    return () => clearInterval(interval);
  }, [contestId, token]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-400 text-xl" />;
    if (rank === 2) return <FaMedal className="text-gray-300 text-xl" />;
    if (rank === 3) return <FaTrophy className="text-orange-500 text-xl" />;
    return <span className="text-gray-400 font-bold">{rank}</span>;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Contest ID: {contestId}</p>
            <p className="text-sm text-gray-500">Updates every 30 seconds</p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Player</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Time Taken</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No participants yet. Be the first to join!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => {
                    const isCurrentUser = user && entry.user._id === user._id;
                    return (
                      <tr 
                        key={entry._id} 
                        className={`${isCurrentUser ? 'bg-blue-900/20 border-l-4 border-blue-500' : 'hover:bg-gray-700/50'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {getRankIcon(index + 1)}
                            {index > 2 && <span className="text-gray-400 font-bold">{index + 1}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold">
                                {entry.user.firstName?.charAt(0) || entry.user.email?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {entry.user.firstName} {entry.user.lastName}
                                {isCurrentUser && <span className="ml-2 text-blue-400">(You)</span>}
                              </p>
                              <p className="text-sm text-gray-400">{entry.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xl font-bold text-green-400">{entry.score}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-300">
                          {formatTime(entry.timeTaken)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            entry.score > 0 ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {entry.score > 0 ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current User Stats */}
        {user && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Your Rank</p>
                <p className="text-2xl font-bold text-blue-400">
                  {leaderboard.findIndex(entry => entry.user._id === user._id) + 1 || 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Your Score</p>
                <p className="text-2xl font-bold text-green-400">
                  {leaderboard.find(entry => entry.user._id === user._id)?.score || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Participants</p>
                <p className="text-2xl font-bold text-gray-300">{leaderboard.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 