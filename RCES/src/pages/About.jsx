import React from "react"

import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import ContactFormSection from "../components/Core/AboutPage/ContactFormSection"
import LearningGrid from "../components/Core/AboutPage/LearningGrid"
import Quote from "../components/Core/AboutPage/Quote"
import StatsComponenet from "../components/Core/AboutPage/Stats"
import HighlightText from "../components/Core/HomePage/HighlightText"

const About = () => {
      return (
        <div>
          <section className="bg-richblack-700">
            <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
              <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
                Empowering the Next Generation of Problem Solvers for a
                <HighlightText text={"Smarter Tomorrow"} />
                <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                  Our Coding Contest Platform is driving innovation in technical
                  education by bringing real-world coding challenges to students and
                  aspiring developers. We’re dedicated to creating a brighter future
                  by offering hands-on problem-solving, timed contests, and a
                  community that thrives on learning and competition.
                </p>
              </header>
              <div className="sm:h-[70px] lg:h-[150px]"></div>
              <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
                <img src={BannerImage1} alt="" />
                <img src={BannerImage2} alt="" />
                <img src={BannerImage3} alt="" />
              </div>
            </div>
          </section>
    
          <section className="border-b border-richblack-700">
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
              <div className="h-[100px] "></div>
              <Quote />
            </div>
          </section>
    
          <section>
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
              <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
                <div className="my-24 flex lg:w-[50%] flex-col gap-10">
                  <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                    Our Founding Story
                  </h1>
                  <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                    This platform was founded by a team of passionate developers,
                    educators, and mentors who saw the need for a space where
                    students could practice competitive programming in an
                    industry-level environment. We were driven by the belief that
                    talent is everywhere — it just needs the right platform to grow.
                  </p>
                  <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                    Traditional coding practice was isolated, monotonous, and often
                    lacked feedback. We wanted to change that. Our goal was to build
                    a space where anyone can participate in contests, solve real
                    interview-level questions, and track their progress like they do
                    on professional coding platforms.
                  </p>
                </div>
    
                <div>
                  <img
                    src={FoundingStory}
                    alt=""
                    className="shadow-[0_0_20px_0] shadow-[#FC6767]"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
                <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                  <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                    Our Vision
                  </h1>
                  <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                    We envision a world where coding contests aren't just
                    competitive, but collaborative — where students learn by doing,
                    by failing, and by improving. Through our timed challenges,
                    detailed feedback, and leaderboard tracking, we help learners
                    transform into confident coders and future innovators.
                  </p>
                </div>
                <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                  <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                    Our Mission
                  </h1>
                  <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                    Our mission is to provide students with the closest experience
                    to real-world coding interviews and competitions. We aim to
                    build not just a platform, but a thriving ecosystem of learners
                    and educators — united through practice, feedback, and growth.
                    With structured contests, expert-curated problems, and real-time
                    code execution, we’re redefining how developers are made.
                  </p>
                </div>
              </div>
            </div>
          </section>
    
          <StatsComponenet />
          <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
            <LearningGrid />
            <ContactFormSection />
          </section>
    
          <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            <h1 className="text-center text-4xl font-semibold mt-8">
              Reviews from other learners
            </h1>
            <ReviewSlider />
          </div>
          <Footer />
        </div>
      );
    };
    
    export default About;
    
