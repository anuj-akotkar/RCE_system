// Updated TakeContest.jsx - Support Practice Mode
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTrophy, 
  FaInfoCircle,
  FaGraduationCap,
  FaMedal 
} from "react-icons/fa";

import QuestionPanel from "./QuestionPanel";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import { contestEndpoints } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { runCode, submitCode, checkContestCompletion, submitContest } from "../../../services/operations/codeAPI";

const { GET_FULL_CONTEST_DETAILS_API } = contestEndpoints;

const TakeContest = () => {
  const { contestName, contestId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  // Contest data
  const [contest, setContest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contestLoading, setContestLoading] = useState(true);
  
  // Contest progress and mode
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [contestCompletion, setContestCompletion] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    completionPercentage: 0,
    canSubmitContest: false,
    questionsRemaining: 0,
    contestStatus: 'upcoming',
    participationMode: 'contest',
    eligibleForLeaderboard: true,
    allowPracticeMode: true
  });
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [contestEnded, setContestEnded] = useState(false);
  const [contestStarted, setContestStarted] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  // Fetch contest completion status
  const fetchContestCompletion = useCallback(async () => {
    if (!contestId || !token) return;
    
    try {
      const completion = await checkContestCompletion(contestId, token);
      setContestCompletion(completion);
      
      // Update practice mode state
      setPracticeMode(completion.participationMode === 'practice');
      
      // Fetch progress for completed questions
      try {
        const progress = await apiConnector(
          "GET",
          `/api/v1/contestprogress/getProgressPercentage/${contestId}`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        
        if (progress.data.success && progress.data.completedQuestions) {
          setCompletedQuestions(progress.data.completedQuestions);
        }
      } catch (progressError) {
        console.error("Error fetching progress:", progressError);
      }
    } catch (error) {
      console.error("❌ Error fetching contest completion:", error);
    }
  }, [contestId, token]);

  // Fetch contest questions and setup
  useEffect(() => {
    const fetchContestData = async () => {
      if (!token || !contestId) return;
      
      setContestLoading(true);
      try {
        console.log("🔄 Fetching contest data for:", contestId);
        
        const res = await apiConnector(
          "GET",
          `${GET_FULL_CONTEST_DETAILS_API}/${contestId}`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        
        console.log("📦 Contest data received:", res.data);
        
        const contestData = res.data?.contest;
        if (!contestData) {
          throw new Error("Contest not found");
        }
        
        setContest(contestData);
        const contestQuestions = contestData.questions || [];
        setQuestions(contestQuestions);
        setSelected(contestQuestions[0]);
        
        // Setup timer and contest status
        const now = new Date();
        const startTime = new Date(contestData.startTime);
        const endTime = new Date(contestData.endTime);
        
        if (now < startTime) {
          setContestStarted(false);
          setContestEnded(false);
          setTimeLeft(startTime.getTime() - now.getTime());
        } else if (now >= startTime && now <= endTime) {
          setContestStarted(true);
          setContestEnded(false);
          setTimeLeft(endTime.getTime() - now.getTime());
        } else {
          setContestStarted(true);
          setContestEnded(true);
          setPracticeMode(true);
          setTimeLeft(0);
        }
        
        // Fetch completion status
        await fetchContestCompletion();
        
      } catch (err) {
        console.error("❌ Error fetching contest:", err);
        toast.error("Failed to load contest data");
        navigate("/contests");
      } finally {
        setContestLoading(false);
      }
    };

    fetchContestData();
  }, [contestId, token, navigate, fetchContestCompletion]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (contestStarted && !contestEnded) {
        setContestEnded(true);
        setPracticeMode(true);
        toast.info("⏰ Contest has ended! You can now continue in practice mode.");
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          if (!contestStarted) {
            setContestStarted(true);
            toast.success("🚀 Contest has started!");
            return null;
          } else {
            setContestEnded(true);
            setPracticeMode(true);
            toast.info("⏰ Contest has ended! Switching to practice mode.");
            return 0;
          }
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, contestStarted, contestEnded]);

  // Format time display
  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handler for running code
  const handleRun = async (code, customInput = "") => {
    if (!selected) {
      toast.error("Please select a question first");
      return { success: false, error: "No question selected" };
    }
    
    setLoading(true);
    setOutput(null);
    
    try {
      const result = await runCode({
        code,
        language,
        questionId: selected._id,
        token: token,
        customInput,
      });
      
      setOutput(result);
      
      // Show practice mode notification if applicable
      if (result.participationMode === 'practice') {
        toast.info("🎓 Running in practice mode - results won't affect leaderboard");
      }
      
      return result;
    } catch (err) {
      console.error("❌ Run code error:", err);
      const errorResult = { 
        success: false, 
        error: "Run failed", 
        message: err.message || "Failed to execute code"
      };
      setOutput(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  // Handler for submitting code
  const handleSubmit = async (code) => {
    if (!selected) {
      toast.error("Please select a question first");
      return { success: false, error: "No question selected" };
    }
    
    setLoading(true);
    setOutput(null);
    
    try {
      const result = await submitCode({
        code,
        language,
        questionId: selected._id,
        token,
      });
      
      setOutput(result);
      
      // Show appropriate success message based on mode
      if (result.success && result.submission?.status === 'Accepted') {
        await fetchContestCompletion();
        
        if (!completedQuestions.includes(selected._id)) {
          setCompletedQuestions(prev => [...prev, selected._id]);
        }
        
        if (result.participationMode === 'practice') {
          toast.success("🎓 Solution accepted in practice mode!");
        }
      }
      
      return result;
    } catch (err) {
      console.error("❌ Submit code error:", err);
      const errorResult = { 
        success: false, 
        error: "Submit failed", 
        message: err.message || "Failed to submit code"
      };
      setOutput(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  // Handler for submitting entire contest
  const handleSubmitContest = async () => {
    if (!contestCompletion.canSubmitContest) {
      toast.error(`Complete all questions first! (${contestCompletion.questionsRemaining} remaining)`);
      return;
    }

    const modeText = practiceMode ? "practice session" : "contest";
    const confirmMessage = practiceMode 
      ? `Submit your practice session? This will mark your practice as complete.`
      : `Submit the contest? This action cannot be undone and will finalize your contest participation.`;

    const confirmSubmit = window.confirm(confirmMessage);
    
    if (!confirmSubmit) return;

    try {
      const result = await submitContest(contestId, token);
      if (result.success) {
        if (practiceMode) {
          toast.success("🎓 Practice session submitted successfully!");
        } else {
          toast.success("🎉 Contest submitted successfully!");
        }
        navigate(`/contests/${contestId}/results`);
      }
    } catch (error) {
      console.error("❌ Contest submission error:", error);
    }
  };

  // Practice mode banner component
  const PracticeModeBanner = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-4">
      <div className="flex items-center">
        <FaGraduationCap className="text-blue-500 mr-3 text-xl" />
        <div>
          <h3 className="text-blue-800 font-bold">Practice Mode</h3>
          <p className="text-blue-700 text-sm">
            Contest has ended. You're now in practice mode - solve problems for learning, 
            but submissions won't count toward the leaderboard.
          </p>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (contestLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  // Contest not started
  if (!contestStarted) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md">
          <FaClock className="text-yellow-600 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-yellow-800 mb-2">Contest Starts Soon</h2>
          <p className="text-yellow-700 mb-4">
            Contest will begin in: <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </p>
          <p className="text-sm text-yellow-600">
            Stay on this page. The contest will start automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer and progress */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">{contest?.title}</h1>
            
            {/* Mode indicator */}
            {practiceMode ? (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <FaGraduationCap />
                <span className="text-sm font-medium">Practice Mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <FaMedal />
                <span className="text-sm font-medium">Contest Mode</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Progress:</span>
              <span className="font-semibold">
                {contestCompletion.completedQuestions}/{contestCompletion.totalQuestions}
              </span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${contestCompletion.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Contest completion status */}
            {contestCompletion.canSubmitContest && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaCheckCircle />
                <span className="text-sm font-medium">Ready to Submit</span>
              </div>
            )}
            
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
              practiceMode
                ? 'bg-blue-100 text-blue-800'
                : contestEnded 
                  ? 'bg-red-100 text-red-800' 
                  : timeLeft && timeLeft < 300000 // 5 minutes
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
            }`}>
              <FaClock />
              {practiceMode ? "PRACTICE" : contestEnded ? "ENDED" : formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Practice mode banner */}
      {practiceMode && <PracticeModeBanner />}

      {/* Leaderboard eligibility notice */}
      {!contestCompletion.eligibleForLeaderboard && !practiceMode && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
          <div className="flex items-center">
            <FaInfoCircle className="text-orange-500 mr-2" />
            <p className="text-orange-700 text-sm">
              Your submissions won't be eligible for leaderboard ranking since you started after the contest ended.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left: Question Panel */}
        <div className="w-1/2 border-r bg-white overflow-hidden">
          <QuestionPanel
            questions={questions}
            selected={selected}
            onSelect={setSelected}
            completedQuestions={completedQuestions}
            practiceMode={practiceMode}
          />
        </div>

        {/* Right: Code Editor and Output */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
            {/* Code Editor */}
            <div className="flex-1">
              <CodeEditor
                language={language}
                setLanguage={setLanguage}
                onRun={handleRun}
                onSubmit={handleSubmit}
                loading={loading}
                questionName={selected?.title}
                questionId={selected?._id}
                contestId={contestId}
                contestName={contestName}
                token={token}
                completedQuestions={completedQuestions}
                canSubmitContest={contestCompletion.canSubmitContest}
                onSubmitContest={handleSubmitContest}
                disabled={false} // Always allow submissions in practice mode
                practiceMode={practiceMode}
              />
            </div>

            {/* Output Panel */}
            <div className="flex-1">
              <OutputPanel output={output} practiceMode={practiceMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Selected: <strong>{selected?.title || "No question selected"}</strong></span>
            <span>Language: <strong>{language.toUpperCase()}</strong></span>
            {practiceMode && (
              <span className="text-blue-600 font-medium">
                🎓 Practice Mode - Learning focused, no leaderboard impact
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {contestCompletion.questionsRemaining > 0 && (
              <span className="text-orange-600">
                {contestCompletion.questionsRemaining} questions remaining
              </span>
            )}
            
            {contestCompletion.canSubmitContest && (
              <button
                onClick={handleSubmitContest}
                className={`px-4 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                  practiceMode 
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
                disabled={loading}
              >
                <FaTrophy />
                {practiceMode ? "Submit Practice" : "Submit Contest"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeContest;