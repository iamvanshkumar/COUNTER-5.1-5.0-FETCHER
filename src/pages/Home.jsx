import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";

export default function Home() {
  const history = useNavigate();
  const [tableCount, setTableCount] = useState(0);

  useEffect(() => {
    const fetchTableCount = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/tables/count");
        const data = await response.json();
        setTableCount(data.count);
      } catch (error) {
        console.error("Error fetching table count:", error);
      }
    };

    fetchTableCount();
  }, []);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.add("h-full", "grid", "grid-cols-5");
    }
  }, []);

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      // Redirect user to the login page if not authenticated
      history("/login");
    }
  }, [history]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = now.toLocaleDateString(undefined, options);
    const time = now.toLocaleTimeString();
    return `${date}, ${time}`;
  };

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <>
      <SideNav activeTab="home" />
      <main className="col-span-4 flex flex-col gap-2 h-full overflow-y-scroll p-2">
        <nav className="flex justify-between items-center text-sm border-b border-red-500 p-2">
          <h1 className="text-gray-600 flex gap-1">
            👋Welcome Back,
            <span className="text-red-500 font-semibold">Vansh Kumar</span>
          </h1>
          <div className="flex items-center gap-1">
            <i className="bx bx-time text-red-500"></i>
            <p className="font-medium text-gray-600">{currentDateTime}</p>
          </div>
        </nav>
        <section className="grid grid-cols-4 gap-2">
          <div className="bg-blue-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-blue-300">
            <h2 className="font-semibold">Total Number of Tables</h2>
            <span className="font-bold text-2xl">{tableCount}</span>
            <span className="font-semibold text-sm">Insights Fetcher</span>
          </div>
          <div className="bg-red-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-red-300">
            <h2 className="font-semibold">Total Number of Reports</h2>
            <span className="font-bold text-2xl">00</span>
            <span className="font-semibold text-sm">Counter Fetcher</span>
          </div>
          <div className="bg-green-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-green-300">
            <h2 className="font-semibold">Total Number of Vendors</h2>
            <span className="font-bold text-2xl">00</span>
            <span className="font-semibold text-sm">Counter Fetcher</span>
          </div>
          <div className="bg-purple-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-purple-300">
            <h2 className="font-semibold">Total Number of Vendors</h2>
            <span className="font-bold text-2xl">00</span>
            <span className="font-semibold text-sm">Counter Fetcher</span>
          </div>
        </section>
      </main>
    </>
  );
}
