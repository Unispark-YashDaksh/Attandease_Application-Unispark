import React from "react";
import "./css/AttendanceDashboard.css";

function DailyAttendance() {
  return (
    <div>
      <h5>Attendance Dashboard</h5>
      <div
        className="mt-5"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div id="attendance-dashboard"></div>
        <div id="attendance-dashboard"></div>
        <div id="attendance-dashboard"></div>
        <div id="attendance-dashboard"></div>
        <div id="attendance-dashboard"></div>
      </div>

      <div
        className="mt-5 mb-5"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="filters-section">
          <p>Date</p>
          <input type="date" name="" id="" />
          <p>Department</p>
          <select name="" id="">
            <option value="">1</option>
            <option value="">2</option>
            <option value="">3</option>
          </select>
          <p>Branch</p>
          <select name="" id="">
            <option value="">1</option>
            <option value="">2</option>
            <option value="">3</option>
          </select>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>CODE</th>
              <th>DEPARTMENT</th>
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
            <tr>
              {/* Employee */}
              <td>
                <div className="employee-cell">
                  <img src="" alt="" className="employee-image" />

                  <div>
                    <h6>Employee Name</h6>
                    <p>Designation</p>
                  </div>
                </div>
              </td>

              {/* Employee Code */}
              <td>EMP-0001</td>

              {/* Department */}
              <td>Department</td>

              {/* Punch In */}
              <td>
                <span className="punch-in">00:00 AM</span>
              </td>

              {/* Punch Out */}
              <td>--:--</td>

              {/* Working Hours / Late */}
              <td>
                <div>
                  <h6>0h</h6>
                  <p className="on-time">On Time</p>
                </div>
              </td>

              {/* Status */}
              <td>
                <span className="status present">Present</span>
              </td>

              {/* Mode */}
              <td>
                <span className="mode office">Office</span>
              </td>

              {/* Location */}
              <td></td>

              {/* Actions */}
              <td>
                <button className="correct-btn">ACTION</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyAttendance;
