import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import "./App.css";
import Landing from "./Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dash" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
