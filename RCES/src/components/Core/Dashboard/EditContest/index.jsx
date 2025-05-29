import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  fetchFullContestDetails,
} from "../../../../services/operations/contestAPI";
import { setContest, setEditContest } from "../../../../slices/contestSlice";
import Step1_ContestInformationForm from "../AddContest/ContestInformationForm";
import Step2_UploadQuestions from "../AddContest/UploadQuestions";
import Step3_ReviewSubmit from "../AddContest/ReviewSubmit";

export default function EditContest() {
  const dispatch = useDispatch();
  const { contestId } = useParams();
  const { step, contest } = useSelector((state) => state.contest);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchFullContestDetails(contestId, token);
      if (result?.contestDetails) {
        dispatch(setEditContest(true));
        dispatch(setContest(result?.contestDetails));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Contest
      </h1>
      <div className="mx-auto max-w-[600px]">
        {contest ? (
          <>
            {step === 1 && <Step1_ContestInformationForm />}
            {step === 2 && <Step2_UploadQuestions />}
            {step === 3 && <Step3_ReviewSubmit />}
          </>
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Contest not found
          </p>
        )}
      </div>
    </div>
  );
}