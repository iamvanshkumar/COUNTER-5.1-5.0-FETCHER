import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CounterReports() {
  const history = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      history("/login");
    }
  }, [history]);
  const [selectedVersion, setSelectedVersion] = useState("5.1");
  const [file, setFile] = useState(null);
  const [libraryDetails, setLibraryDetails] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allReportsSelected, setAllReportsSelected] = useState(false);
  const [allLibrariesSelected, setAllLibrariesSelected] = useState(false);

  async function generateCSVfromTR(allReports, logs = []) {
    const allRows = [];
    const monthsWithData = new Set();
    let headerInfo = {};

    allReports.forEach(({ data, libraryCode }) => {
      const reportHeader = data.Report_Header || {};
      headerInfo = {
        Report_Name: reportHeader.Report_Name || "",
        Report_ID: reportHeader.Report_ID || "",
        Release: reportHeader.Release || "",
        Institution_Name: reportHeader.Institution_Name || "",
        Institution_ID: reportHeader.Institution_ID?.Proprietary?.join(", ") || "",
        Metric_Types: reportHeader.Metric_Types?.join(", ") || "",
        Report_Filters: reportHeader.Report_Filters
          ? `Begin_Date=${reportHeader.Report_Filters.Begin_Date || ""}; End_Date=${reportHeader.Report_Filters.End_Date || ""}`
          : "",
        Report_Attributes: reportHeader.Report_Attributes
          ? `Attributes_To_Show=${reportHeader.Report_Attributes.Attributes_To_Show?.join("|") || ""}`
          : "",
        Exceptions: reportHeader.Exceptions
          ? reportHeader.Exceptions.map((e) => `${e.Code}: ${e.Message}`).join("; ")
          : "",
        Reporting_Period: reportHeader.Report_Filters
          ? `Begin_Date=${reportHeader.Report_Filters.Begin_Date || ""}; End_Date=${reportHeader.Report_Filters.End_Date || ""}`
          : "",
        Created: reportHeader.Created || "",
        Created_By: reportHeader.Created_By || "",
        Registry_Record: reportHeader.Registry_Record || "",
      };

      data.Report_Items?.forEach((item) => {
        const ids = {
          Proprietary: item.Item_ID?.Proprietary || "",
          DOI: item.Item_ID?.DOI || "",
          ISBN: item.Item_ID?.ISBN || "",
          Print_ISSN: item.Item_ID?.Print_ISSN || "",
          Online_ISSN: item.Item_ID?.Online_ISSN || "",
        };

        item.Attribute_Performance?.forEach((attr) => {
          const dataType = attr.Data_Type || "";
          const accessType = attr.Access_Type || "";
          const accessMethod = attr.Access_Method || "";
          const yop = attr.YOP || "";
          const performance = attr.Performance;

          for (const [metric, valuesByMonth] of Object.entries(performance || {})) {
            for (const [dateStr, count] of Object.entries(valuesByMonth || {})) {
              const year = dateStr.slice(0, 4);
              const month = dateStr.slice(5, 7);
              const monthStr = new Date(`${year}-${month}-01`)
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase();
              const monthYearKey = `${monthStr}-${year}`;
              monthsWithData.add(monthYearKey);

              // Each metric occurrence is a separate row
              allRows.push({
                ...headerInfo,
                Title: item.Title || "",
                Publisher: item.Publisher || "",
                Publisher_Id: "",
                Platform: item.Platform || "",
                DOI: ids.DOI || "",
                Proprietary_ID: ids.Proprietary || "",
                ISBN: ids.ISBN || "",
                Print_ISSN: ids.Print_ISSN || "",
                Online_ISSN: ids.Online_ISSN || "",
                URI: "",
                Data_Type: dataType,
                YOP: yop,
                Access_Type: accessType,
                Access_Method: accessMethod,
                Metric_Type: metric,
                Reporting_Period_Total: count,
                [monthYearKey]: count,
              });
            }
          }
        });
      });
    });

    if (allRows.length === 0) {
      toast.error("No data available to generate the CSV file.");
      return logs;
    }

    // Get all unique month columns
    const sortedMonthYearKeys = Array.from(monthsWithData).sort((a, b) => {
      const [monthA, yearA] = a.split("-");
      const [monthB, yearB] = b.split("-");
      return new Date(`${monthA}-01-${yearA}`) - new Date(`${monthB}-01-${yearB}`);
    });

    const fixedColumns = [
      "Title", "Publisher", "Publisher_Id", "Platform", "DOI", "Proprietary_ID",
      "ISBN", "Print_ISSN", "Online_ISSN", "URI", "Data_Type", "YOP",
      "Access_Type", "Access_Method", "Metric_Type", "Reporting_Period_Total"
    ];

    const metadataLines = [
      `Report_Name,Title Report`,
      `Report_ID,${headerInfo.Report_ID}`,
      `Release,${headerInfo.Release}`,
      `Institution_Name,${headerInfo.Institution_Name}`,
      `Institution_ID,${headerInfo.Institution_ID}`,
      `Metric_Types,${headerInfo.Metric_Types}`,
      `Report_Filters,${headerInfo.Report_Filters}`,
      `Report_Attributes,${headerInfo.Report_Attributes}`,
      `Exceptions,${headerInfo.Exceptions}`,
      `Reporting_Period,${headerInfo.Reporting_Period}`,
      `Created,${headerInfo.Created}`,
      `Created_By,${headerInfo.Created_By}`,
      `Registry_Record,${headerInfo.Registry_Record}`,
    ];

    // Fill missing months with empty or 0
    const rowsForCsv = allRows.map(row => {
      const filled = { ...row };
      for (const month of sortedMonthYearKeys) {
        if (!(month in filled)) filled[month] = "";
      }
      return filled;
    });

    const csvBody = Papa.unparse(rowsForCsv, {
      columns: [...fixedColumns, ...sortedMonthYearKeys],
      skipEmptyLines: true,
    });

    const fullCsv = [...metadataLines, "", csvBody].join("\n");

    // Download logic (same as before)
    const blob = new Blob([fullCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
    const reportTypeString = headerInfo.Report_ID || "Report";

    const a = document.createElement("a");
    a.download = `${headerInfo.Institution_ID}_${reportTypeString}_Report_${formattedStartDate}_to_${formattedEndDate}.csv`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);

    return logs;
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
            sushiUrl: details["SUSHI_URL"],
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

  const saveFileWithHandle = async (handle, blob) => {
    try {
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`);
    }
  };

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a valid date range.");
      return;
    }
    if (selectedReports.length === 0) {
      toast.error("Please select at least one report type.");
      return;
    }
    if (selectedLibraries.length === 0) {
      toast.error("Please select at least one library.");
      return;
    }

    setProgress(0);
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
    const chosenLibraries = libraryDetails.filter((lib) =>
      selectedLibraries.includes(lib.customerId)
    );

    let allLogs = [];
    const totalTasks = selectedReports.length * chosenLibraries.length;
    let completedTasks = 0;
    toast.info("Preparing your report for download...");

    let fileHandle = null;
    try {
      fileHandle = await window.showDirectoryPicker();
    } catch (error) {
      toast.error("Failed to select directory.");
      return;
    }

    for (const reportType of selectedReports) {
      const logs = [];

      for (const library of chosenLibraries) {
        const r51 = "r51/";

        const Version = selectedVersion === "5.1" ? r51 : "";

        const start = startDate;
        const end = endDate;

        let attribute = "";

        if (reportType === "TR") {
          attribute =
            "&attributes_to_show=Access_Type|YOP|Access_Method|Data_Type|Section_Type";
        } else if (reportType === "PR" || reportType === "DR") {
          attribute = "&attributes_to_show=Access_Method|Data_Type";
        } else {
          attribute = "";
        }

        const url = `${library.sushiUrl}${Version}reports/${reportType}/?api_key=${library.apiKey}&customer_id=${library.customerId}&requestor_id=${library.requestorId}&begin_date=${start}&end_date=${end}${attribute}`;

        console.log(`Fetching URL: ${url}`);
        allLogs.push(`Fetching URL: ${url}`);

        // const url = `https://sitemaster.karger.com//sushi/r51/reports/TR?client_id=47&customer_id=971&begin_date=${start}&end_date=${end}&granularity=Monthly&requestor_id=47528&api_key=f443d19c-54f6-4863-97bd-50895065b1ff${attribute}`;

        toast.info(`Fetching data for: sss_S_${library.customerId}`);
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();

          if (
            data &&
            Array.isArray(data.Report_Items) &&
            data.Report_Items.length === 0
          ) {
            logs.push(
              `Failed: sss_S_${library.customerId} / ${library.requestorId} - No Data Found`
            );
          } else {
            logs.push(
              `Success: sss_S_${library.customerId} / ${library.requestorId}`
            );

            // --- Generate and download CSV for this library/report ---
            await generateCSVfromTR(
              [{ data, libraryCode: library.libraryCode }],
              logs
            );

            // --- Save JSON for this library/report ---
            const responseBlob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const responseFileName = `response_${library.customerId}_${reportType}_${start}_to_${end}.json`;
            try {
              const responseFile = await fileHandle.getFileHandle(
                responseFileName,
                { create: true }
              );
              await saveFileWithHandle(responseFile, responseBlob);
            } catch (error) {
              logs.push(
                `Failed to save response file for ${library.customerId}: ${error.message}`
              );
            }
          }

          // (Optional) Save each response to a file as before...
          // ...existing code...
        } catch (error) {
          logs.push(
            `Error: ${library.customerId} / ${library.requestorId} - ${error.message}`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        completedTasks++;
        setProgress(Math.round((completedTasks / totalTasks) * 100));
      }
    }

    // Save all logs to a file
    if (allLogs.length > 0) {
      const logContent = allLogs.join("\n") || "No logs generated.";
      const logBlob = new Blob([logContent], { type: "text/plain" });
      const logFileName = `logs_${formattedStartDate}_to_${formattedEndDate}.txt`;
      try {
        const logFile = await fileHandle.getFileHandle(logFileName, {
          create: true,
        });
        await saveFileWithHandle(logFile, logBlob);
      } catch (error) {
        toast.error(`Failed to save log file: ${error.message}`);
      }
    }

    toast.success("Report processing completed!");
    console.log("Process logs:\n" + allLogs.join("\n"));
  };

  // ... rest of the component code (render method) remains the same ...
  return (
    <>
      <SideNav activeTab="counter-fetcher" />
      <main className="col-span-4 h-full overflow-y-scroll p-2">
        <ToastContainer />
        <section className="w-full flex flex-col gap-2 h-full">
          <nav className="bg-white p-3 flex flex-col gap-1 rounded-md shadow-md border border-gray-100">
            <span className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Progress Count
              </span>
              <span className="text-xs font-medium text-gray-600">
                {progress}%
              </span>
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </nav>

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
                    <a
                      className="text-xs text-blue-500 font-medium hover:underline transition-all duration-300"
                      href="../assets/csv_template.csv"
                      download="csv_template.csv"
                    >
                      Download CSV template
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
              {/* report version  */}
              <div className="bg-white p-3 flex flex-col gap-4 rounded-md shadow-md border border-gray-100">
                <div className="flex flex-col gap-2 justify-between">
                  <h4 className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                    <i className="bx bxs-circle text-red-500"></i>
                    SUSHI Version
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex w-full items-center ps-4 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer dark:border-gray-700">
                      <input
                        id="bordered-radio-version-1"
                        type="radio"
                        value="5.0"
                        name="version"
                        checked={selectedVersion === "5.0"}
                        onChange={() => setSelectedVersion("5.0")}
                        className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor="bordered-radio-version-1"
                        className="w-full py-2 ms-2 text-sm font-medium text-gray-900"
                      >
                        5.0
                      </label>
                    </div>
                    <div className="flex w-full items-center ps-4 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer">
                      <input
                        id="bordered-radio-version-2"
                        type="radio"
                        value="5.1"
                        name="version"
                        checked={selectedVersion === "5.1"}
                        onChange={() => setSelectedVersion("5.1")}
                        className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 focus:ring-blue-500  cursor-pointer"
                      />
                      <label
                        htmlFor="bordered-radio-version-2"
                        className="w-full py-2 ms-2 text-sm font-medium text-gray-900"
                      >
                        5.1
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
                {libraryDetails.map((lib, idx) => (
                  <div
                    key={`${lib.customerId}_${lib.libraryCode || ""}_${idx}`}
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
