import React from "react"; 
import { Link } from "react-router-dom";

const CTAButton = ({ active = false, linkto = "/", children }) => {
  return active ? (
    <Link to={linkto}>
      <button className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-100 transition">
        {children}
      </button>
    </Link>
  ) : (
    <Link to={linkto}>
      <button className="bg-richblack-800 text-richblack-5 px-6 py-3 rounded-md font-semibold border border-richblack-700 hover:bg-richblack-700 transition">
        {children}
      </button>
    </Link>
  );
};

export default CTAButton;