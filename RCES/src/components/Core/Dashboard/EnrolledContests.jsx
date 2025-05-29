import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {fetchUserContests} from "../../../services/operations/profileAPI"
//import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledContests() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledContests, setEnrolledContests] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchUserContests(token) // Getting all the published and the drafted courses

        // Filtering the published course out
        const filterPublishContest = res.filter((ele) => ele.status !== "Draft")
        // console.log(
        //   "Viewing all the couse that is Published",
        //   filterPublishCourse
        // )

        setEnrolledContests(filterPublishContest)
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Contests</div>
      {!enrolledContests ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledContests.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any contest yet.
          {/* TODO: Modify this Empty State */}
          <button
            onClick={()=>{
              navigate('/Catalog')
            }}
          >
           Take part in a contest
          </button>
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Contest Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledContests.map((contest, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${contest?._id}/section/${contest.contestContent?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={contest.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{contest.contestName}</p>
                  <p className="text-xs text-richblack-300">
                    {contest.contestDescription.length > 50
                      ? `${contest.contestDescription.slice(0, 50)}...`
                      : contest.contestDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{contest?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {contest.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={contest.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
