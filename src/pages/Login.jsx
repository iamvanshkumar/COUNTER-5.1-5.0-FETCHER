import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Updated import
import BgLogin from "../assets/bg_login.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [animationDuration, setAnimationDuration] = useState(1); // initial duration set to 1 second
  const durations = [1, 30, 1, 20]; // your pattern
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setTimeout(() => {
      const nextIndex = (index + 1) % durations.length;
      setAnimationDuration(durations[nextIndex]);
      setIndex(nextIndex);
    }, durations[index] * 300); // wait for current duration

    return () => clearTimeout(interval);
  }, [index]);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.remove("h-full", "grid", "grid-cols-5");
    }
  }, []);

  const navigate = useNavigate(); // Updated hook
  const [email, setEmail] = useState(
    localStorage.getItem("rememberedEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (userToken) {
      navigate("/home"); // Redirect to dashboard if already logged in
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      });

      const data = await response.json();

      if (response.ok) {
      // Store session data
      const randomToken = Math.random().toString(36).substr(2);
      sessionStorage.setItem("userToken", randomToken);
      sessionStorage.setItem("userEmail", email);
      setTimeout(() => {
        toast.success(`Login successful, welcome ${data.user.name}`);
        navigate("/home"); // Redirect to dashboard on successful login
      }, 1000); // 1-second delay
      } else {
      toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="grid grid-cols-4 h-screen" style={{ userSelect: "none" }}>
      <section className="col-span-3 flex items-center justify-center bg-gray-50 h-screen p-2">
        <img
          src={BgLogin}
          draggable="false"
          className="h-[90%] animate-spin"
          alt="Login Background"
          style={{
            animationDuration: `${animationDuration}s`,
          }}
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

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 w-full px-8"
        >
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
    </>
  );
}
