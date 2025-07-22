import {Routes, Route, Navigate } from "react-router-dom";
import FetcherReports from "./pages/FetcherReports";
import Settings from "./pages/Settings";

function App() {
  return (
      <Routes>
        <Route path="/" element={<FetcherReports />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="settings" element={<Settings/>} />
      </Routes>
  );
}

export default App;
