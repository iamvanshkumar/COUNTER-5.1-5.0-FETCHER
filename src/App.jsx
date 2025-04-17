import {Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import FetcherReports from "./pages/FetcherReports";
import CounterReports from "./pages/CounterReports";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="insight-fetcher" element={<FetcherReports/>} />
        <Route path="counter-fetcher" element={<CounterReports/>} />
      </Routes>
  );
}

export default App;
