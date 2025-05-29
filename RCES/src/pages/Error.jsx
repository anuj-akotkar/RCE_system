import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 Not Found | RCE System";
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center items-center text-white min-h-[70vh]">
      {/* Illustration */}
      <img
        src="https://illustrations.popsy.co/gray/error-404.svg"
        alt="404 Not Found"
        className="w-64 mb-6"
      />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="mb-6 text-lg text-gray-300">
        Sorry, the page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
      >
        Go to Home
      </button>
    </div>
  );
}

export default Error;