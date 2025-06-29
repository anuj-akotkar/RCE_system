import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorContests } from "../../../services/operations/contestAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.userProfile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [contests, setContests] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorContests(token)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setContests(result)
      }
      setLoading(false)
    })()
  }, [])

  const totalParticipants = instructorData?.reduce(
    (acc, curr) => acc + curr.totalParticipants,
    0
  )

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : contests.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {/* Render chart / graph */}
            {totalParticipants > 0 ? (
              <InstructorChart contests={instructorData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Contests</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {contests.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Participants</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalParticipants}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render 3 contests */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Contests</p>
              <Link to="/dashboard/my-contests">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex items-start space-x-6">
              {contests.slice(0, 3).map((contest) => (
                <div key={contest._id} className="w-1/3">
                  <img
                    src={contest.thumbnail}
                    alt={contest.contestName}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {contest.contestName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {contest.participants?.length || 0} participants
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any contests yet
          </p>
          <Link to="/dashboard/add-contest">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a contest
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}