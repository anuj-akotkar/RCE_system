import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Core/Dashboard/Sidebar";

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.userProfile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Dashboard | RCE System";
  }, []);

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center" role="status" aria-live="polite">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <nav aria-label="Sidebar Navigation">
        <Sidebar />
      </nav>
      <main
        className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto"
        tabIndex={-1}
        aria-label="Dashboard Main Content"
      >
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;