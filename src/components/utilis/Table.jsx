import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import {useOutsideClick} from "../hooks/useOutsideClick";
import { toast } from "react-toastify";
import axios from "axios";
// import Loading from "./Loading";
import { useTranslation } from 'react-i18next';
const Table = ({
  title = "Table Title",
  button,
  columns = [],
  data = [],
  actions = [],
  onSearch = () => {},
  onEntriesChange = () => {},
  entriesOptions = [5, 10, 25, 50, 100],
  exportButton = false,
  importButton = false,
  dataType,
  currentPage,
  totalPages,
  onPageChange,

  onRowClick = () => { },
  loading = false
}) => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [displayData, setDisplayData] = useState(data);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const fileInputRef = useRef(null);  // Ref for the file input
  // const apiUrl = process.env.REACT_APP_API_URL;
  // Use the custom hook to handle clicks outside the dropdown

   const ref = useOutsideClick(() => {
    setDropdownOpen(false);
    });

  useEffect(() => {
    if (entriesPerPage === "All") {
      setDisplayData(data);
    } else {
      setDisplayData(data.slice(0, entriesPerPage));
    }
  }, [entriesPerPage, data]);

  // Utility function to generate CSV from table data
  const generateCSV = () => {
    const header = columns.map((col) => col.header).join(",") + "\n";
    const rows = data
      .map((row) =>
        columns
          .map((col) => row[col.accessor])
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table.csv";
    link.click();
  };

  // Print functionality
  const printTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Print Table</title></head><body>"
    );
    printWindow.document.write("<h1>" + title + "</h1>");
    printWindow.document.write(document.querySelector("table").outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  // Copy to clipboard functionality
  const copyToClipboard = () => {
    const headers = columns.map((col) => col.header).join("\t");
    const rows = displayData
      .map((row) => columns.map((col) => row[col.accessor] || "").join("\t"))
      .join("\n");
    navigator.clipboard.writeText(`${headers}\n${rows}`);
    toast.success(t('translation:tableDataCopiedToClipboard'));
  };

  // Excel export functionality
  // const exportToExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Table Data");
  //   XLSX.writeFile(wb, "table.xlsx");
  // };
  const exportToExcel = () => {
    // Remove _id and employeeId from each object
    const filteredData = data.map(({ _id, employeeId, ...rest }) => rest);
  
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table Data");
    XLSX.writeFile(wb, "table.xlsx");
  };
  
  

  // PDF generation functionality
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(title, 20, 10);

    const tableColumns = columns.map((col) => col.header); // Extract column headers for PDF
    const tableRows = (entriesPerPage === "All" ? data : displayData).map(
      (row) => columns.map((col) => row[col.accessor]) // Map row data based on column accessors
    );

    doc.autoTable({
      head: [tableColumns],
      body: tableRows, // Rows of the table
      startY: 20, // Adjust this to prevent overlap with title text
      margin: { top: 10 },
    });

    doc.save("table.pdf");
  };

  // Handle export option clicks
  const handleExportOptionClick = (option) => {
    switch (option) {
      case "Print":
        printTable();
        break;
      case "Copy":
        copyToClipboard();
        break;
      case "Excel":
        exportToExcel();
        break;
      case "CSV":
        generateCSV();
        break;
      case "PDF":
        generatePDF();
        break;
      default:
        break;
    }
    setDropdownOpen(false); // Close the dropdown after action
  };

  // Handle entries per page change
  const handleEntriesPerPageChange = (e) => {
    const selectedEntries = e.target.value;
    setEntriesPerPage(selectedEntries);
    if (onEntriesChange) {
      onEntriesChange(selectedEntries);
    }
  };
  const statusColors = {
    Active: "text-green-700 font-semibold",
    Inactive: "text-gray-500 font-semibold",
    Pending: "text-yellow-500 font-semibold",
    Completed: "text-blue-700 font-semibold",
    Delivered: "text-green-700 font-semibold",
    Running: "text-indigo-600 font-semibold",
    "Assigned to": "text-purple-600 font-semibold",
    Unassigned: "text-red-600 font-semibold", // Changed to red to indicate urgency
    "Quality Check": "text-pink-600 font-semibold",
    "Approved by": "text-teal-600 font-semibold",
};

const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            let json = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // Ensure empty cells are handled
            // Ensure imported data has WhatsApp & Mail fields/icons
            const enrichedData = json.map((item) => ({
              ...item,
              whatsappIcon: "📱", 
              mailIcon: "✉️", 
          }));
            // Merge with existing data instead of replacing
            setDisplayData((prevData) => [...prevData, ...enrichedData]);


            // Call handleSaveImportedFile AFTER setting data
            handleSaveImportedFile(json);
        };
        reader.readAsBinaryString(file); // Alternative: Use readAsArrayBuffer
    }
};

// const handleSaveImportedFile = async (jsonData) => {
//   try {
//       const response = await axios.post(`${apiUrl}/api/leads/import-data`, jsonData, {
//           withCredentials: true,
//           headers: {
//               "Content-Type": "application/json",
//           },
//       });

//       // console.log("Server Response:", response.data);
//       if (response.status === 200) {
//           alert("Data imported successfully!");
//       } 

//   } catch (error) {
//       console.error("Error saving imported data:", error);
//       alert("An error occurred while saving data.");
//   }
// };

// const handleSaveImportedFile = async (jsonData) => {
//   try {
//     if (dataType === "clients") {
//       const response = await axios.post(`${apiUrl}/api/clients/import-clients-data`, jsonData, {
//         withCredentials: true,
//         headers: { "Content-Type": "application/json" },
//       });
//       console.log("Server Response:", response.data);
      
//     } else if (dataType === "leads") {
//      const response1 = await axios.post(`${apiUrl}/api/leads/import-data`, jsonData, {
//         withCredentials: true,
//         headers: { "Content-Type": "application/json" },
//       });
//       console.log("Server Response:", response1.data);
      
//     }  else {
//       await axios.post(`${apiUrl}/api/import-data`, jsonData, {
//         withCredentials: true,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     toast.success("Data imported successfully!");
//   } catch (error) {
//     console.error("Error saving imported data:", error);
//     toast.error(
//       error.response?.data?.message || "An error occurred while saving data."
//     );
//   }
// };


// const removeCircularReferences = (data) => {
//   const seen = new WeakSet();
//   return JSON.parse(
//       JSON.stringify(data, (key, value) => {
//           if (typeof value === "object" && value !== null) {
//               if (seen.has(value)) return; // Skip circular references
//               seen.add(value);
//           }
//           return value;
//       })
//   );
// };


  return (
    <div className="h-auto">
      <div className="max-w-[1410px] mx-auto bg-white border-2 border-teal-500 rounded-lg p-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-0">
            {title}
          </h1>
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            <div className="relative" ref={ref}>
              {exportButton && (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3 py-2 bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 rounded-lg text-sm"
                >{t('translation:export')}</button>
              )}
              {importButton && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 py-2 bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 rounded-lg text-sm"
                >{t('translation:Import')}</button>
              )}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg">
                  <ul className="text-sm">
                    {["Print", "Copy", "Excel", "CSV", "PDF"].map((option) => (
                      <li
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleExportOptionClick(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {actions.map((action, index) => (
              <button
                key={index}
                className={`px-3 py-2 
                  ${action.disabled
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : action.primary
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200"
                } rounded-lg text-sm`}
                onClick={action.onClick}
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* File input for importing */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileImport}
          accept=".csv, .xlsx, .xls"
        />
        {/* Search and Entries Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <input
            type="text"
            placeholder={t('translation:search')}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 mb-4 md:mb-0 outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="flex flex-row items-center space-x-2">
            <span className="text-sm">{t('translation:show')}</span>
            <select
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
              value={entriesPerPage}
              onChange={handleEntriesPerPageChange}
            >
              {entriesOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "All" ? "All" : option}
                </option>
              ))}
            </select>
            <span className="text-sm">{t('translation:entries')}</span>
          </div>
        </div>

        {/* Table Section */}
        {loading ?<Loading /> : (<div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="border border-gray-200 px-4 py-2 text-left text-sm md:text-base font-medium text-gray-700"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                  onClick={() => onRowClick(row)}
                >
                  {columns.map((column, colIndex) => {
                    // Check if the column is one where we want to apply specific colors
                    const cellValue = column.render
                      ? column.render(row)
                      : row[column.accessor];
                    const colorClass =
                      column.accessor === "status" && statusColors[cellValue]
                        ? statusColors[cellValue]
                        : "";

                    return (
                      <td
                        key={colIndex}
                        className={`border border-gray-200 px-4 py-2 text-sm md:text-base text-gray-800 ${colorClass} ${
                          column.className || ""
                        }`}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>)}
         {/* Pagination */}
         <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded-md"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >{t('translation:prev')}</button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded-md"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >{t('translation:next')}</button>
        </div>
      </div>
    </div>
  );
};

export default Table;
