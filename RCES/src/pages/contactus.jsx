import React, { useEffect } from "react";

import Footer from "../components/Common/Footer";
import ReviewSlider from "../components/Common/ReviewSlider";
import ContactDetails from "../components/Core/ContactUsPage/ContactDetails";
import ContactForm from "../components/Core/ContactUsPage/ContactForm";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us | RCE System";
  }, []);

  return (
    <main>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviews from Other Learners */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      <Footer />
    </main>
  );
};

export default Contact;