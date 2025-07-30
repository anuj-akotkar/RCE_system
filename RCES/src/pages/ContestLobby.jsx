import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiconnector";
import { contestEndpoints } from "../services/apis";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import SubmitContestModal from "../components/Core/Contest/SubmitContestModal";
import FeedbackModal from "../components/Core/Contest/FeedbackModal";
import { submitFeedback } from "../services/operations/feedbackAPI";

// A reusable timer component
const ContestTimer = ({ endTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        // ✅ CORRECTED: Display 00:00:00 when time is up
        setTimeLeft("00:00:00"); 
        onTimeUp();
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  return (
    <div className="text-2xl font-bold text-red-500 bg-gray-800 px-4 py-2 rounded-lg">
      Time Remaining: {timeLeft}
    </div>
  );
};


const ContestLobby = () => {
  const { contestName,contestId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  // ✅ ADDED STATE: To manage the effective end time for the timer
  const [effectiveEndTime, setEffectiveEndTime] = useState(null);
  
  // Placeholder for tracking solved questions
  const [solvedQuestions, setSolvedQuestions] = useState([]);

  // Modal states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isAutoSubmit, setIsAutoSubmit] = useState(false); 

  useEffect(() => {
    const fetchContestDetails = async () => {
      setLoading(true);
      try {
        const res = await apiConnector(
          "GET",
          `${contestEndpoints.GET_FULL_CONTEST_DETAILS_API}/${contestId}`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        const contestData = res.data?.contest;
        setContest(contestData);
        console.log("contestdata form contestlobby ",contestData);

        // ✅ LOGIC: Implement the 45-minute default timer
        if (contestData) {
          const serverEndTime = new Date(contestData.endTime).getTime();
          const now = new Date().getTime();

          if (serverEndTime < now) {
            // If contest from server has already ended, start a new 45-min timer
            console.warn("Contest end time is in the past. Starting a new 45-minute session.");
            const newEndTime = new Date(now + 45 * 60 * 1000);
            setEffectiveEndTime(newEndTime);
          } else {
            // Otherwise, use the end time from the server
            setEffectiveEndTime(contestData.endTime);
          }
        }

      } catch (error) {
        console.error("Failed to fetch contest details:", error);
      }
      setLoading(false);
    };
    fetchContestDetails();
  }, [contestId, token]);

  const handleAutoSubmit = () => {
    console.log("Time is up! Auto-submitting contest.");
    setIsAutoSubmit(true);
    setShowFeedbackModal(true);
  };

  const handleSubmitContest = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    setIsAutoSubmit(false);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await submitFeedback(feedbackData, token);
      // Navigate to leaderboard after feedback
      navigate(`/contests/${contestId}/leaderboard`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Still navigate to leaderboard even if feedback fails
      navigate(`/contests/${contestId}/leaderboard`);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    // Navigate to leaderboard when feedback modal is closed
    navigate(`/contests/${contestId}/leaderboard`);
  };

  if (loading) {
    return <div className="text-center text-white p-10">Loading Contest...</div>;
  }

  if (!contest) {
    return <div className="text-center text-red-500 p-10">Failed to load contest.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">{contest.title}</h1>
          {/* ✅ UPDATED: Pass the new effectiveEndTime to the timer */}
          <ContestTimer endTime={effectiveEndTime} onTimeUp={handleAutoSubmit} />
        </div>
        <p className="text-gray-400 mb-8">{contest.description}</p>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Problems</h2>
            <div className="space-y-3">
               
                {contest.questions?.map((question, index) => (
                    <Link 
                        to={`/contests/${contestName}/${contestId}/question/${question._id}/${index}/take`} 
                        key={question._id}
                        className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                        <div className="flex items-center">
                            {solvedQuestions.includes(question._id) ? (
                                <FaCheckCircle className="text-green-500 mr-4" />
                            ) : (
                                <span className="text-gray-500 mr-4 font-bold">{index + 1}.</span>
                            )}
                            <span className="text-lg">{question.title}</span>
                        </div>
                        <span className="text-sm text-gray-400">{question.difficulty}</span>
                    </Link>
                ))}
            </div>
        </div>

        <div className="mt-10 text-center space-x-4">
            <button 
                onClick={() => navigate(`/contests/${contestId}/leaderboard`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105"
            >
                View Leaderboard
            </button>
            <button 
                onClick={handleSubmitContest}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105"
            >
                Submit Contest
            </button>
        </div>
      </div>

      {/* Modals */}
      <SubmitContestModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        contestTitle={contest?.title || "Contest"}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        onSubmitFeedback={handleFeedbackSubmit}
        contestTitle={contest?.title || "Contest"}
      />
    </div>
  );
};

export default ContestLobby;
