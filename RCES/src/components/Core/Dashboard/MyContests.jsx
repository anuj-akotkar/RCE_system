import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorContests } from "../../../services/operations/contestAPI"
import IconBtn from "../../Common/IconBtn"
import ContestsTable from "./InstructorContests/ContestsTable"

export default function MyContests() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [contests, setContests] = useState([])

  useEffect(() => {
  const fetchContests = async () => {
    const result = await fetchInstructorContests(token)
    console.log("Fetched contests:", result)
    if (result ) {
      setContests(result)
    }
  }
  fetchContests()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Contests</h1>
        <IconBtn
          text="Create Contest"
          onClick={() => navigate("/dashboard/add-contest")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {contests && <ContestsTable contests={contests} setContests={setContests} />}
    </div>
  )
}