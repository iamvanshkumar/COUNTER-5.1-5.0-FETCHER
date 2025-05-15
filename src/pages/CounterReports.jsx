import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";

export default function CounterReports() {
  const [allReportsSelected, setAllReportsSelected] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      // Redirect user to the login page if not authenticated
      history("/login");
    }
  }, [history]);

  const toggleDrawer = () => {
    const drawer = document.getElementById("drawer-example");
    if (drawer) {
      drawer.classList.toggle("translate-x-full");
    }
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const validateDates = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date.");
      return false;
    }
    return true;
  };

  const reportOptions = ["TR", "DR", "PR", "IR"];
  const reportStandardOptions = [
    "PR_P1",
    "DR_D1",
    "DR_D2",
    "TR_B1",
    "TR_B2",
    "TR_B3",
    "TR_J1",
    "TR_J2",
    "TR_J3",
    "TR_J4",
    "IR_A1",
    "IR_M1",
  ];

  const toggleReport = (report) => {
    setSelectedReports((prev) =>
      prev.includes(report)
        ? prev.filter((r) => r !== report)
        : [...prev, report]
    );
  };
  // Updated toggleAllReports
  const toggleAllReports = () => {
    if (allReportsSelected) {
      setSelectedReports([]);
    } else {
      setSelectedReports([
        ...new Set([...selectedReports, ...reportStandardOptions]),
      ]);
    }
    setAllReportsSelected(!allReportsSelected);
  };

  return (
    <>
      <SideNav activeTab="counter-fetcher" />
      <main className="col-span-4 h-full overflow-y-scroll flex flex-col gap-y-2 p-2">
        <section className="grid grid-cols-4 gap-2">
          {/* Dates & Filters Grid */}
          <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bx-calendar text-red-500"></i>
              Select dates
            </h4>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-600">
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 p-2 border rounded w-full bg-gray-50"
                />
              </label>
              <label className="text-xs font-medium text-gray-600">
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 p-2 border rounded w-full bg-gray-50"
                />
              </label>
              <button
                className="bg-red-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-red-600 transition-all duration-200 cursor-pointer"
              >
                Download Reports
              </button>
            </div>
          </div>
          {/* Report Types Section */}
          <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <i className="bx bxs-report text-red-500"></i>
                Select your report types
              </h4>
            </div>

            <div className="flex flex-col gap-2">
              {reportOptions.map((report) => (
                <div
                  key={report}
                  onClick={() => toggleReport(report)}
                  className={` p-2 rounded-md flex items-center gap-1 hover:bg-green-200 transition-all duration-200 cursor-pointer ${selectedReports.includes(report)
                    ? "bg-green-200"
                    : "bg-gray-100"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={selectedReports.includes(report)}
                    readOnly
                  />
                  <label className="text-sm font-semibold">{report}</label>
                </div>
              ))}
            </div>
          </div>
          {/* Standard Views Section */}
          <div className="col-span-2 bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <i className="bx bx-filter text-red-500"></i>
                Select your standard views
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allReportsSelected}
                  onChange={toggleAllReports}
                  id="selectAllCheckboxReport"
                  className="bg-gray-100 cursor-pointer"
                />
                <label
                  htmlFor="selectAllCheckboxReport"
                  className="text-xs font-medium cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {reportStandardOptions.map((report) => (
                <div
                  key={report}
                  onClick={() => toggleReport(report)}
                  className={`p-2 rounded-md flex items-center gap-1 hover:bg-green-200 transition-all duration-200 cursor-pointer ${selectedReports.includes(report)
                    ? "bg-green-200"
                    : "bg-gray-100"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={selectedReports.includes(report)}
                    readOnly
                  />
                  <label className="text-sm font-semibold">{report}</label>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vendors Section */}
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bxs-buildings text-red-500"></i>
              Select vendors
            </h4>
            <div className="flex items-center gap-2">
              <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5" />
              <button
                className="bg-blue-500 p-1.5 text-nowrap text-sm  font-medium text-white rounded hover:bg-blue-600 transition-all duration-300"
                type="button"
                onClick={toggleDrawer}
              >
                Add Vendor
              </button>
              <SideBar />
            </div>
          </div>


          <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">

        
            <div className="flex items-center gap-2 whitespace-nowrap">
              <input type="checkbox" id="vendorCheckbox" />

           
              <select className="border border-gray-300 rounded py-1 text-sm text-gray-800 pl-2 pr-8">
                <option value="5.1">5.1</option>
                <option value="5">5</option>
              </select>

           
              <label for="vendorCheckbox" className="text-gray-800 text-black">Vendor Name</label>
            </div>

          
            <div className="flex">
              <button onclick="openEditModal(1)" type="button" className="flex justify-center items-center px-2 py-1 text-sm font-medium text-green-500 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100">
                <i className="bx bxs-edit text-xl"></i>
              </button>
              <button onclick="showModal(1)" type="button" className="flex justify-center items-center px-2 py-1 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100">
                <i className="bx bxs-x-circle text-xl"></i>
              </button>
            </div>
          </div>

          </section>
      </main>
    </>
  );
}
