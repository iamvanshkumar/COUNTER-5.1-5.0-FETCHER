// import React from "react";
// import SideBar from "../components/SideBar";
// import SideNav from "../components/SideNav";

// export default function CounterReports() {
//   const toggleDrawer = () => {
//     const drawer = document.getElementById("drawer-example");
//     if (drawer) {
//       const isHidden = drawer.classList.contains("translate-x-full");
//       if (isHidden) {
//         drawer.classList.remove("translate-x-full");
//       } else {
//         drawer.classList.add("translate-x-full");
//       }
//     }
//   };
//   return (
//     <>
//       <SideNav activeTab="counter-fetcher" />
//       <main className="col-span-4 h-full overflow-y-scroll flex flex-col gap-y-2 p-2">
//         <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
//           <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
//             <i className="bx bxs-report text-red-500"></i>
//             Select your report types
//           </h4>

//           <div className="flex gap-2">
//             <button
//               className="bg-gradient-to-r from-blue-500 to-purple-500 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-green-200"
//               tabIndex="0"
//               type="button"
//               aria-label="Platform Report"
//             >
//               PR
//             </button>
//             <button
//               className="bg-gradient-to-r from-green-500 to-teal-500 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-green-200"
//               tabIndex="0"
//               type="button"
//               aria-label="Data Report"
//             >
//               DR
//             </button>
//             <button
//               className="bg-gradient-to-r from-red-500 to-pink-500 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-green-200"
//               tabIndex="0"
//               type="button"
//               aria-label="Transaction Report"
//             >
//               TR
//             </button>
//             <button
//               className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-green-200"
//               tabIndex="0"
//               type="button"
//               aria-label="Inventory Report"
//             >
//               IR
//             </button>
//           </div>
//         </section>
//         <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
//           <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
//             <i className="bx bx-filter text-red-500"></i>
//             Select your standard views
//           </h4>
//           <div>safsa</div>
//         </section>

//         <div className="grid grid-cols-2 gap-2">
//           <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
//             <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1"></h4>
//             <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
//               <i className="bx bx-calendar text-red-500"></i>
//               Select dates
//             </h4>
//             <div>safsa</div>
//           </section>
//           <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
//             <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
//               <i className="bx bx-filter-alt text-red-500"></i>
//               Select your report filter
//             </h4>

//             <div>safsa</div>
//           </section>
//         </div>
//         <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
//           <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
//             <i className="bx bxs-buildings text-red-500"></i>
//             Select vendors
//           </h4>

//           <div>
//             {" "}
//             <button
//               className="bg-blue-500 p-2 text-white rounded hover:bg-blue-600 transition-all duration-300"
//               type="button"
//               onClick={toggleDrawer}
//             >
//               Add Vendor
//             </button>
//             <SideBar />
//           </div>
//         </section>
//       </main>
//     </>
//   );t
// }

import React, { useState } from "react";
import SideBar from "../components/SideBar";
import SideNav from "../components/SideNav";

export default function CounterReports() {
  const [dropdowns, setDropdowns] = useState({
    PR: false,
    DR: false,
    TR: false,
    IR: false,
  });

  const toggleDrawer = () => {
    const drawer = document.getElementById("drawer-example");
    if (drawer) {
      const isHidden = drawer.classList.contains("translate-x-full");
      drawer.classList.toggle("translate-x-full", !isHidden);
    }
  };

  const toggleDropdown = (type) => {
    setDropdowns((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const renderDropdown = (type) => {
    if (!dropdowns[type]) return null;
    return (
      <div className="absolute top-12 left-0 z-10 w-56 bg-white shadow-lg rounded-md p-3 border border-gray-200">
        <label className="flex items-center gap-2 mb-2">
          <input type="checkbox" className="form-checkbox" />
          <span className="text-sm text-gray-700">{type} Option 1</span>
        </label>
        <label className="flex items-center gap-2 mb-2">
          <input type="checkbox" className="form-checkbox" />
          <span className="text-sm text-gray-700">{type} Option 2</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="form-checkbox" />
          <span className="text-sm text-gray-700">{type} Option 3</span>
        </label>
      </div>
    );
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

          <div className="flex gap-2 relative">
            {["PR", "DR", "TR", "IR"].map((type) => (
              <div key={type} className="relative">
                <button
                  onClick={() => toggleDropdown(type)}
                  className={`bg-gradient-to-r ${
                    type === "PR"
                      ? "from-blue-500 to-purple-500"
                      : type === "DR"
                      ? "from-green-500 to-teal-500"
                      : type === "TR"
                      ? "from-red-500 to-pink-500"
                      : "from-yellow-500 to-orange-500"
                  } text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-green-200`}
                  tabIndex="0"
                  type="button"
                  aria-label={`${type} Report`}
                >
                  {type}
                </button>
                {renderDropdown(type)}
              </div>
            ))}
          </div>
        </section>

        {/* Other Sections */}
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i className="bx bx-filter text-red-500"></i>
            Select your standard views
          </h4>
          <div>safsa</div>
        </section>

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
