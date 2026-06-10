import React, { useEffect, useState } from "react";
import "../css/AttendanceDashboard.css";
import axios from "axios";
const apiUrl= import.meta.env.VITE_API;

function DailyAttendance() {
  const [dailyAttendance, setDailyAttendance] = useState([]);

  useEffect(() => {
    handleFetchDailyAttendance();
  }, []);

  const handleFetchDailyAttendance = async () => {
    const response = await axios.get(`${apiUrl}/fetchAttendance`);
    setDailyAttendance(response.data.result);
  };

  const totalEmployees = dailyAttendance.length;
  const presentCount = dailyAttendance.filter(
    (item) => item.status?.toLowerCase() === "present"
  ).length;
  const lateCount = dailyAttendance.filter(
    (item) => Number(item.late_minutes) > 0
  ).length;
  const absentCount = dailyAttendance.filter(
    (item) => item.status?.toLowerCase() === "absent"
  ).length;
  const wfhCount = dailyAttendance.filter(
    (item) => item.attendance_mode?.toLowerCase() === "wfh"
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
          <input type="date" />
        </div>

        <div className="filter-field">
          <label>DEPARTMENT</label>
          <select>
            <option>All Departments</option>
            <option>Engineering</option>
            <option>HR</option>
            <option>Marketing</option>
          </select>
        </div>

        <div className="filter-field">
          <label>BRANCH</label>
          <select>
            <option>All Branches</option>
            <option>Head Office</option>
            <option>Branch Office</option>
          </select>
        </div>

        <div className="filter-field">
          <label>STATUS</label>
          <select>
            <option>All Status</option>
            <option>Present</option>
            <option>Late</option>
            <option>Absent</option>
          </select>
        </div>

        <button className="filter-btn">
          <span className="material-symbols-outlined">filter_list</span>
          Apply Filters
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
              {dailyAttendance.map((item) => {
                const isLate = Number(item.late_minutes) > 0;
                const statusClass = item.status?.toLowerCase() || "present";
                const modeClass = item.attendance_mode?.toLowerCase() || "office";

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
                          {item.late_minutes} Mins Late
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
          <span>Showing {dailyAttendance.length} employees</span>

          <div className="pagination">
            <button>Prev</button>
            <button className="active">1</button>
            <button>2</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DailyAttendance;