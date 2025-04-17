import React from "react";
import SideBar from "../components/SideBar";
import SideNav from "../components/SideNav";

export default function CounterReports() {
  const toggleDrawer = () => {
    const drawer = document.getElementById("drawer-example");
    if (drawer) {
      drawer.classList.toggle("translate-x-full");
    }
  };
  

  return (
    <>
      <SideNav activeTab="counter-fetcher" />
      <main className="col-span-4 h-full overflow-y-scroll flex flex-col gap-y-2 p-2">
        {/* Report Types Section */}
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i className="bx bxs-report text-red-500"></i>
            Select your report types
          </h4>

          <div className="flex gap-4 flex-wrap">
            {[
              { label: "PR", gradient: "from-blue-500 to-purple-500" },
              { label: "DR", gradient: "from-green-500 to-teal-500" },
              { label: "TR", gradient: "from-red-500 to-pink-500" },
              { label: "IR", gradient: "from-yellow-500 to-orange-500" },
            ].map(({ label, gradient }) => (
              <label
                key={label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md cursor-pointer text-black font-semibold bg-gradient-to-r ${gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:bg-green-200`}
              >
                <input type="checkbox" className="form-checkbox h-4 w-4" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Standard Views Section */}
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i className="bx bx-filter text-red-500"></i>
            Select your standard views
          </h4>
          <div>safsa</div>
        </section>

        {/* Dates & Filters Grid */}
        <div className="grid grid-cols-2 gap-2">
          <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bx-calendar text-red-500"></i>
              Select dates
            </h4>
            <div>safsa</div>
          </section>
          <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bx-filter-alt text-red-500"></i>
              Select your report filter
            </h4>
            <div>safsa</div>
          </section>
        </div>

        {/* Vendors Section */}
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i className="bx bxs-buildings text-red-500"></i>
            Select vendors
          </h4>
          <div>
            <button
              className="bg-blue-500 p-2 text-white rounded hover:bg-blue-600 transition-all duration-300"
              type="button"
              onClick={toggleDrawer}
            >
              Add Vendor
            </button>
            <SideBar />
          </div>
        </section>
      </main>
    </>
  );
}
