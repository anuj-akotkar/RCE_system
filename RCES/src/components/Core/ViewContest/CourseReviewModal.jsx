import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";

import { createContestRating } from "../../../services/operations/contestDetailsAPI";
import IconBtn from "../../Common/IconBtn";

export default function ContestReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.userProfile);
  const { token } = useSelector((state) => state.auth);
  const { contestEntireData } = useSelector((state) => state.viewContest);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("contestExperience", "");
    setValue("contestRating", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ratingChanged = (newRating) => {
    setValue("contestRating", newRating);
  };

  const onSubmit = async (data) => {
    await createContestRating(
      {
        contestId: contestEntireData._id,
        rating: data.contestRating,
        review: data.contestExperience,
      },
      token
    );
    setReviewModal(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.image}
              alt={user?.firstName + " profile"}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">Posting Publicly</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            />
            <div className="flex w-11/12 flex-col space-y-2">
              <label
                className="text-sm text-richblack-5"
                htmlFor="contestExperience"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="contestExperience"
                placeholder="Add Your Experience"
                {...register("contestExperience", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
              />
              {errors.contestExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Please Add Your Experience
                </span>
              )}
            </div>
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
              >
                Cancel
              </button>
              <IconBtn text="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}