import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ContestDetailsCard({ contest, setConfirmationModal, handleRegister }) {
  const { user } = useSelector((state) => state.userProfile);
  const navigate = useNavigate();

  const {
    thumbnail: ThumbnailImage,
    _id: contestId,
    title,
    startDate,
    duration,
    problemsCount,
    rules,
    registeredUsers = [],
  } = contest;

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const isRegistered = user && registeredUsers.includes(user?._id);

  return (
    <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
      {/* Contest Image */}
      <img
        src={ThumbnailImage}
        alt={title}
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />

      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">
          {title}
        </div>
        <div className="flex flex-col gap-2 text-md">
          <span>Start: {startDate ? new Date(startDate).toLocaleString() : "TBA"}</span>
          <span>Duration: {duration || "TBA"}</span>
          <span>Problems: {problemsCount || 0}</span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <button
            className="yellowButton"
            onClick={
              isRegistered
                ? () => navigate(`/contest/${contestId}/participate`)
                : handleRegister
            }
          >
            {isRegistered ? "Go To Contest" : "Register"}
          </button>
        </div>
        <div className="mt-6">
          <p className="my-2 text-xl font-semibold">Contest Rules:</p>
          <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
            {rules?.map((item, i) => (
              <p className="flex gap-2" key={i}>
                <BsFillCaretRightFill />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
            onClick={handleShare}
          >
            <FaShareSquare size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContestDetailsCard;