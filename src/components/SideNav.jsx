import { React } from "react";
import { Link } from "react-router-dom";

export default function SideNav({ activeTab }) {
  return (
    <aside className="pl-2 pt-2">
      <div className="bg-white border border-gray-100 rounded-md p-4 h-screen w-full shadow-md col-span-1">
        <div className="flex flex-col gap-2 shrink-0 items-center justify-center mb-4 py-2">
          <img
            className="h-8 w-auto"
            draggable="false"
            src="https://d12ux7ql5zx5ks.cloudfront.net/wp-content/uploads/MPS_LOGO_37df55fb0f6fe049cc780587d3693251-11.png"
            alt="Your Company"
          />
          <h1 className="text-sm text-gray-900 font-medium">
            Reports Fetcher -{" "}
            <span className="text-red-400 text-sm text-normal ">v0.1.0</span>
          </h1>
        </div>
        <hr />
        <div className="flex flex-col gap-2 py-2">
          <Link
            to="/"
            className={`flex items-center gap-2 p-2 rounded-md ${
              activeTab === "home"
                ? "bg-red-500 text-white"
                : "hover:bg-gray-200"
            } transition-all duration-200`}
          >
            <i className="bx bxs-home text-red-500"></i>
            <span className="text-sm font-medium">Home</span>
          </Link>
          <Link
            to="/insight-fetcher"
            className={`flex items-center gap-2 p-2 rounded-md ${
              activeTab === "insight-fetcher"
                ? "bg-red-500 text-white"
                : "hover:bg-gray-200"
            } transition-all duration-200`}
          >
            <i className="bx bxs-user-account"></i>
            <span className="text-sm font-medium">Insight Fetcher</span>
          </Link>
          <Link
            to="/counter-fetcher"
            className={`flex items-center gap-2 p-2 rounded-md ${
              activeTab === "counter-fetcher"
                ? "bg-red-500 text-white"
                : "hover:bg-gray-200"
            } transition-all duration-200`}
          >
            <i className="bx bxs-dice-5"></i>
            <span className="text-sm font-medium">Counter Fetcher</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
