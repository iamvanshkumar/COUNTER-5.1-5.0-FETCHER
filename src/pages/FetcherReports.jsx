import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FetcherReports() {
  const history = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const userToken = sessionStorage.getItem("userToken");
    if (!userToken) {
      history("/login");
    }
  }, [history]);

  const [selectedPlatform, setSelectedPlatform] = useState("ASM");
  const [file, setFile] = useState(null);
  const [libraryDetails, setLibraryDetails] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allReportsSelected, setAllReportsSelected] = useState(false);
  const [allLibrariesSelected, setAllLibrariesSelected] = useState(false);
  function generateCSVfromTR(allReports) {
    const rowsMap = {};
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

    const reportTypes = new Set(); // Collect report types

    allReports.forEach(({ data, libraryCode }) => {
      const reportHeader = data.Report_Header || {};
      let reportType = reportHeader.Report_ID || "Unknown";

      if (!reportType && data.Report_Header?.Report_Name) {
        const name = data.Report_Header.Report_Name;  
        if (name.startsWith("Journal")) reportType = "TR_J1";
        else if (name.startsWith("Book")) reportType = "TR_B1";
        else if (name.startsWith("Platform")) reportType = "PR_P1";
        else if (name.startsWith("Database")) reportType = "DR_D1";
        else reportType = "TR";
      }

      reportTypes.add(reportType);

      const institutionCode =
        libraryCode ||
        reportHeader.Institution_ID?.Proprietary?.[0]?.split(":")[1] ||
        "";

      data.Report_Items?.forEach((item) => {
        const ids = {
          Proprietary: item.Item_ID?.Proprietary || "",
          DOI: item.Item_ID?.DOI || "",
          ISBN: item.Item_ID?.ISBN || "",
          Print_ISSN: item.Item_ID?.Print_ISSN || "",
          Online_ISSN: item.Item_ID?.Online_ISSN || "",
        };

        item.Attribute_Performance?.forEach((attr) => {
          const dataType = attr.Data_Type || "no data";
          const accessType = attr.Access_Type || "no data";
          const accessMethod = attr.Access_Method || "no data";
          const yop = attr.YOP || "no data";

          const performance = attr.Performance;

          for (const [metric, valuesByMonth] of Object.entries(
            performance || {}
          )) {
            for (const [dateStr, count] of Object.entries(
              valuesByMonth || {}
            )) {
              const year = dateStr.slice(0, 4);
              const month = dateStr.slice(5, 7);
              const monthStr = new Date(`${year}-${month}-01`).toLocaleString(
                "en-US",
                {
                  month: "short",
                }
              );

              const key = `${institutionCode}|${
                ids.ISBN || "noisbn"
              }|${metric}`;

              if (!rowsMap[key]) {
                const Proprietary_Identifier = ids.Proprietary || "";
                const pubCode = Proprietary_Identifier
                  ? Proprietary_Identifier.split(":")[0]
                  : "";

                rowsMap[key] = {
                  Institution_Code: institutionCode,
                  pub_code: pubCode || "no data",
                  Title: item.Title || "no data",
                  Publisher: item.Publisher || "no data",
                  Publisher_Id: "no data",
                  Platform: item.Platform || "no data",
                  Collection_Platform: item.Platform || "no data",
                  Report_Type: reportType || "no data",
                  DOI: ids.DOI || "no data",
                  Proprietary_Identifier: Proprietary_Identifier || "no data",
                  ISBN: ids.ISBN || "no data",
                  Print_ISSN: ids.Print_ISSN || "no data",
                  Online_ISSN: ids.Online_ISSN || "no data",
                  URI: "no data",
                  Metric_Type: metric,
                  Counter_Complaint: "no data",
                  Year: year,
                  Month: "",
                  YTD: 0,
                  ...structuredClone(monthCountsTemplate),
                  YOP: yop,
                  Data_Type: dataType,
                  Access_Type: accessType,
                  Access_Method: accessMethod,
                  Section_Type: item.Section_Type || "no data",
                };
              }

              rowsMap[key].YTD += count;
              rowsMap[key][monthStr] += count;
            }
          }
        });
      });
    });

    ///old data

    const allCombinedRows = Object.values(rowsMap);

    if (allCombinedRows.length === 0) {
      toast.error("No data available to generate the CSV file.");
      return;
    }

    const csv = Papa.unparse(allCombinedRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

    const reportTypeString = Array.from(reportTypes).join("_");
    a.download = `${reportTypeString}_Combined_Report_${formattedStartDate}_to_${formattedEndDate}.csv`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);

    fetch("http://localhost:3001/api/insertReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rows: allCombinedRows }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.tableName && result.tableName.trim()) {
          toast.info(`Data inserted into table : "${result.tableName}"`, {
            autoClose: false,
            hideProgressBar: true,
            pauseOnHover: true,
          });
        } else {
          toast.error("No data found to insert.");
        }
      })
      .catch((err) => {
        console.error("Error sending data to backend:", err);
        toast.error("Failed to insert data into database.");
      })
      .finally(() => {
        toast.success("Report downloaded successfully!");
      });
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

    setProgress(0); // Reset progress at the beginning

    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
    const chosenLibraries = libraryDetails.filter((lib) =>
      selectedLibraries.includes(lib.customerId)
    );
    const logs = [];
    const totalTasks = selectedReports.length * chosenLibraries.length;
    let completedTasks = 0;
    toast.info("Preparing your report for download...");

    const formatDate = (date) => {
      const d = new Date(date);
      return selectedPlatform === "RSC"
        ? d.toISOString().slice(0, 7)
        : d.toISOString().split("T")[0];
    };

    let fileHandle = null;
    try {
      fileHandle = await window.showDirectoryPicker();
    } catch (error) {
      toast.error("Failed to select directory.");
      return;
    }

    for (const reportType of selectedReports) {
      const combinedData = [];

      for (const library of chosenLibraries) {
        const asm = "sitemaster.dl.asminternational.org";
        const rsc = "sitemaster.books.rsc.org";
        const selectedSite = selectedPlatform === "ASM" ? asm : rsc;

        const start = formatDate(startDate);
        const end = formatDate(endDate);

        let attribute = "";

        if (reportType === "TR") {
          attribute =
            "&attributes_to_show=Access_Type|YOP|Access_Method|Data_Type|Section_Type";
        } else if (reportType === "PR" || reportType === "DR") {
          attribute = "&attributes_to_show=Access_Method|Data_Type";
        } else {
          attribute = "";
        }

        const url = `https://${selectedSite}/sushi/r51/reports/${reportType}/?api_key=${library.apiKey}&customer_id=${library.customerId}&requestor_id=${library.requestorId}&begin_date=${start}&end_date=${end}${attribute}`;

        toast.info(`Fetching data for : sss_S_${library.customerId}`);
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();
          combinedData.push({ libraryCode: library.libraryCode, data });
          logs.push(`Success: ${library.customerId} / ${library.requestorId}`);

          // Save each response to a file
          const responseBlob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const responseFileName = `response_${library.customerId}_${reportType}_${start}_to_${end}.json`;
          try {
            const responseFile = await fileHandle.getFileHandle(responseFileName, {
              create: true,
            });
            await saveFileWithHandle(responseFile, responseBlob);
          } catch (error) {
            logs.push(`Failed to save response file for ${library.customerId}: ${error.message}`);
          }
        } catch (error) {
          logs.push(
            `Error: ${library.customerId} / ${library.requestorId} - ${error.message}`
          );
        }

        // ✅ Add 2-second delay between each API hit
        await new Promise((resolve) => setTimeout(resolve, 2000));

        completedTasks++;
        setProgress(Math.round((completedTasks / totalTasks) * 100));
      }

      if (combinedData.length > 0) {
        generateCSVfromTR(combinedData);
        const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
          type: "application/json",
        });
        const fileName = `report_${reportType}_${formattedStartDate}_to_${formattedEndDate}.json`;
        try {
          const file = await fileHandle.getFileHandle(fileName, {
            create: true,
          });
          await saveFileWithHandle(file, blob);
        } catch (error) {
          logs.push(`Failed to save file for ${reportType}: ${error.message}`);
        }
      } else {
        logs.push(`No data for ${reportType}`);
      }
    }

    if (logs.length > 0) {
      const logContent = logs.join("\n") || "No logs generated.";
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
  };

  return (
    <>
      <SideNav activeTab="insight-fetcher" />
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
