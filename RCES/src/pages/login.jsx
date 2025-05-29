import { useEffect } from "react";
import loginImg from "../assets/Images/login.webp";
import Template from "../components/Core/Auth/Template";

function Login() {
  useEffect(() => {
    document.title = "Login | RCE System";
  }, []);

  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Practice to present-proof your career."
      image={loginImg}
      formType="login"
    />
  );
}

export default Login;