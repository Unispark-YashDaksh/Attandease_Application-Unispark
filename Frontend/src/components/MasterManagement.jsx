import React from "react";
import Department from "./master/Department";
import Designation from "./master/Designation";
import Branches from "./master/Branches";
import { useState } from "react";
import Shifts from "./master/Shifts";
import Roles from "./master/Roles";

function MasterManagement(){
  const  [activeTab, setActiveTab]= useState("department");

  

    return(
        <div>
            <h3>Master Management</h3>

                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li className="nav-item">
                        <a className="nav-link" aria-current="page" onClick={()=>{setActiveTab("department")}}>Department</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" onClick={()=>{setActiveTab("designation")}} >Designations</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" onClick={()=>{setActiveTab("branches")}}>Branches</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" onClick={()=>{setActiveTab("shifts")}}>Shifts</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" onClick={()=>{setActiveTab("roles")}}>Roles</a>
                        </li>
                    </ul>
                    </div>
                </div>
                </nav>

                {activeTab==="department" && <Department/>}
                {activeTab=== "designation" && <Designation/>}
                {activeTab=== "branches" && <Branches/>}
                {activeTab=== "shifts" && <Shifts/>}
                {activeTab=== "roles" && <Roles/>}
        </div>
    )
}

export default MasterManagement;