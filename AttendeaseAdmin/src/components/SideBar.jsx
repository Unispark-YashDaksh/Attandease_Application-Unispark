import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdGroups,
  MdEventAvailable,
  MdHolidayVillage,
  MdAssessment,
  MdStorage,
  MdPerson,
  MdSettings,
  MdLogout,
} from "react-icons/md";

import "../css/SideBar.css";

function SideBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/screen.svg" className="animate-spin" alt="Logo" style={{ width: 40, height: 40 }} />
          <h4 style={{ margin: 0 }}>Spark HRMS Admin
            <p>Enterprise Suite</p>
          </h4>
        </div>
        
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MdDashboard size={22} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/Employees" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MdGroups size={22} />
          <span>Employees</span>
        </NavLink>

        <NavLink to="/dailyAttendance" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MdEventAvailable size={22} />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/LeaveManag" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MdHolidayVillage size={22} />
          <span>Leaves</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MdAssessment size={22} />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/masterMmangement" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MdStorage size={22} />
          <span>Masters</span>
        </NavLink>

        <div className="sidebar-bottom">
          <NavLink to="/profile" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <MdPerson size={22} />
            <span>Profile</span>
          </NavLink>

          <NavLink to="/settings" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <MdSettings size={22} />
            <span>Settings</span>
          </NavLink>

          <NavLink to="/logout" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <MdLogout size={22} />
            <span>Logout</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}

export default SideBar;