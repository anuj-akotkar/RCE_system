import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../services/apiconnector';
import { contestEndpoints } from '../../services/apis';
import CodeEditor from './CodeEditor';
import toast from 'react-hot-toast';

const ContestProblemView = () => {
  const { contestId, questionId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    fetchContestDetails();
  }, [contestId]);

  useEffect(() => {
    if (contest && questionId) {
      const index = contest.questions.findIndex(q => q._id === questionId);
      if (index !== -1) {
        setQuestionIndex(index);
        setCurrentQuestion(contest.questions[index]);
      }
    }
  }, [contest, questionId]);

  const fetchContestDetails = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${contestEndpoints.GET_FULL_CONTEST_DETAILS_API}/${contestId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.data?.success) {
        setContest(response.data.contest);
      }
    } catch (error) {
      console.error("Error fetching contest:", error);
      toast.error("Failed to load contest");
      navigate('/contests');
    } finally {
      setLoading(false);
    }
  };

  const navigateToQuestion = (index) => {
    if (contest && contest.questions[index]) {
      navigate(`/contest/${contestId}/problem/${contest.questions[index]._id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!contest || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Question not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/contest/${contestId}`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Contest
            </button>
            <h1 className="text-xl font-semibold text-white">{contest.title}</h1>
          </div>
          
          {/* Question Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToQuestion(questionIndex - 1)}
              disabled={questionIndex === 0}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-400 mx-2">
              {questionIndex + 1} / {contest.questions.length}
            </span>
            <button
              onClick={() => navigateToQuestion(questionIndex + 1)}
              disabled={questionIndex === contest.questions.length - 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor question={currentQuestion} contestId={contestId} />
      </div>
    </div>
  );
};

export default ContestProblemView;