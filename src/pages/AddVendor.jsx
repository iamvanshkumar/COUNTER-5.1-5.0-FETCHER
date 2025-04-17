import React from "react";
import SideNav from "../components/SideNav";
import SideBar from "../components/SideBar";

export default function AddVendor() {

    return (
        <>
            <SideNav />
            <main className="">
                <button className="bg-blue-500 p-2">Click Me To Open Sidebar</button>
                <SideBar />

            </main>
        </>
    );
}