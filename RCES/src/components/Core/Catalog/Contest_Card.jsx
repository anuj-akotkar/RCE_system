import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../Common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

function ContestCard({ contest, height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(contest.ratingAndReviews);
    setAvgReviewCount(count);
  }, [contest]);

  return (
    <Link to={`/contests/${contest._id}`}>
      <div>
        <div className="rounded-lg">
          <img
            src={contest?.thumbnail}
            alt="contest thumbnail"
            className={`${height} w-full rounded-xl object-cover`}
          />
        </div>
        <div className="flex flex-col gap-2 px-1 py-3">
          <p className="text-xl text-richblack-5">{contest?.title}</p>
          <p className="text-sm text-richblack-50">
            {contest?.instructor?.firstName} {contest?.instructor?.lastName}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-yellow-5">{avgReviewCount || 0}</span>
            <RatingStars reviewCount={avgReviewCount} />
            <span className="text-richblack-400">
              {contest?.ratingAndReviews?.length} Ratings
            </span>
          </div>
          <p className="text-md text-richblack-5">
            Difficulty: {contest?.difficulty}
          </p>
          <p className="text-md text-richblack-5">
            Starts: {contest?.startDate ? new Date(contest.startDate).toLocaleString() : "TBA"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ContestCard;