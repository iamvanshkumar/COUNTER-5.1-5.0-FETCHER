import React, { useState } from "react";

export default function SideBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const [vendorVersion, setVendorVersion] = useState("5.0");

  const handleVersionChange = (version) => {
    setVendorVersion(version);
  };

  return (
    <>
      <div
        id="drawer-example"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } bg-white w-80 shadow-xl border-l border-gray-200`}
        tabIndex="-1"
        aria-labelledby="drawer-label"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-red-500" id="drawer-label">
            <i className="bx bxs-user-account"></i>
            Add New Vendor {vendorVersion}
          </h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-800">
            Vendor Type :{" "}
          </h4>
          <div className="inline-flex rounded-md shadow-xs" role="group">
            <button
              type="button"
              onClick={() => handleVersionChange("5.1")}
              className="transition-all duration-200 px-4 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-red-500 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-100 "
            >
              5.1
            </button>

            <button
              type="button"
              onClick={() => handleVersionChange("5.0")}
              className="transition-all duration-200 px-4 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-red-500 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-100 "
            >
              5.0
            </button>
          </div>
        </div>
        <form className="mt-4 space-y-4">
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Name*
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Base URL*
            </label>
            <input
              type="url"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Customer ID*
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Requestor ID (Optional)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              API Key (Optional)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Platform (Optional)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Provider (Optional)
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Starting Year (Optional)
            </label>
            <input
              type="number"
              defaultValue="2024"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Notes (Optional)
            </label>
            <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"></textarea>
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Does it require two attempts per report?*
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="twoAttempts"
                  value="no"
                  className="form-radio"
                  required
                />
                <span className="ml-2">No</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="twoAttempts"
                  value="yes"
                  className="form-radio"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-xs text-gray-600 font-semibold">
              Does it need requests throttled?*
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="throttled"
                  value="no"
                  className="form-radio"
                  required
                />
                <span className="ml-2">No</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="throttled"
                  value="yes"
                  className="form-radio"
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
