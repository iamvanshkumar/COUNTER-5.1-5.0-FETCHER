import React, { useState, useEffect } from "react";
import BgLogin from "../assets/bg_login.png";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState(localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem("rememberedEmail"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.remove("h-full", "grid", "grid-cols-5");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });

      console.log("Login successful:", res.data);
      alert("Login successful!");

      // Save token or user info in localStorage/sessionStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Save email if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Redirect to dashboard (if routing is setup)
      // navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-4 h-screen" style={{ userSelect: "none" }}>
      <section className="col-span-3 flex items-center justify-center bg-gray-50 h-screen p-2">
        <img
          src={BgLogin}
          draggable="false"
          className="h-[90%] animate-spin"
          alt="Login Background"
          style={{ animationDuration: "30s" }}
        />
      </section>

      <div className="bg-white border-l border-gray-100 shadow-md flex flex-col items-center justify-center space-y-8">
        <div className="flex flex-col gap-2 items-center mb-4 py-2">
          <img
            className="h-8 w-auto"
            draggable="false"
            src="https://d12ux7ql5zx5ks.cloudfront.net/wp-content/uploads/MPS_LOGO_37df55fb0f6fe049cc780587d3693251-11.png"
            alt="Company Logo"
          />
          <h1 className="text-sm text-gray-900 font-medium">
            Reports Fetcher - <span className="text-red-400">v0.1.0</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full px-8">
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Enter username or email address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Enter password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="remember"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full bg-red-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-red-600 transition-all duration-200"
          >
            {loading ? "Logging in..." : "Login"}
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

        <p className="text-center text-gray-500 text-xs">© 2025 MPST - DDN</p>
      </div>
    </div>
  );
}
