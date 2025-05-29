import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { setLoading, setUser } from "./slices/userProfileSlice";
// Common Components
import Navbar from "./components/Common/Navbar";
import OpenRoute from "./components/Core/Auth/OpenRoute";
import PrivateRoute from "./components/Core/Auth/PrivateRoute";

// Contest Platform Pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/contactus";
import Error from "./pages/Error";

// Contest-related Pages (create these if not present)
import Contests from "./pages/ContestPage";
import ContestDetails from "./pages/ContestDetails";
//import Leaderboard from "./pages/Leaderboard";
import Submissions from "./pages/SubmissionPage";
import Instructor from "./components/Core/Dashboard/Instructor";
import MyContests from "./components/Core/Dashboard/MyContests";
import Addcontest from "./components/Core/Dashboard/AddContest/Addcontest";
import EditContest from "./components/Core/Dashboard/EditContest";
import TakeContest from "./components/Core/ViewContest/TakeContest";
import MyProfile from "./components/Core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import Settings from "./components/Core/Dashboard/Settings";

import { fetchUserProfile } from "./services/operations/profileAPI";
import { ACCOUNT_TYPE } from "./utils/constants";
import EnrolledContests from "./components/Core/Dashboard/EnrolledContests";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userProfile);

 useEffect(() => {
    const getProfile = async () => {
      if (localStorage.getItem("token")) {
        const token = JSON.parse(localStorage.getItem("token"));
        dispatch(setLoading(true));
        const userData = await fetchUserProfile(token, navigate); // just call, don't dispatch
        if (userData) {
          dispatch(setUser(userData));
        }
        dispatch(setLoading(false));
      }
    };
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Contest listing and details */}
        <Route path="/contests" element={<Contests />} />
        <Route path="/contests/:contestId" element={<ContestDetails />} />

        {/* Leaderboard and submissions */}
       {/* <Route path="/contests/:contestId/leaderboard" element={<Leaderboard />} /> */}
        <Route path="/contests/:contestId/submissions" element={<Submissions />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/* Private routes for logged-in users */}
        {/* // Inside your <Routes> */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* All users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />

          {/* Instructor only */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/my-contests" element={<MyContests />} />
              <Route path="dashboard/add-contest" element={<Addcontest />} />
              <Route path="dashboard/edit-contest/:contestId" element={<EditContest />} />
            </>
          )}

          {/* Student only */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/enrolled-contests" element={<EnrolledContests/>} />
            </>
          )}
        </Route>

        {/* Main contest taking route */}
        <Route path="/contests/:contestId/take" element={<TakeContest />} />

        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;