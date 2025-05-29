import { useEffect } from "react";
import signupImg from "../assets/Images/signup.webp";
import Template from "../components/Core/Auth/Template";

function Signup() {
  useEffect(() => {
    document.title = "Sign Up | RCE System";
  }, []);

  return (
    <Template
      title="Join the millions learning to code with PracticePerfect for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Practice to present-proof your career."
      image={signupImg}
      formType="signup"
    />
  );
}

export default Signup;