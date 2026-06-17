import React from "react";
import Department from "./master/Department";
import Designation from "./master/Designation";
import Branches from "./master/Branches";
import { useState } from "react";
import Shifts from "./master/Shifts";
import Roles from "./master/Roles";
import "../css/masterManagement.css";

function MasterManagement() {
  const [activeTab, setActiveTab] = useState("department");
  const getTabClassName = (tabName) =>
    `nav-link master-tab ${activeTab === tabName ? "active" : ""}`;

  return (
    <div className="master-management">
      {/*Changend class to className*/}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className={getTabClassName("department")}
                  aria-current={activeTab === "department" ? "page" : undefined}
                  onClick={() => {
                    setActiveTab("department");
                  }}
                >
                  Department
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={getTabClassName("designation")}
                  aria-current={activeTab === "designation" ? "page" : undefined}
                  onClick={() => {
                    setActiveTab("designation");
                  }}
                >
                  Designations
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={getTabClassName("branches")}
                  aria-current={activeTab === "branches" ? "page" : undefined}
                  onClick={() => {
                    setActiveTab("branches");
                  }}
                >
                  Branches
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={getTabClassName("shifts")}
                  aria-current={activeTab === "shifts" ? "page" : undefined}
                  onClick={() => {
                    setActiveTab("shifts");
                  }}
                >
                  Shifts
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={getTabClassName("roles")}
                  aria-current={activeTab === "roles" ? "page" : undefined}
                  onClick={() => {
                    setActiveTab("roles");
                  }}
                >
                  Roles
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {activeTab === "department" && <Department />}
      {activeTab === "designation" && <Designation />}
      {activeTab === "branches" && <Branches />}
      {activeTab === "shifts" && <Shifts />}
      {activeTab === "roles" && <Roles />}
    </div>
  );
}

export default MasterManagement;
