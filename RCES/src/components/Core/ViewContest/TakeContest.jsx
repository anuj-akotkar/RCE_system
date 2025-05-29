import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionPanel from "./QuestionPanel";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import { contestEndpoints, codeEndpoints } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";

const { GET_FULL_CONTEST_DETAILS_API } = contestEndpoints;
const { RUN_CODE_API, SUBMIT_CODE_API } = codeEndpoints;

const TakeContest = () => {
  const { contestId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch contest questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${GET_FULL_CONTEST_DETAILS_API}/${contestId}`
        );
        // Adjust according to your API response structure
        const contestQuestions = res.data?.contest?.questions || [];
        setQuestions(contestQuestions);
        setSelected(contestQuestions[0]);
      } catch (err) {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [contestId]);

  // Handler for running code
  const handleRun = async (code) => {
    setLoading(true);
    try {
      const res = await apiConnector("POST", RUN_CODE_API, {
        code,
        language,
        questionId: selected._id,
      });
      setOutput(res.data);
    } catch (err) {
      setOutput({ error: "Run failed" });
    }
    setLoading(false);
  };

  // Handler for submitting code
  const handleSubmit = async (code) => {
    setLoading(true);
    try {
      const res = await apiConnector("POST", SUBMIT_CODE_API, {
        code,
        language,
        questionId: selected._id,
        contestId,
      });
      setOutput(res.data);
    } catch (err) {
      setOutput({ error: "Submit failed" });
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
        />
        <div className="mt-4">
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  );
};

export default TakeContest;