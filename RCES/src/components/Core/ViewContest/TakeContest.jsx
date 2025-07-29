import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import QuestionPanel from "./QuestionPanel";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import { contestEndpoints } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { runCode, submitCode } from "../../../services/operations/codeAPI";

const { GET_FULL_CONTEST_DETAILS_API } = contestEndpoints;

const TakeContest = () => {
  const { contestName, contestId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { token } = useSelector((state) => state.auth);
 // console.log("TakeContest props:", { contestId, token, contestName });
  // Fetch contest questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${GET_FULL_CONTEST_DETAILS_API}/${contestId}`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        console.log("Contest Questions:", res.data);
        const contestQuestions = res.data?.contest?.questions || [];
        setQuestions(contestQuestions);
        setSelected(contestQuestions[0]);
        console.log("Selected Question:", contestQuestions[0]);
      } catch (err) {
        console.error("Error fetching contest questions:", err);
        setQuestions([]);
      }
    };
    if (token) fetchQuestions();
  }, [contestId, token]);

  // Handler for running code
  const handleRun = async (code) => {
    if (!selected) {
      console.error("No question selected");
      return;
    }
    
    setLoading(true);
    setOutput(null);
    
    try {
      const result = await runCode({
        code,
        language,
        questionId: selected._id,
        token:token,
        input,
      });
      setOutput(result);
    } catch (err) {
      console.error("Run code error:", err);
      setOutput({ 
        success: false, 
        error: "Run failed", 
        message: err.message || "Failed to execute code"
      });
    }
    setLoading(false);
  };

  // Handler for submitting code
  const handleSubmit = async (code) => {
    if (!selected) {
      console.error("No question selected");
      return;
    }
    
    setLoading(true);
    setOutput(null);
    
    try {
      const result = await submitCode({
        code,
        language,
        questionId: selected._id,
        token:token,
        input,
      });
      setOutput(result);
    } catch (err) {
      console.error("Submit code error:", err);
      setOutput({ 
        success: false, 
        error: "Submit failed", 
        message: err.message || "Failed to submit code"
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left: Question Panel */}
      <div className="w-1/2 border-r bg-gray-50 p-4 overflow-y-auto">
        <QuestionPanel
          questions={questions}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
      {/* Right: Code Editor and Output */}
      <div className="w-1/2 flex flex-col bg-gray-100 p-4">
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
        />
        {/* Input box for stdin */}

        <textarea
          className="w-full mt-2 p-2 border rounded"
          rows={3}
          placeholder="Custom Input (stdin)"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <div className="mt-4 flex-1">
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  );
};

export default TakeContest;