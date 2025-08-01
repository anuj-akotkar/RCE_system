import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import ContestCard from "./contestCard";
import HighlightText from "./HighlightText";

const tabsName = [
  "Upcoming",
  "For Beginners",
  "Most Popular",
  "Short Contests",
  "Long Contests",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [contests, setContests] = useState(HomePageExplore[0].contests);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].contests[0].title
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((contest) => contest.tag === value);
    setContests(result[0].contests);
    setCurrentCard(result[0].contests[0].title);
  };

  return (
    <div>
      {/* Explore more section */}
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Unlock the
          <HighlightText text={"Power of Code"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
            Compete, Learn, and Win Coding Contests!
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((ele, index) => (
          <div
            className={` text-[16px] flex flex-row items-center gap-2 ${
              currentTab === ele
                ? "bg-richblack-900 text-richblack-5 font-medium"
                : "text-richblack-200"
            } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
            key={index}
            onClick={() => setMyCards(ele)}
          >
            {ele}
          </div>
        ))}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Cards Group */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {contests.map((ele, index) => (
          <ContestCard
            key={index}
            cardData={ele}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;