import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar.jsx";
import ScanSidebarPage from "./ScanSidebarPage.jsx";
import "../styles/Layout.css";

function ScanLayoutPage() {
  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-body m-4">
        <ScanSidebarPage />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ScanLayoutPage;
