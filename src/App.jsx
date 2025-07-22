import {Routes, Route, Navigate } from "react-router-dom";
import FetcherReports from "./pages/FetcherReports";

function App() {
  return (
      <Routes>
        <Route path="/" element={<FetcherReports />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;
