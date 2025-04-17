import {Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import FetcherReports from "./pages/FetcherReports";
import AddVendor from "./pages/AddVendor";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="fetcher-reports" element={<FetcherReports/>} />
        <Route path="add-vendor" element={<AddVendor/>} />
      </Routes>
  );
}

export default App;
