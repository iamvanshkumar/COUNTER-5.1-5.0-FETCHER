import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Settings() {
  const [config, setConfig] = useState({
    insightsFetcher: {
      host: "",
      port: "",
      database: "",
      username: "",
      password: "",
    },
    counterFetcher: {
      host: "",
      port: "",
      database: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/config")
      .then((res) => res.json())
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch((err) => console.error("Failed to load config:", err));
  }, []);

  const history = useNavigate();

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      history("/login");
    }
  }, [history]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    PASSWORD: "",
    created_at: "", // Add this!
  });

  const emailUser = sessionStorage.getItem("userEmail");

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
        `http://localhost:3001/api/userUpdate/email/${encodeURIComponent(
          emailUser
        )}`,
        formData
      )
      .then(() => toast.success("User updated successfully"))
      .catch((err) => toast.error("Error updating user:", err));
  };

  const handleSave = async (tool) => {
    const data = {
      tool,
      config: config[tool],
    };
    const res = await fetch("http://localhost:3001/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    toast.success(result.message);
  };

  return (
    <>
      <SideNav activeTab="settings" />
      <main className="col-span-4 h-full overflow-y-scroll p-2">
      <ToastContainer />
        <div className="bg-white p-3 mb-2 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
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
                    className={`${
                      field === "created_at" || field === "email"
                        ? "bg-gray-200 border-gray-300 text-gray-600"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5`}
                    required={field !== "created_at"}
                    disabled={field === "created_at" || field === "email"}
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("insightsFetcher");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Host*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.insightsFetcher.host}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        insightsFetcher: {
                          ...prev.insightsFetcher,
                          host: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Port*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.insightsFetcher.port}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        insightsFetcher: {
                          ...prev.insightsFetcher,
                          port: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Database Name*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.insightsFetcher.database}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        insightsFetcher: {
                          ...prev.insightsFetcher,
                          database: e.target.value,
                        },
                      }))
                    }
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
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.insightsFetcher.username}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        insightsFetcher: {
                          ...prev.insightsFetcher,
                          username: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Password*
                  </label>
                  <input
                    type="password"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.insightsFetcher.password}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        insightsFetcher: {
                          ...prev.insightsFetcher,
                          password: e.target.value,
                        },
                      }))
                    }
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave("counterFetcher");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Host*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.counterFetcher.host}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        counterFetcher: {
                          ...prev.counterFetcher,
                          host: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Port*
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.counterFetcher.port}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        counterFetcher: {
                          ...prev.counterFetcher,
                          port: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Database Name*
                  </label>

                  <input
                    type="text"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.counterFetcher.database}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        counterFetcher: {
                          ...prev.counterFetcher,
                          database: e.target.value,
                        },
                      }))
                    }
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
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.counterFetcher.username}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        counterFetcher: {
                          ...prev.counterFetcher,
                          username: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Password*
                  </label>
                  <input
                    type="password"
                    className="bg-gray-50 border-gray-300 text-gray-900 border   text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
                    value={config.counterFetcher.password}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        counterFetcher: {
                          ...prev.counterFetcher,
                          password: e.target.value,
                        },
                      }))
                    }
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
