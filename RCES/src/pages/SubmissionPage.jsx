import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { submissionEndpoints } from "../services/apis";

const { GET_SUBMISSIONS_API } = submissionEndpoints;

const SubmissionCard = ({ submission, onClick }) => (
  <div
    className="bg-richblack-800 rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 transition w-[320px]"
    onClick={onClick}
  >
    <img
      src={submission.contest?.thumbnail}
      alt={submission.contest?.title}
      className="w-full h-40 object-cover rounded"
    />
    <div className="mt-3">
      <h3 className="text-lg font-bold">{submission.contest?.title}</h3>
      <p className="text-sm text-richblack-300">
        {submission.contest?.startDate
          ? new Date(submission.contest.startDate).toLocaleString()
          : ""}
      </p>
      <p className="text-sm text-richblack-400">
        By {submission.contest?.instructor?.name || "Unknown"}
      </p>
      <p className="text-sm text-richblack-400 mt-2">
        Status: <span className="font-semibold">{submission.status}</span>
      </p>
      <p className="text-sm text-richblack-400">
        Submitted At:{" "}
        {submission.createdAt
          ? new Date(submission.createdAt).toLocaleString()
          : ""}
      </p>
    </div>
  </div>
);

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await apiConnector("GET", GET_SUBMISSIONS_API);
        setSubmissions(res.data?.submissions || []);
      } catch (err) {
        setSubmissions([]);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Contest Submissions</h1>
      <div className="flex flex-wrap gap-6">
        {submissions.length === 0 && <p>No submissions found.</p>}
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission._id}
            submission={submission}
            onClick={() =>
              navigate(`/contests/${submission.contest?._id}/submissions`)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SubmissionsPage;