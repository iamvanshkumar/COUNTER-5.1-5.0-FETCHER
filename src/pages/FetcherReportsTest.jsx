import React, { useState, useRef } from "react";
import SideNav from "../components/SideNav";

export default function FetcherReportsTest() {
  const [file, setFile] = useState(null);
  const [libraryDetails, setLibraryDetails] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [logs, setLogs] = useState([]);
  const [allReportsSelected, setAllReportsSelected] = useState(false);
  const [loadingLibraries, setLoadingLibraries] = useState(false);
  const fileInputRef = useRef(null);

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

  const toggleReport = (value) => {
    setReportTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleAllReports = () => {
    const allSelected = !allReportsSelected;
    setAllReportsSelected(allSelected);
    setReportTypes(allSelected ? reportOptions : []);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoadingLibraries(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target.result;
      const rows = csvData.split("\n").filter((row) => row.trim() !== "");
      const headers = rows[0].split(",").map((h) => h.trim());

      const details = rows.slice(1).map((row) => {
        const values = row.split(",");
        const entry = {};
        headers.forEach((header, index) => {
          entry[header] = values[index] ? values[index].trim() : "";
        });
        return {
          libraryCode: entry["LIB_code"],
          apiKey: entry["api_key"],
          requestorId: entry["Requestor_ID"],
          customerId: entry["Customer_ID"],
        };
      });

      setLibraryDetails(details);
      setLoadingLibraries(false);
    };
    reader.readAsText(uploadedFile);
  };

  const toggleLibrary = (customerId) => {
    setSelectedLibraries((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

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
      alert(`Saved file: ${suggestedName}`);
    } catch (error) {
      alert(`Failed to save file: ${error.message}`);
    }
  };

  const saveLogsWithPicker = async (logs, suggestedName) => {
    try {
      const content = logs.join("\n") || "No logs generated.";
      const blob = new Blob([content], { type: "text/plain" });
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          { description: "Text Log Files", accept: { "text/plain": [".txt"] } },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      alert(`Log file saved: ${suggestedName}`);
    } catch (error) {
      alert(`Failed to save log file: ${error.message}`);
    }
  };

  const fetchReports = async () => {
    if (reportTypes.length === 0)
      return alert("Select at least one report type.");
    if (selectedLibraries.length === 0)
      return alert("Select at least one library.");
    if (!startDate || !endDate)
      return alert("Please select a valid date range.");

    const selectedDetails = libraryDetails.filter((lib) =>
      selectedLibraries.includes(lib.customerId)
    );
    const logs = [];

    for (const reportType of reportTypes) {
      const combinedData = [];
      for (const lib of selectedDetails) {
        const url = `https://sitemaster.dl.asminternational.org/sushi/reports/${reportType}/?api_key=${lib.apiKey}&customer_id=${lib.customerId}&requestor_id=${lib.requestorId}&begin_date=${startDate}&end_date=${endDate}`;
        try {
          const res = await fetch(url);
          if (!res.ok) {
            const errorMsg = `❌ Error for ${lib.customerId}: ${res.statusText}`;
            logs.push(errorMsg);
            continue;
          }
          const data = await res.json();
          combinedData.push({ libraryCode: lib.libraryCode, data });
          logs.push(`✅ Success for ${lib.customerId}`);
        } catch (err) {
          logs.push(`❌ Network error for ${lib.customerId}: ${err.message}`);
        }
      }

      if (combinedData.length > 0) {
        const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
          type: "application/json",
        });
        await saveFileWithPicker(
          blob,
          `report_${reportType}_${startDate}_to_${endDate}.json`
        );
      } else {
        logs.push(`⚠️ No data for report ${reportType}`);
      }
    }

    if (logs.length) {
      await saveLogsWithPicker(logs, `logs_${startDate}_to_${endDate}.txt`);
      setLogs(logs);
    }
  };

  return (
    <div className="p-4">
      <SideNav />

      <h2 className="text-xl font-bold mb-2">Upload Library CSV</h2>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} />
      {file && (
        <p className="text-sm mt-1 text-gray-500">Selected: {file.name}</p>
      )}

      <h3 className="mt-4 font-semibold">Date Range</h3>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="ml-2"
      />

      <h3 className="mt-4 font-semibold">Report Types</h3>
      <button
        onClick={toggleAllReports}
        className="text-blue-500 underline text-sm mb-2"
      >
        {allReportsSelected ? "Deselect All" : "Select All"}
      </button>
      <div className="grid grid-cols-4 gap-2">
        {reportOptions.map((r) => (
          <label key={r} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              name="reportType"
              checked={reportTypes.includes(r)}
              onChange={() => toggleReport(r)}
            />
            <span>{r}</span>
          </label>
        ))}
      </div>

      <h3 className="mt-4 font-semibold">Library Codes</h3>
      {loadingLibraries && (
        <p className="text-gray-400">Loading library details...</p>
      )}
      <div className="grid grid-cols-2 gap-2 mt-2" id="libraryCodeSelect">
        {libraryDetails.map((lib) => (
          <div
            key={lib.customerId}
            onClick={() => toggleLibrary(lib.customerId)}
            className={`p-2 rounded-md cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200
              ${
                selectedLibraries.includes(lib.customerId)
                  ? "bg-green-200 text-green-700"
                  : "bg-blue-100 text-gray-900 hover:bg-green-100 hover:text-green-600"
              }`}
          >
            <input
              type="checkbox"
              checked={selectedLibraries.includes(lib.customerId)}
              onChange={() => toggleLibrary(lib.customerId)}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{lib.libraryCode}</span>
          </div>
        ))}
      </div>

      <button
        onClick={fetchReports}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Reports
      </button>

      {logs.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Log Summary</h4>
          <pre className="bg-gray-100 p-2 text-xs rounded overflow-auto max-h-40">
            {logs.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}
