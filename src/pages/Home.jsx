import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";

export default function Home() {
  const navigate = useNavigate();
  const [tableCount, setTableCount] = useState(0);
  const [tableNames, setTableNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleViewTable = async (tableName) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/table/${tableName}`
      );
      const data = await response.json();
      setSelectedTable(tableName);
      setTableData(data.rows || []);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/tables/names");
        const data = await response.json();
        setTableNames(data.tableNames);
      } catch (error) {
        console.error("Error fetching table names:", error);
      }
    };

    fetchTableNames();
  }, []);

  useEffect(() => {
    const fetchTableCount = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/tables/count");
        const data = await response.json();
        setTableCount(data.count);
      } catch (error) {
        console.error("Error fetching table count:", error);
      }
    };

    fetchTableCount();
  }, []);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.add("h-full", "grid", "grid-cols-5");
    }
  }, []);

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      // Redirect user to the login page if not authenticated
      navigate("/login");
    }
  }, [history]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = now.toLocaleDateString(undefined, options);
    const time = now.toLocaleTimeString();
    return `${date}, ${time}`;
  };

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const downloadCSV = () => {
    if (!tableData.length) return;

    const headers = Object.keys(tableData[0]).join(",");
    const rows = tableData.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${selectedTable}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SideNav activeTab="home" />
      <main className="col-span-4 flex flex-col gap-2 h-full overflow-y-scroll p-2">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-700">
                  Table: <span className="text-red-500">{selectedTable}</span>
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                    onClick={() => downloadCSV()}
                  >
                    ⬇️ Download CSV
                  </button>
                  <button
                    className="text-gray-500 hover:text-red-500 text-xl"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="overflow-auto px-6 py-4 grow">
                {tableData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-600 border">
                      <thead className="bg-gray-100 text-xs uppercase sticky top-0 z-10">
                        <tr>
                          {Object.keys(tableData[0]).map((key) => (
                            <th key={key} className="px-4 py-2 border">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            {Object.values(row).map((val, j) => (
                              <td
                                key={j}
                                className="px-4 py-2 border whitespace-nowrap"
                              >
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-4">
                    No data found in this table.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <nav className="flex justify-between items-center text-sm border-b border-red-500 p-2">
          <h1 className="text-gray-600 flex gap-1">
            👋Welcome Back,
            <span className="text-red-500 font-semibold">
              {sessionStorage.getItem("userEmail") || "Guest"}
            </span>
          </h1>
          <div className="flex items-center gap-1">
            <i className="bx bx-time text-red-500"></i>
            <p className="font-medium text-gray-600">{currentDateTime}</p>
          </div>
        </nav>
        <section className="grid grid-cols-4 gap-2">
          <div className="bg-blue-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-blue-300">
            <h2 className="font-semibold">Total Number of Tables</h2>
            <span className="font-bold text-2xl">{tableCount}</span>
            <span className="font-semibold text-sm">Insights Fetcher</span>
          </div>
          <div className="bg-red-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-red-300">
            <h2 className="font-semibold">Total Number of Reports</h2>
            <span className="font-bold text-2xl">00</span>
            <span className="font-semibold text-sm">Counter Fetcher</span>
          </div>
          <div className="bg-green-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-green-300">
            <h2 className="font-semibold">Total Number of Vendors</h2>
            <span className="font-bold text-2xl">00</span>
            <span className="font-semibold text-sm">Counter Fetcher</span>
          </div>
          <div className="bg-purple-400 text-white p-3 flex flex-col items-center justify-center gap-0.5 rounded-md shadow-md border border-purple-300">
            <h2 className="font-semibold">Total Number of Vendors</h2>
            <span className="font-bold text-2xl">00</span>
            <span className="font-semibold text-sm">Counter Fetcher</span>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-2">
          <div className="h-[27.5rem] overflow-hidden bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bx-table text-red-500"></i>
              Last 5 Report Downloads -{" "}
              <span className="text-red-500">Insights Fetcher</span>
            </h4>

            <input
              type="text"
              placeholder="Search table name..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex flex-col gap-2 h-full overflow-hidden">
              <div className="overflow-y-auto h-[22rem]">
                <table className="w-full text-sm text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-red-100 sticky top-0 z-10">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left bg-red-100"
                      >
                        Table Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-right bg-red-100"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableNames
                      .filter((tableName) =>
                        tableName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((tableName, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b border-gray-200"
                        >
                          <th
                            scope="row"
                            className="text-sm font-normal px-6 py-2 text-gray-500 whitespace-nowrap text-left"
                          >
                            {tableName}
                          </th>
                          <td className="px-6 py-2 text-right">
                            <button onClick={() => handleViewTable(tableName)}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
            <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
              <i className="bx bx-table text-red-500"></i>
              Last 5 Report Downloads -{" "}
              <span className="text-red-500">Counter Fetcher</span>
            </h4>
            {/* <input
              type="text"
              placeholder="Search table name..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-red-500 focus:ring-1 focus:border-red-500 block w-full p-1.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex flex-col gap-4">
              <table className="w-full text-sm text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-red-100">
                  <tr>
                    <th scope="col" className="px-6 py-2 text-left">
                      Table Name
                    </th>
                    <th scope="col" className="px-6 py-2 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableNames
                    .filter((tableName) =>
                      tableName.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((tableName, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b border-gray-200"
                      >
                        <th
                          scope="row"
                          className="text-sm font-normal px-6 py-2 text-gray-500 whitespace-nowrap text-left"
                        >
                          {tableName}
                        </th>
                        <td className="px-6 py-2 text-right">
                          <button onClick={() => handleViewTable(tableName)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div> */}
          </div>
        </section>
      </main>
    </>
  );
}
