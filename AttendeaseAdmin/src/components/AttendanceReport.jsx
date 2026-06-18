import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AttendanceReport.css";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const ITEMS_PER_PAGE = 15;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AttendanceReport() {
  const today = new Date();
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [reportMonth, setReportMonth] = useState(today.getMonth() + 1);
  const [reportYear, setReportYear] = useState(today.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${apiUrl}/activeEmployee`)
      .then((res) => {
        if (res.data.success) setEmployees(res.data.result || []);
      })
      .catch(() => {});
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEmp, reportMonth, reportYear]);

  const fetchReport = async () => {
    if (!selectedEmp) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${apiUrl}/attendance/report/${selectedEmp}/${reportMonth}/${reportYear}`,
      );
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEmp) fetchReport();
  }, [selectedEmp, reportMonth, reportYear]);

  const exportCSV = () => {
    if (!report) return;
    const rows = [
      ["Date", "Day", "Punch In", "Punch Out", "Status", "Reason"],
      ...report.days.map((d) => [
        d.date,
        d.day_name,
        d.punch_in || "-",
        d.punch_out || "-",
        d.status,
        d.reason || (d.status === "present" ? "" : "No reason"),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${report.employee.name}_${reportMonth}_${reportYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusClass = (status, reason) => {
    if (status === "present") return "status-present";
    if (reason === "Sunday") return "status-sunday";
    if (reason && reason.startsWith("Holiday")) return "status-holiday";
    return "status-absent";
  };

  // Pagination calculations
  const totalPages = report
    ? Math.ceil(report.days.length / ITEMS_PER_PAGE)
    : 0;
  const paginatedDays = report
    ? report.days.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : [];

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Attendance Report</h2>

      <div className="report-filters">
        <div className="filter-group">
          <label>Employee</label>
          <select
            value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_name} ({emp.employee_code})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Month</label>
          <select
            value={reportMonth}
            onChange={(e) => setReportMonth(Number(e.target.value))}
          >
            {MONTHS.map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Year</label>
          <input
            type="number"
            value={reportYear}
            onChange={(e) => setReportYear(Number(e.target.value))}
            min="2020"
            max="2099"
          />
        </div>

        <button className="btn-export" onClick={exportCSV} disabled={!report}>
          Export CSV
        </button>
      </div>

      {loading && <p className="report-loading">Loading report...</p>}
      {error && <p className="report-error">{error}</p>}

      {report && (
        <>
          <div className="report-summary">
            <div className="summary-card">
              <strong>{report.employee.name}</strong>
              <span>{report.employee.code}</span>
            </div>
            <div className="summary-card">
              <span>Total Days</span>
              <strong>{report.totalDays}</strong>
            </div>
            <div className="summary-card">
              <span>Present</span>
              <strong className="text-green">{report.presentDays}</strong>
            </div>
            <div className="summary-card">
              <span>Absent</span>
              <strong className="text-red">{report.absentDays}</strong>
            </div>
          </div>

          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDays.map((d, i) => (
                  <tr
                    key={d.date}
                    className={getStatusClass(d.status, d.reason)}
                  >
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                    <td>{d.date}</td>
                    <td>{d.day_name}</td>
                    <td>{d.punch_in || "-"}</td>
                    <td>{d.punch_out || "-"}</td>
                    <td>
                      <span
                        className={`badge ${getStatusClass(d.status, d.reason)}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td>{d.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => goToPage(1)}
              >
                &laquo;
              </button>
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                &lsaquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "page-active" : ""}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                &rsaquo;
              </button>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(totalPages)}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}

      {!selectedEmp && !loading && (
        <p className="report-placeholder">
          Select an employee to view attendance report.
        </p>
      )}
    </div>
  );
}
