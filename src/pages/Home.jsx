import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";

export default function Home() {
  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.add("h-full", "grid", "grid-cols-5");
    }
  }, []);

  
  const history = useNavigate();

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      // Redirect user to the login page if not authenticated
      history("/login");
    }
  }, [history]);

  return (
    <>
      <SideNav activeTab="home" />
      <main className="">

      </main>
    </>
  );
}
