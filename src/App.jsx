import {Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import FetcherReports from "./pages/FetcherReports";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="fetcher-reports" element={<FetcherReports/>} />
      </Routes>
  );
}

export default App;
