// AddContest.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Step1_ContestInformationForm from "./ContestInformationForm";
import Step2_UploadQuestions from "./UploadQuestions";
import Step3_ReviewSubmit from "./ReviewSubmit";
import { setStep } from "../../../../slices/contestSlice";

const AddContest = () => {
  const currentStep = useSelector((state) => state.contest.step);
  const dispatch = useDispatch();

  const handlePrev = () => {
    if (currentStep > 1) dispatch(setStep(currentStep - 1));
  };

  const handleNext = () => {
    if (currentStep < 3) dispatch(setStep(currentStep + 1));
  };

  return (
    <div className="max-w-4xl mx-auto test-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Contest</h1>
      <div className="bg-white shadow-md rounded-xl p-6">
        {currentStep === 1 && <Step1_ContestInformationForm />}
        {currentStep === 2 && <Step2_UploadQuestions />}
        {currentStep === 3 && <Step3_ReviewSubmit />}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded ${
              currentStep === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Back
          </button>
          {currentStep < 3 && (
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContest;
