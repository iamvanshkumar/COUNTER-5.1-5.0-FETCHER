import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const history = useNavigate();

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      history("/login");
    }
  }, [history]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    PASSWORD: '',
    created_at: '', // Add this!
  });
  

  const emailUser = "vansh.kumar@highwire.com"; // can be dynamic later

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/user/email/${encodeURIComponent(emailUser)}`
      )
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3001/api/user/email/${encodeURIComponent(emailUser)}`,
        formData
      )
      .then(() => alert("User updated successfully"))
      .catch((err) => console.error("Error updating user:", err));
  };

  return (
    <>
      <SideNav activeTab="settings" />
      <main className="col-span-4 h-full overflow-y-scroll p-2 space-y-2">
        <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i className="bx bxs-user text-red-500"></i>
            User Account
          </h4>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 gap-2">
              {["username", "email", "PASSWORD", "created_at"].map((field) => (
                <div key={field}>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    {field
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                  <input
                    type={field === "PASSWORD" ? "PASSWORD" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required={field !== "created_at"}
                    readOnly={field === "created_at"}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center justify-center w-32 bg-green-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-green-600 transition-all duration-200 cursor-pointer"
              >
                SAVE
              </button>
            </div>
          </form>
        </div>

        <section className="grid grid-cols-2 gap-2">
          <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bxl-postgresql text-red-500"></i>
              SQL Setup - <span className="text-red-500">Insights Fetcher</span>
            </h4>
            <form className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Host*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Port*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Database Name*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Username*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Password*
                  </label>
                  <input
                    type="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
              </div>
              <button className="flex items-center justify-center w-full bg-green-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-green-600 transition-all duration-200 cursor-pointer">
                SAVE
              </button>
            </form>
          </div>
          <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bxl-postgresql text-red-500"></i>
              SQL Setup - <span className="text-red-500">Counter Fetcher</span>
            </h4>
            <form className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Host*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Port*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Database Name*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Username*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Password*
                  </label>
                  <input
                    type="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    required
                  />
                </div>
              </div>
              <button className="flex items-center justify-center w-full bg-green-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-green-600 transition-all duration-200 cursor-pointer">
                SAVE
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
