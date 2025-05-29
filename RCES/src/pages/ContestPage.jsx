import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { contestEndpoints } from "../services/apis";

const { GET_ALL_CONTESTS_API } = contestEndpoints;

function categorizeContests(contests) {
  const now = new Date();
  return {
    upcoming: contests.filter(c => new Date(c.startTime) > now),
    ongoing: contests.filter(
      c => new Date(c.startTime) <= now && new Date(c.endTime) >= now
    ),
    past: contests.filter(c => new Date(c.endTime) < now),
  };
}

const ContestCard = ({ contest, onClick }) => (
  <div
    className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-xl shadow-lg p-0 cursor-pointer hover:scale-105 transition-transform w-[320px] border border-blue-600 hover:border-blue-400"
    onClick={onClick}
  >
    <div className="relative">
      <img
        src={contest.thumbnail || "https://via.placeholder.com/320x160?text=No+Image"}
        alt={contest.title}
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
        {contest.timeLimit} min
      </span>
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold text-white mb-1 truncate">{contest.title}</h3>
      <p className="text-xs text-blue-200 mb-2">
        {new Date(contest.startTime).toLocaleString()} - {new Date(contest.endTime).toLocaleString()}
      </p>
      <p className="text-sm text-blue-100 mb-2 line-clamp-2">{contest.description}</p>
      <p className="text-xs text-blue-300">By {contest.instructor?.name || "Unknown"}</p>
    </div>
  </div>
);

const Contests = () => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await apiConnector("GET", GET_ALL_CONTESTS_API);
        setContests(res.data?.contests || []);
      } catch (err) {
        setContests([]);
      }
    };
    fetchContests();
  }, []);

  const { upcoming, ongoing, past } = categorizeContests(contests);

  return (
    <div className="w-11/12 mx-auto p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-blue-500 text-center tracking-tight">
        All Contests
      </h1>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Ongoing Contests</h2>
        <div className="flex flex-wrap gap-8">
          {ongoing.length === 0 && <p className="text-blue-400">No ongoing contests.</p>}
          {ongoing.map(contest => (
            <ContestCard
              key={contest._id}
              contest={contest}
              onClick={() => navigate(`/contests/${contest._id}`)}
            />
          ))}
        </div>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Upcoming Contests</h2>
        <div className="flex flex-wrap gap-8">
          {upcoming.length === 0 && <p className="text-blue-400">No upcoming contests.</p>}
          {upcoming.map(contest => (
            <ContestCard
              key={contest._id}
              contest={contest}
              onClick={() => navigate(`/contests/${contest._id}`)}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Past Contests</h2>
        <div className="flex flex-wrap gap-8">
          {past.length === 0 && <p className="text-blue-400">No past contests.</p>}
          {past.map(contest => (
            <ContestCard
              key={contest._id}
              contest={contest}
              onClick={() => navigate(`/contests/${contest._id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contests;