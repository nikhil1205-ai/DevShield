import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import React,{createContext} from "react";
import "./App.css";
import Landing from "./Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashLayout from "./components/DashLayout.jsx";
import Report from "./pages/Report.jsx";
import SASTPage from "./pages/SASTPage.jsx";
import DASTPage from "./pages/SASTPage.jsx";
import ScanLayoutPage from "./components/ScanLayoutPage.jsx";
import { ScanProvider } from "./context/ScanContext";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={
              <ScanProvider>
                <DashLayout />
              </ScanProvider>
        }>
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/reports" element={<Report />} />
        </Route>

        <Route
          element={
            <ScanProvider>
              <ScanLayoutPage />
            </ScanProvider>
          }
        >
            <Route path="/scan/:scanId/sast" element={<SASTPage/>} />
            <Route path="/scan/:scanId/dast" element={<DASTPage/>} />
            {/* <Route path="/scan/:scanId/sast" element={<ScanPage/>} /> */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

