import React from "react";
import { BsCodeSlash } from "react-icons/bs";

function ContestSubSectionAccordion({ subSec }) {
  return (
    <div>
      <div className="flex justify-between py-2">
        <div className="flex items-center gap-2">
          <span>
            <BsCodeSlash />
          </span>
          <p>{subSec?.title}</p>
        </div>
      </div>
    </div>
  );
}

export default ContestSubSectionAccordion;