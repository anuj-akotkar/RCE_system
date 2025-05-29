import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTrophy } from "react-icons/im";

const ContestCard = ({ cardData, currentCard, setCurrentCard }) => {
  return (
    <div
      className={`w-[360px] lg:w-[30%] ${
        currentCard === cardData?.title
          ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
          : "bg-richblack-800"
      } text-richblack-25 h-[300px] box-border cursor-pointer`}
      onClick={() => setCurrentCard(cardData?.title)}
    >
      <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <div
          className={`${
            currentCard === cardData?.title && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {cardData?.title}
        </div>
        <div className="text-richblack-400">{cardData?.description}</div>
      </div>
      <div
        className={`flex justify-between ${
          currentCard === cardData?.title ? "text-blue-300" : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        {/* Difficulty */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTrophy />
          <p>{cardData?.difficulty || "Unknown"}</p>
        </div>
        {/* Participants */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.participants || 0} Participants</p>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;