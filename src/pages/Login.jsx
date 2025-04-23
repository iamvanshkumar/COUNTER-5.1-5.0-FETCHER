import { React, useEffect } from "react";
import BgLogin from "../assets/bg_login.png";

export default function Login() {
  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.remove("h-full", "grid", "grid-cols-5");
    }
  }, []);

  return (
    <>
      <div
        className="grid grid-cols-4 h-screen"
        style={{ userSelect: "none" }} // Block text selection
      >
        <section className="col-span-3 flex items-center justify-center bg-gray-50 h-screen p-2">
          <img
            src={BgLogin}
            draggable="false"
            className="h-[90%] animate-spin"
            alt="bg-image"
            style={{ animationDuration: "30s" }} // Adjust the speed here
          />
        </section>
        <div className="bg-white border-l border-gray-100 shadow-md flex flex-col items-center justify-center space-y-8">
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
          <form className="flex flex-col gap-4 w-full px-8">
            <div>
              <label className="block mb-2 text-xs text-gray-600 font-semibold">
                Enter username or email address
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-xs text-gray-600 font-semibold">
                Enter password
              </label>
              <input
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                required
              />
            </div>
            <button className="flex items-center justify-center w-full bg-red-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-red-600 transition-all duration-200 cursor-pointer">
              Login
            </button>
            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs text-gray-500 transition-all duration-300 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <p class="text-center text-gray-500 text-xs">© 2025 MPST - DDN </p>
        </div>
      </div>
    </>
  );
}
