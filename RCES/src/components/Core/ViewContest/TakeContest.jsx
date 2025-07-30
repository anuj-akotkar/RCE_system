import React, { useEffect, useState } from "react";
import { useParams,useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import QuestionPanel from "./QuestionPanel";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import SubmissionHistory from "./SubmissionHistory";
import { contestEndpoints } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { runCode, submitCode } from "../../../services/operations/codeAPI";
import { FaArrowLeft, FaArrowRight, FaList, FaHistory } from "react-icons/fa";

const { GET_FULL_CONTEST_DETAILS_API } = contestEndpoints;

const TakeContest = () => {
  const navigate=useNavigate();
  const { contestName, contestId,questionId,index} = useParams();
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const currentIndex = parseInt(index, 10);

  // ✅ 2. Add state to control the visibility of the history modal
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await apiConnector(
          "GET",
          `${GET_FULL_CONTEST_DETAILS_API}/${contestId}`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        const contestQuestions = res.data?.contest?.questions || [];
        setQuestions(contestQuestions);
        if (contestQuestions.length > 0) {
          setSelected(contestQuestions[0]);
        }
      } catch (error) {
        console.error("Failed to fetch contest details:", error);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [contestId, token]);


  useEffect(() => {
    if (questions.length > 0 && currentIndex >= 0 && currentIndex < questions.length) {
      setSelected(questions[currentIndex]);
    }
  }, [questions, currentIndex]);

  // ✅ CORRECTED: These functions now accept 'code' and 'language' from the child.
  const handleRun = async (code, language) => {
    if (!selected) return;
    setLoading(true);
    setOutput(null); // Clear previous output
    try {
      const result = await runCode({
        language,
        code,
        questionId: selected._id,
        token,
      });
      setOutput(result);
    } catch (err) {
      console.error("Run code error:", err);
      setOutput({
        success: false,
        message: err.message || "Failed to run code",
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (code, language) => {
    if (!selected) return;
    setLoading(true);
    setOutput(null); // Clear previous output
    try {
      const result = await submitCode({
        language,
        code,
        questionId: selected._id,
        token,
      });
      setOutput(result);
    } catch (err) {
      console.error("Submit code error:", err);
      setOutput({
        success: false,
        message: err.message || "Failed to submit code",
      });
    }
    setLoading(false);
  };
  
   const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      navigate(`/contests/${contestName}/${contestId}/question/${questionId}/${currentIndex + 1}/take`);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      navigate(`/contests/${contestName}/${contestId}/question/${questionId}/${currentIndex - 1}/take`);
    }
  };

  const goToLobby = () => {
    navigate(`/contests/${contestName}/${contestId}/lobby`);
  };
  
  const handleSelectQuestion = (question) => {
    const questionIdx = questions.findIndex(q => q._id === question._id);
    if (questionIdx !== -1) {
      navigate(`/contests/${contestName}/${contestId}/lobby`);
    }
  };

  return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-gray-100 dark:bg-gray-900">
        <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button onClick={goToLobby} className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded">
              <FaList />
              Problems List
          </button>
          
          {/* ✅ 3. Add the Submission History button */}
          <button 
              onClick={() => setIsHistoryVisible(true)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
              <FaHistory />
              Submissions
          </button>
  
          <div className="flex gap-2">
               <button onClick={goToPreviousQuestion} disabled={currentIndex === 0} className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50">
                  <FaArrowLeft />
                  Back
              </button>
              <button onClick={goToNextQuestion} disabled={currentIndex === questions.length - 1} className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50">
                  Next
                  <FaArrowRight />
              </button>
          </div>
        </div>
  
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <QuestionPanel
              questions={questions}
              selected={selected}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
          <div className="w-1/2 flex flex-col p-4 overflow-y-auto">
            <div className="flex-grow mb-4">
              <CodeEditor
                onRun={handleRun}
                onSubmit={handleSubmit}
                loading={loading}
                questionName={selected?.title}
                questionId={selected?._id}
                contestId={contestId}
                contestName={contestName}
                token={token}
              />
            </div>
            <div className="flex-shrink-0 h-2/5">
              <OutputPanel output={output} />
            </div>
          </div>
        </div>
  
        {/* ✅ 4. Render the SubmissionHistory component as a modal */}
        <SubmissionHistory
          questionId={selected?._id}
          isOpen={isHistoryVisible}
          onClose={() => setIsHistoryVisible(false)}
        />
      </div>
    );
};

export default TakeContest;
