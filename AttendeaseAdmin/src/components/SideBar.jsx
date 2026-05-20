import React from "react";
import "./css/SideBar.css";

function SideBar() {
  return (
    <div
      style={{
        color: "wheat",  
        position: "fixed", // added this
        top: "0",
        left: "0",
        height: "100vh",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          backgroundColor: "#043B5C",
          height: "50rem",
          width: "15rem",
          border: "1px solid black",
          borderRadius: "5px",
          overflow: "overlay",
        }}
      >
        <div style={{ marginLeft: "1rem" }}>
          <h1 className="mt-2">AttendEase</h1>
          <p>Workforce Management</p>
        </div>
        <div>
          <ul>
            {/* <li className="SideBarList">
                    <a href="dashbord">Dashboard</a>
                </li> */}
            <li className="SideBarList">
              <a href="/dailyAttendance">Daily Attendance</a>
            </li>
            <li className="SideBarList">
              <a href="/masterMmangement">Master Management</a>
            </li>
            <li className="SideBarList">
              <a href="LeaveManag"></a>
            </li>
            <li className="SideBarList">
              <a href="holidays">Holidays</a>
            </li>
            <li className="SideBarList">
              <a href="/">Reports</a>
            </li>
            <li className="SideBarList">
              <a href="/Employees">Employees</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
