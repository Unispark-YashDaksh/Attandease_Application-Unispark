import React, { useState } from "react";
import Department from "./master/Department";
import Designation from "./master/Designation";
import Branches from "./master/Branches";
import Shifts from "./master/Shifts";
import Roles from "./master/Roles";
import "../css/masterManagement.css";

function MasterManagement() {
  const [activeTab, setActiveTab] = useState("department");
  const getTabClassName = (tabName) =>
    `master-tab ${activeTab === tabName ? "active" : ""}`;

  return (
    <div className="master-management">
      <header className="navbar">
        <div className="navbar-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>

        <div className="navbar-tabs-container">
          <div className="navbar-tabs">
            <button
              className={getTabClassName("department")}
              onClick={() => setActiveTab("department")}
              aria-label="Department tab"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM4 9v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9H4zm2 0h12v2H6V9zm0 4h12v2H6v-2zm0 4h8v2H6v-2z"/>
              </svg>
              Department
            </button>
            <button
              className={getTabClassName("designation")}
              onClick={() => setActiveTab("designation")}
              aria-label="Designations tab"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7a5 5 0 1 1 5 5 5 5 0 0 1-5-5zm0 8a3 3 0 1 0 3-3 3 3 0 0 0-3 3zM12 1a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1zM4.93 3.32a1 1 0 0 1 1.41 0l2.83 2.83a1 1 0 0 1 0 1.42L6.41 8.59a1 1 0 0 1-1.42-1.42L4.93 3.32zM17.66 20.68a1 1 0 0 1-1.41 0l-2.83-2.83a1 1 0 1 0-1.42 1.42l2.83 2.83a1 1 0 1 1.41 0z"/>
              </svg>
              Designations
            </button>
            <button
              className={getTabClassName("branches")}
              onClick={() => setActiveTab("branches")}
              aria-label="Branches tab"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6h-4V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM10 4h4v2h-4V4zM20 19H4V9h16v10zM8 13a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2H8zM8 15a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2H8z"/>
              </svg>
              Branches
            </button>
            <button
              className={getTabClassName("shifts")}
              onClick={() => setActiveTab("shifts")}
              aria-label="Shifts tab"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H18V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11zM9 10h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2zm0 4h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2zm0 4h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2z"/>
              </svg>
              Shifts
            </button>
            <button
              className={getTabClassName("roles")}
              onClick={() => setActiveTab("roles")}
              aria-label="Roles tab"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1 0-16 8 8 0 0 1 0 16zm1-8h2v2h-2zM12 6a1 1 0 0 0-1 1H9a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z"/>
              </svg>
              Roles
            </button>
          </div>
        </div>
      </header>

      {activeTab === "department" && <Department />}
      {activeTab === "designation" && <Designation />}
      {activeTab === "branches" && <Branches />}
      {activeTab === "shifts" && <Shifts />}
      {activeTab === "roles" && <Roles />}
    </div>
  );
}

export default MasterManagement;
