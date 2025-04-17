import React, { useState } from "react";
import SideNav from "../components/SideNav";
import SideBar from "../components/SideBar";

export default function AddVendor() {
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
            <SideNav />
            <main className="">
            <div className="">
                <button
                    className="bg-blue-500 p-2 text-white rounded"
                    type="button"
                    onClick={toggleDrawer}
                >
                    Add Vendor
                </button>
            </div>

                {/* Pass visibility prop to SideBar */}
                <SideBar />
            </main>
        </>
    );
}
