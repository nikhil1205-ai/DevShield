import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import DashSidebar from "./DashSidebar.jsx";
import "../styles/DashLayout.css";

function DashLayout(){
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <DashSidebar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashLayout;
