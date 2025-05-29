import React from "react";
import HighlightText from "../../../components/Core/HomePage/HighlightText";
import CTAButton from "../../../components/Core/HomePage/CTAButton";

const LearningGridArray = [
  {
    order: -1,
    heading: "Elite Coding Arena for",
    highliteText: "Anyone, Anywhere",
    description:
      "Whether you're a night owl coder or a coffee-fueled morning warrior, our platform is open 24/7. All you need is curiosity... and maybe Wi-Fi.",
    BtnText: "Join the Code Battle",
    BtnLink: "/contests",//ye change kar hai baadme
  },
  {
    order: 1,
    heading: "Contests That Mirror Real Interviews",
    description:
      "We’ve taken the stress of whiteboard interviews and bottled it into fun, timed coding contests — minus the awkward stares from interviewers.",
  },
  {
    order: 2,
    heading: "Learn by Failing (Then Winning)",
    description:
      "Tired of theory? Good. Our platform throws you into actual problems where error messages are just friendly suggestions to do better.",
  },
  {
    order: 3,
    heading: "Instant Feedback & Autograding",
    description:
      "Submit code, get judged instantly. No professors. No mercy. Just green ticks... if you deserve them.",
  },
  {
    order: 4,
    heading: `Leaderboard, Bragging Rights & Glory`,
    description:
      "Climb the ranks, beat your batchmates, and screenshot your position like it’s an achievement — because it is.",
  },
  {
    order: 5,
    heading: "Built for Job Readiness",
    description:
      "We don't just help you solve problems. We help you solve them like someone who’s getting hired next week. Or next day. Or now.",
  },
];


const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "xl:col-span-2 xl:h-[294px]"}  ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"
            } ${card.order === 3 && "xl:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highliteText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
