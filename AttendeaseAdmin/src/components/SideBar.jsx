import React from "react";
import { Link } from "react-router-dom";
import "../css/SideBar.css";

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
              <Link to="/dailyAttendance">Daily Attendance</Link>
            </li>
            <li className="SideBarList">
              <Link to="/masterMmangement">Master Management</Link>
            </li>
            <li className="SideBarList">
              <Link to="/LeaveManag"></Link>
            </li>
            <li className="SideBarList">
              <Link to="/holidays">Holidays</Link>
            </li>
            <li className="SideBarList">
              <Link to="/">Reports</Link>
            </li>
            <li className="SideBarList">
              <Link to="/Employees">Employees</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
