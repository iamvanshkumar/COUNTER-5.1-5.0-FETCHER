import React from "react";
import SideBar from "../components/SideBar";
import SideNav from "../components/SideNav";

export default function CounterReports() {
  const toggleDrawer = () => {
    const drawer = document.getElementById("drawer-example");
    if (drawer) {
      const isHidden = drawer.classList.contains("translate-x-full");
      if (isHidden) {
        drawer.classList.remove("translate-x-full");
      } else {
        drawer.classList.add("translate-x-full");
      }
    }
  };
  return (
    <>
      <SideNav activeTab="counter-fetcher" />
      <main className="col-span-4 h-full overflow-y-scroll flex flex-col gap-y-2 p-2">
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i class="bx bxs-report text-red-500"></i>
            Select your report types
          </h4>

          <div>safsa</div>
        </section>
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i class="bx bx-filter text-red-500"></i>
            Select your standard views
          </h4>

          <div>safsa</div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i class="bx bx-calendar text-red-500"></i>
              Select dates
            </h4>

            <div>safsa</div>
          </section>
          <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i class="bx bx-filter-alt text-red-500"></i>
              Select your report filter
            </h4>

            <div>safsa</div>
          </section>
        </div>
        <section className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
          <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
            <i class="bx bxs-buildings text-red-500"></i>
            Select vendors
          </h4>

          <div>
            {" "}
            <button
              className="bg-blue-500 p-2 text-white rounded"
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
