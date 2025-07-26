import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import QuestionPanel from "../../components/QuestionPanel";
import CodeEditor from "../../components/CodeEditor";
import OutputPanel from "../../components/OutputPanel";
import axios from "axios";

const ViewContestPage = () => {
  const { contestId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [contestEnded, setContestEnded] = useState(false);

  // Fetch contest and questions only once
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setError("");
        const res = await axios.get(`/api/contests/${contestId}`);
        const contestData = res.data.contest;
        const allQuestions = contestData.sections.flatMap(sec => sec.questions);
        setQuestions(allQuestions);
        setSelectedQuestion(allQuestions[0]);
        // Setup timer
        const end = new Date(contestData.endTime).getTime();
        const now = new Date().getTime();
        const msLeft = end - now;
        setTimeLeft(msLeft > 0 ? msLeft : 0);
        setContestEnded(msLeft <= 0);
      } catch (err) {
        setError("Failed to load contest. Please try again later.");
      }
    };
    fetchContest();
    // eslint-disable-next-line
  }, [contestId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setContestEnded(true);
      setTimeLeft(0);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          setContestEnded(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRun = async (code) => {
    if (contestEnded) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/submission/run", {
        language,
        code,
        testCases: selectedQuestion.publicTestCases,
      });
      setOutput(res.data);
    } catch (err) {
      setOutput({ success: false, error: "Failed to run code. Please try again." });
      setError("Failed to run code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (code) => {
    if (contestEnded) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/submission/submit", {
        questionId: selectedQuestion._id,
        language,
        code,
      });
      setOutput(res.data);
    } catch (err) {
      setOutput({ success: false, error: "Failed to submit code. Please try again." });
      setError("Failed to submit code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-screen bg-gray-100">
      <div className="lg:col-span-1">
        <QuestionPanel
          questions={questions}
          selected={selectedQuestion}
          onSelect={setSelectedQuestion}
        />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div
          className="bg-yellow-100 text-yellow-900 text-sm px-4 py-2 rounded shadow mb-2 text-right font-semibold"
          aria-live="polite"
        >
          ⏱ Time Remaining: {timeLeft !== null ? formatTime(timeLeft) : "--:--:--"}
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
        {contestEnded && (
          <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded mb-2 font-bold" aria-live="assertive">
            Contest has ended. You can no longer submit or run code.
          </div>
        )}
        <CodeEditor
          language={language}
          setLanguage={setLanguage}
          onRun={handleRun}
          onSubmit={handleSubmit}
          loading={loading}
          disabled={contestEnded}
          questionId={selectedQuestion?._id}
          token={token}
        />
        <OutputPanel output={output} />
      </div>
    </div>
  );
};

export default ViewContestPage;