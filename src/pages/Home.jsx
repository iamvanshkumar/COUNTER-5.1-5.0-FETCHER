import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";

export default function Home() {
  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.add("h-full", "grid", "grid-cols-5");
    }
  }, []);

  const history = useNavigate();

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      // Redirect user to the login page if not authenticated
      history("/login");
    }
  }, [history]);

  return (
    <>
      <SideNav activeTab="home" />
      <main className="col-span-4 flex flex-col gap-2 h-full overflow-y-scroll p-2">
        <section className="grid grid-cols-4 gap-2">
          <div className="bg-blue-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-blue-300">
            <h2 className="font-semibold">Total Number of Reports</h2>
            <span className="font-bold text-2xl">100</span>
            <span className="font-semibold text-sm">Insights Fetcher</span>
          </div>
          <div className="bg-red-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-red-300">
            <h2 className="font-semibold">Total Number of Reports</h2>
            <span className="font-bold text-2xl">100</span>
            <span className="font-semibold text-sm">Counter Fetcher</span>
          </div>
        </section>
      </main>
      
    </>
  );
}
