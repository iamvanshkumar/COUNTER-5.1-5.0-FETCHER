import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SideBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [vendorVersion, setVendorVersion] = useState("5.1");
  const [formData, setFormData] = useState({
    name: "",
    baseUrl: "",
    customerId: "",
    requestorId: "",
    apiKey: "",
    platform: "",
    provider: "",
    nonSushiVendor: false,
    startingYear: 2020,
    notes: "",
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleVersionChange = (version) => {
    setVendorVersion(version);
  };

  const closeDrawer = () => {
    const drawer = document.getElementById("drawer-example");
    if (drawer && !drawer.classList.contains("translate-x-full")) {
      drawer.classList.add("translate-x-full");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate a unique ID for the vendor
      const uniqueId = `v_${Date.now()}`;

      // Create the data object to save
      const vendorData = {
        id: uniqueId, // Add the unique ID
        vendorVersion,
        ...formData,
      };

      const response = await fetch("http://localhost:3001/api/save-vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendor: vendorData }), // Changed to send as 'vendor'
      });

      if (!response.ok) {
        throw new Error("Failed to save vendor data");
      }

      const result = await response.json();
      console.log("Vendor saved successfully:", result);

      toast.success("Vendor data saved successfully!");

      // Reload the page to reflect changes
      window.location.reload();
      

      // Reset form after saving
      setFormData({
        name: "",
        baseUrl: "",
        customerId: "",
        requestorId: "",
        apiKey: "",
        platform: "",
        provider: "",
        nonSushiVendor: false,
        startingYear: 2020,
        notes: "",
      });

      // Close the drawer
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error saving vendor data:", error);
      toast.error("Failed to save vendor data");
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        id="drawer-example"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
          } bg-white w-80 shadow-xl border-l border-gray-200`}
        tabIndex="-1"
        aria-labelledby="drawer-label"
        onClick={(e) => {
          if (e.target.id === "drawer-example") {
            setIsDrawerOpen(false);
          }
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className="flex items-center gap-1 text-md font-semibold text-red-500"
            id="drawer-label"
          >
            <i className="bx bxs-user-account"></i>
            Add New Vendor {vendorVersion}
          </h2>
          <button
            className="bg-gray-100 px-1 rounded-md hover:bg-gray-200 transition-all duration-100"
            onClick={closeDrawer}
          >
            <i className="bx bx-x text-lg"></i>
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-800">
            Vendor Type :{" "}
          </h4>

          <select
            value={vendorVersion}
            onChange={(e) => handleVersionChange(e.target.value)}
            className="border bg-gray-100 hover:bg-gray-200 transition-all duration-100 rounded-md pr-6 pl-2 text-sm cursor-pointer"
          >
            <option value="5.1">5.1</option>
            <option value="5.0">5.0</option>
          </select>
        </div>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Base URL*
            </label>
            <input
              type="url"
              name="baseUrl"
              value={formData.baseUrl}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Customer ID*
            </label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Requestor ID (Optional)
            </label>
            <input
              type="text"
              name="requestorId"
              value={formData.requestorId}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              API Key (Optional)
            </label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Platform (Optional)
            </label>
            <input
              type="text"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Provider (Optional)
            </label>
            <input
              type="text"
              name="provider"
              value={formData.provider}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              htmlFor="default-checkbox"
              className="mr-2 block text-xs text-gray-600 font-semibold cursor-pointer"
            >
              Non-SUSHI Vendor
            </label>
            <input
              id="default-checkbox"
              name="nonSushiVendor"
              type="checkbox"
              checked={formData.nonSushiVendor}
              onChange={handleInputChange}
              className="w-4 h-4 text-red-500 border bg-gray-100 border-gray-300 rounded-sm focus:ring-red-500 cursor-pointer"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Starting Year (Optional)
            </label>
            <input
              type="number"
              name="startingYear"
              value={formData.startingYear}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-green-600 transition-all duration-200 cursor-pointer w-full"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
