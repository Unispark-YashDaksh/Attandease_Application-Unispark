/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import "../css/AttendanceDashboard.css";
import axios from "axios";
const apiUrl= import.meta.env.VITE_BACKEND_URL;

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function DailyAttendance() {
  const [dailyAttendance, setDailyAttendance] = useState([]);

  const todayDate = getTodayDate();

  const [filterCriteria, setFilterCriteria] = useState({
    date: todayDate,
    department: "",
    branch: "",
    status: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    date: todayDate,
    department: "",
    branch: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const handleFetchDailyAttendance = async () => {
    const response = await axios.get(`${apiUrl}/fetchAttendance`);
    setDailyAttendance(response.data.result);
  };

  useEffect(() => {
    handleFetchDailyAttendance();
  }, []);

  function handleFilterChange(params) {
    const { name, value } = params.target;

    setFilterCriteria({
      ...filterCriteria,
      [name]: value,
    });
  }

  function applyFilters() {
    setAppliedFilters(filterCriteria);
    setCurrentPage(1);
  }

  function clearFilters() {
    const emptyFilters = {
      date: getTodayDate(),
      department: "",
      branch: "",
      status: "",
    };
    setFilterCriteria(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  }

  const filteredAttendance = dailyAttendance.filter((item) => {
    const attendanceDate = item.attendance_date?.slice(0, 10);

    if (appliedFilters.date && attendanceDate !== appliedFilters.date) {
      return false;
    }

    if (
      appliedFilters.department &&
      item.department_name !== appliedFilters.department
    ) {
      return false;
    }

    if (appliedFilters.branch && item.branch_name !== appliedFilters.branch) {
      return false;
    }

    if (appliedFilters.status === "Late" && Number(item.late_minutes) <= 0) {
      return false;
    }

    if (
      appliedFilters.status &&
      appliedFilters.status !== "Late" &&
      item.status?.toLowerCase() !== appliedFilters.status.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const departmentOptions = [
    ...new Set(
      dailyAttendance.map((item) => item.department_name).filter(Boolean),
    ),
  ];

  const branchOptions = [
    ...new Set(dailyAttendance.map((item) => item.branch_name).filter(Boolean)),
  ];

  const totalEmployees = filteredAttendance.length;
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttendance = filteredAttendance.slice(startIndex, endIndex);
  const showingFrom = filteredAttendance.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, filteredAttendance.length);
  const presentCount = filteredAttendance.filter(
    (item) => item.status?.toLowerCase() === "present",
  ).length;
  const lateCount = filteredAttendance.filter(
    (item) => Number(item.late_minutes) > 0,
  ).length;
  const absentCount = filteredAttendance.filter(
    (item) => item.status?.toLowerCase() === "absent",
  ).length;
  const wfhCount = filteredAttendance.filter(
    (item) => item.attendance_mode?.toLowerCase() === "wfh",
  ).length;

  return (
    <main className="attendance-page">
      <div className="attendance-header">
        <h2>Attendance Dashboard</h2>

        <button className="export-btn">
          <span className="material-symbols-outlined">file_download</span>
          Export Report
        </button>
      </div>

      <div className="attendance-metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="material-symbols-outlined metric-icon primary">
              group
            </span>
            <span className="metric-label">TOTAL</span>
          </div>
          <h3>{totalEmployees}</h3>
          <p>Active Workforce</p>
        </div>

        <div className="metric-card success-border">
          <div className="metric-top">
            <span className="material-symbols-outlined metric-icon success">
              check_circle
            </span>
            <span className="metric-label">PRESENT</span>
          </div>
          <h3 className="success-text">{presentCount}</h3>
          <p>Working Today</p>
        </div>

        <div className="metric-card danger-border">
          <div className="metric-top">
            <span className="material-symbols-outlined metric-icon danger">
              cancel
            </span>
            <span className="metric-label">ABSENT</span>
          </div>
          <h3 className="danger-text">{absentCount}</h3>
          <p>Unaccounted</p>
        </div>

        <div className="metric-card warning-border">
          <div className="metric-top">
            <span className="material-symbols-outlined metric-icon warning">
              schedule
            </span> 
            <span className="metric-label">LATE</span>
          </div>
          <h3 className="warning-text">{lateCount}</h3>
          <p>After Shift Time</p>
        </div>

        <div className="metric-card primary-border">
          <div className="metric-top">
            <span className="material-symbols-outlined metric-icon primary">
              home_work
            </span>
            <span className="metric-label">WFH</span>
          </div>
          <h3 className="primary-text">{wfhCount}</h3>
          <p>Remote Work</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-field">
          <label>DATE</label>
          <input
            type="date"
            name="date"
            value={filterCriteria.date}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-field">
          <label>DEPARTMENT</label>
          <select
            name="department"
            value={filterCriteria.department}
            onChange={handleFilterChange}
          >
            <option value="">All Departments</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label>BRANCH</label>
          <select
            name="branch"
            value={filterCriteria.branch}
            onChange={handleFilterChange}
          >
            <option value="">All Branches</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label>STATUS</label>
          <select
            name="status"
            value={filterCriteria.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button className="filter-btn" type="button" onClick={applyFilters}>
          <span className="material-symbols-outlined">filter_list</span>
          Apply Filters
        </button>

        <button type="button" className="filter-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>

      <div className="attendance-table-container">
        <div className="attendance-table-scroll">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>CODE</th>
                <th>DEPARTMENT</th>
                <th>ATTENDANCE DATE</th>
                <th>PUNCH IN</th>
                <th>PUNCH OUT</th>
                <th>WH / LATE</th>
                <th>STATUS</th>
                <th>MODE</th>
                <th>LOCATION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAttendance.map((item) => {
                // Why: Format raw minutes into "X hour(s) Y minute(s)" for readability
                const formatLateMinutes = (mins) => {
                  const m = Number(mins);
                  if (!m || m <= 0) return "";
                  const hours = Math.floor(m / 60);
                  const minutes = m % 60;
                  if (hours > 0 && minutes > 0) return `${hours} hour ${minutes} minutes`;
                  if (hours > 0) return `${hours} hour`;
                  return `${minutes} minutes`;
                };
                const isLate = Number(item.late_minutes) > 0;
                const statusClass = item.status?.toLowerCase() || "present";
                const modeClass =
                  item.attendance_mode?.toLowerCase() || "office";

                return (
                  <tr
                    key={item.id}
                    className={
                      statusClass === "absent"
                        ? "absent-row"
                        : isLate
                          ? "late-row"
                          : "present-row"
                    }
                  >
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {item.employee_name?.charAt(0)}
                        </div>

                        <div>
                          <h6>{item.employee_name}</h6>
                          <p>{item.designation_name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="employee-code">{item.employee_code}</td>
                    <td>{item.department_name}</td>
                    <td>{item.attendance_date}</td>

                    <td>
                      <span className={isLate ? "late-punch" : "punch-in"}>
                        {item.punch_in || "--:--"}
                      </span>
                    </td>

                    <td className="muted-text">{item.punch_out || "--:--"}</td>

                    <td>
                      {isLate ? (
                        <span className="late-text">
                          {formatLateMinutes(item.late_minutes)} Late
                        </span>
                      ) : (
                        <span className="on-time">On Time</span>
                      )}
                    </td>

                    <td>
                      <span className={`status ${statusClass}`}>
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <span className={`mode ${modeClass}`}>
                        {item.attendance_mode}
                      </span>
                    </td>

                    <td>
                      <span className="location-text">
                        {item.gps_location || "N/A"}
                      </span>
                    </td>

                    <td>
                      <button className="correct-btn">CORRECT</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {showingFrom} to {showingTo} of {filteredAttendance.length}{" "}
            employees
          </span>

          <div className="pagination">
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Prev
            </button>
            <button type="button" className="active">
              {safeCurrentPage}
            </button>
            <button
              type="button"
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DailyAttendance;
