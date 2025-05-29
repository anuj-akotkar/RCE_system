import React from 'react';
import HighlightText from './HighlightText';
import CTAButton from "./CTAButton";
import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

const LearningLanguageSection = () => {
  return (
    <div>
      <div className="text-4xl font-semibold text-center my-10">
        Your swiss knife for
        <HighlightText text={"learning any language"} />
        <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
          Using Spin makes learning multiple languages easy. With 20+ languages, realistic voice-over, progress tracking, custom schedule, and more.
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
          <img
            src={Know_your_progress}
            alt="Track your coding progress"
            className="object-contain  lg:-mr-32 "
          />
          <img
            src={Compare_with_others}
            alt="Compare with other coders"
            className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
          />
          <img
            src={Plan_your_lessons}
            alt="Plan your learning schedule"
            className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
          />
        </div>
      </div>

      <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
        <CTAButton active={true} linkto={"/signup"}>
          <div>Learn More</div>
        </CTAButton>
      </div>
    </div>
  );
};

export default LearningLanguageSection;