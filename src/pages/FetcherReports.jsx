import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import SideNav from "../components/SideNav";

export default function FetcherReports() {
  const [selectedPlatform, setSelectedPlatform] = useState("ASM");
  const [file, setFile] = useState(null);
  const [libraryDetails, setLibraryDetails] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allReportsSelected, setAllReportsSelected] = useState(false);
  const [allLibrariesSelected, setAllLibrariesSelected] = useState(false);

  function generateCSVfromTR(data, libraryCode) {
    const rowsMap = {};

    const reportHeader = data.Report_Header || {};
    const defaultPublisherId = "no data";
    const defaultUri = "no data";
    const defaultCounterCompliant = "";
    const defaultOnlineISSN = "no data";
    const monthCountsTemplate = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    data.Report_Items?.forEach((item) => {
      const ids = {};
      item.Item_ID?.forEach((id) => {
        ids[id.Type] = id.Value;
      });

      item.Performance?.forEach((perf) => {
        const year = perf.Period.Begin_Date.slice(0, 4);
        const month = perf.Period.Begin_Date.slice(5, 7);
        const monthStr = new Date(`${year}-${month}-01`).toLocaleString(
          "en-US",
          {
            month: "short",
          }
        );

        perf.Instance?.forEach((inst) => {
          const count = inst.Count;
          const metric = inst.Metric_Type;

          const monthCounts = { ...monthCountsTemplate };
          if (monthStr in monthCounts) {
            monthCounts[monthStr] = count;
          }

          const key = `${ids.ISBN || "noisbn"}|${metric}`;

          if (!rowsMap[key]) {
            rowsMap[key] = {
              Institution_Code: libraryCode || reportHeader.Customer_ID || "",
              pub_code: ids.Proprietary?.split(":")[0] || "",
              Title: item.Title || "",
              Publisher: item.Publisher || "",
              Publisher_Id: defaultPublisherId,
              Platform: item.Platform || "",
              Collection_Platform: item.Platform || "",
              Report_Type: reportHeader.Report_ID || "TR",
              DOI: ids.DOI || "",
              Proprietary_Identifier: ids.Proprietary || "",
              ISBN: ids.ISBN || "",
              Print_ISSN: ids.Print_ISSN || "",
              Online_ISSN: ids.Online_ISSN || defaultOnlineISSN,
              URI: defaultUri,
              Metric_Type: metric,
              Counter_Complaint: defaultCounterCompliant,
              Year: year,
              Month: "", // Can be left blank if aggregating across months
              YTD: 0,
              ...monthCountsTemplate,
              YOP: item.YOP || "",
              Data_Type: item.Data_Type || "",
              Access_Type: item.Access_Type || "",
              Access_Method: item.Access_Method || "",
              Section_Type: item.Section_Type || "",
            };
          }

          rowsMap[key].YTD += count;
          rowsMap[key][monthStr] += count;
        });
      });
    });

    const rows = Object.values(rowsMap);

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${libraryCode}_TR_Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const reportOptions = [
    "TR",
    "TR_J1",
    "TR_J2",
    "TR_J3",
    "TR_J4",
    "TR_B1",
    "TR_B2",
    "TR_B3",
    "DR",
    "DR_D1",
    "DR_D2",
    "PR",
    "PR_P1",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target.result;
        const rows = csvData.split("\n").filter((row) => row.trim() !== "");
        const headers = rows[0].split(",").map((header) => header.trim());
        const parsedDetails = rows.slice(1).map((row) => {
          const values = row.split(",");
          const details = {};
          headers.forEach((header, index) => {
            details[header] = values[index] ? values[index].trim() : "";
          });
          return {
            libraryCode: details["LIB_code"],
            apiKey: details["api_key"],
            requestorId: details["Requestor_ID"],
            customerId: details["Customer_ID"],
          };
        });
        setLibraryDetails(parsedDetails);
      };
      reader.readAsText(file);
    }
  };

  const toggleAllReports = () => {
    if (allReportsSelected) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reportOptions);
    }
    setAllReportsSelected(!allReportsSelected);
  };

  const toggleReport = (report) => {
    setSelectedReports((prev) =>
      prev.includes(report)
        ? prev.filter((r) => r !== report)
        : [...prev, report]
    );
  };

  const toggleLibrary = (customerId) => {
    setSelectedLibraries((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  useEffect(() => {
    setAllLibrariesSelected(selectedLibraries.length === libraryDetails.length);
  }, [selectedLibraries, libraryDetails]);

  const saveFileWithPicker = async (blob, suggestedName) => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      alert(`File "${suggestedName}" has been saved successfully.`);
    } catch (error) {
      alert(`Failed to save file: ${error.message}`);
    }
  };

  const saveLogsWithPicker = async (logs, suggestedName) => {
    try {
      const logContent = logs.join("\n") || "No logs generated.";
      const blob = new Blob([logContent], { type: "text/plain" });
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: "Text Log Files",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      alert(`Log file "${suggestedName}" has been saved successfully.`);
    } catch (error) {
      alert(`Failed to save log file: ${error.message}`);
    }
  };

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      alert("Please select a valid date range.");
      return;
    }
    if (selectedReports.length === 0) {
      alert("Please select at least one report type.");
      return;
    }
    if (selectedLibraries.length === 0) {
      alert("Please select at least one library.");
      return;
    }

    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
    const chosenLibraries = libraryDetails.filter((lib) =>
      selectedLibraries.includes(lib.customerId)
    );
    const logs = [];

    for (const reportType of selectedReports) {
      const combinedData = [];
      for (const library of chosenLibraries) {
        const asm = "sitemaster.dl.asminternational.org";
        const rsc = "sitemaster.books.rsc.org";

        const selectedSite = selectedPlatform === "ASM" ? asm : rsc;

        const formatDate = (date) => {
          const d = new Date(date);
          return selectedPlatform === "RSC"
            ? d.toISOString().slice(0, 7)
            : d.toISOString().split("T")[0];
        };

        const start = formatDate(startDate);
        const end = formatDate(endDate);

        const url = `https://${selectedSite}/sushi/reports/${reportType}/?api_key=${library.apiKey}&customer_id=${library.customerId}&requestor_id=${library.requestorId}&begin_date=${start}&end_date=${end}&attributes_to_show=Access_Type|YOP|Access_Method|Data_Type|Section_Type`;

        console.log("Fetching URL:", url);
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();
          combinedData.push({ libraryCode: library.libraryCode, data });
          generateCSVfromTR(data, library.libraryCode);
          logs.push(`Success: ${library.customerId} / ${library.requestorId}`);
        } catch (error) {
          logs.push(
            `Error: ${library.customerId} / ${library.requestorId} - ${error.message}`
          );
        }
      }
      if (combinedData.length > 0) {
        const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
          type: "application/json",
        });
        const fileName = `report_${reportType}_${formattedStartDate}_to_${formattedEndDate}.json`;
        await saveFileWithPicker(blob, fileName);
      } else {
        logs.push(`No data for ${reportType}`);
      }
    }

    if (logs.length > 0) {
      const logFileName = `logs_${formattedStartDate}_to_${formattedEndDate}.txt`;
      await saveLogsWithPicker(logs, logFileName);
    }
  };

  return (
    <>
      <SideNav activeTab="insight-fetcher" />
      <main className="col-span-4 h-full overflow-y-scroll p-2">
        <section className="w-full flex flex-col gap-2 h-full">
          <section className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
              <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <i className="bx bx-cog text-red-500"></i>
                Input Settings
              </h4>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2 text-xs text-gray-600 font-semibold">
                    Select date range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-xs text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    <span className="text-sm text-gray-500 font-medium">
                      to
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-xs text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                      Upload CSV file
                    </label>
                    <a className="text-xs text-blue-500 font-medium hover:underline transition-all duration-300" href="../assets/csv_template.csv" download="csv_template.csv">Download CSV template
                    </a>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                  />
                </div>

                <button
                  onClick={handleDownload}
                  className="bg-red-500 p-2 rounded-md text-white font-semibold text-sm hover:bg-red-600 transition-all duration-200 cursor-pointer"
                >
                  Download Reports
                </button>
              </div>
            </div>
            <section className="flex flex-col gap-2">
              {/* platform  */}
              <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
                <div className="flex flex-col gap-2 justify-between">
                  <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                    <i className="bx bxs-user-rectangle  text-red-500"></i>
                    Platform
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex w-full items-center ps-4 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer dark:border-gray-700">
                      <input
                        id="bordered-radio-1"
                        type="radio"
                        value="ASM"
                        name="platform"
                        checked={selectedPlatform === "ASM"}
                        onChange={() => setSelectedPlatform("ASM")}
                        className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor="bordered-radio-1"
                        className="w-full py-2 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        ASM
                      </label>
                    </div>
                    <div className="flex w-full items-center ps-4 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">
                      <input
                        id="bordered-radio-2"
                        type="radio"
                        value="RSC"
                        name="platform"
                        checked={selectedPlatform === "RSC"}
                        onChange={() => setSelectedPlatform("RSC")}
                        className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 focus:ring-blue-500  cursor-pointer"
                      />
                      <label
                        htmlFor="bordered-radio-2"
                        className="w-full py-2 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        RSC
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Report Types */}
              <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                    <i className="bx bxs-report text-red-500"></i>
                    Report Type
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

                <div className="grid grid-cols-6 gap-2">
                  {reportOptions.map((report) => (
                    <div
                      key={report}
                      onClick={() => toggleReport(report)}
                      className={` p-2 rounded-md flex items-center gap-1 hover:bg-green-200 transition-all duration-200 cursor-pointer ${
                        selectedReports.includes(report)
                          ? "bg-green-200"
                          : "bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report)}
                        readOnly
                      />
                      <label className="text-sm font-semibold">{report}</label>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>

          {/* Libraries */}
          <section className="h-screen bg-white p-3 flex flex-col col-span-2 gap-4 rounded-md shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <i className="bx bx-library text-red-500"></i>
                Libraries
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allLibrariesSelected}
                  id="selectAllCheckboxLibrary"
                  className="bg-gray-100 cursor-pointer"
                  onChange={() => {
                    if (allLibrariesSelected) {
                      setSelectedLibraries([]);
                    } else {
                      setSelectedLibraries(
                        libraryDetails.map((lib) => lib.customerId)
                      );
                    }
                  }}
                />
                <label
                  htmlFor="selectAllCheckboxLibrary"
                  className="text-xs font-medium cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>

            {!file ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/8242/8242984.png"
                  className="w-36"
                  draggable="false"
                  alt="icon"
                />
                <h4 className="text-gray-400 text-4xl font-bold">
                  No File Uploaded
                </h4>
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-2 overflow-y-scroll">
                {libraryDetails.map((lib) => (
                  <div
                    key={lib.customerId}
                    onClick={() => toggleLibrary(lib.customerId)}
                    className={` p-2 rounded-md flex items-center gap-1 hover:bg-green-200 transition-all duration-200 cursor-pointer ${
                      selectedLibraries.includes(lib.customerId)
                        ? "bg-green-200"
                        : "bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLibraries.includes(lib.customerId)}
                      onChange={() => toggleLibrary(lib.customerId)}
                    />
                    <label className="text-sm font-semibold">
                      {lib.libraryCode || lib.customerId}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}
