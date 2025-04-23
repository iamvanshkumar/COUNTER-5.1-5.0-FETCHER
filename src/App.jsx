import {Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import FetcherReports from "./pages/FetcherReports";
import CounterReports from "./pages/CounterReports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="insight-fetcher" element={<FetcherReports/>} />
        <Route path="counter-fetcher" element={<CounterReports/>} />
        <Route path="settings" element={<Settings/>} />
      </Routes>
  );
}

export default App;
