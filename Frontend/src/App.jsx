import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import "./App.css";
import Landing from "./Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashLayout from "./components/DashLayout.jsx";
import Report from "./pages/Report.jsx";
import SASTPage from "./pages/SASTPage.jsx";
import DASTPage from "./pages/DASTPage.jsx";
import ScanLayoutPage from "./components/ScanLayoutPage.jsx";
import { ScanProvider } from "./context/ScanContext";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Settings from "./pages/Settings.jsx";
import GlobalError from "./components/GlobalError.jsx";

function App() {

  return (
    <AuthProvider>
      <GlobalError />
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Landing />} />

          <Route element={ <ProtectedRoute> <ScanProvider> <DashLayout /></ScanProvider> </ProtectedRoute> }>
                <Route path="/dash" element={<Dashboard />} />
                <Route path="/reports" element={<Report />} />
                <Route path="/settings" element={< Settings/>} />
          </Route>

          <Route element={<ProtectedRoute> <ScanProvider><ScanLayoutPage /></ScanProvider> </ProtectedRoute>}>
                <Route path="/scan/:scanId/sast" element={<SASTPage/>} />
                <Route path="/scan/:scanId/dast" element={<DASTPage/>} />
                <Route path="/scan/:scanId/reports" element={<Report/>} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

