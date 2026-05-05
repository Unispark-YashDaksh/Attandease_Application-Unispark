import React from "react";
import "./css/SideBar.css"

function SideBar(){
    return(
        <div style={{color: "wheat"}}>
            <div style={{backgroundColor: "#043B5C", height: "50rem", width: "15rem", border: "1px solid black", borderRadius: "5px"}}>
                <div style={{marginLeft: "1rem"}}>
                    <h1 className="mt-2">AttendEase</h1>
                    <p>Workforce Management</p>
                </div>
               <div>
                <ul>
                 <li className="SideBarList">
                    <a href="dashbord">Dashboard</a>
                </li>
                <li className="SideBarList">
                    <a href="/">Punch In/Out</a>
                </li>
                <li className="SideBarList">
                    <a href="LeaveManag">Leave Management</a>
                </li>
                <li className="SideBarList">
                    <a href="holidays">Holidays</a>
                </li>
                <li className="SideBarList">
                    <a href="/">Reports</a>
                </li>
                <li className="SideBarList">
                    <a href="/">Employees</a>
                </li>
                <li className="SideBarList">
                    <a href="/">Settings</a>
                </li>
                </ul>
               </div>
            </div>
        </div>
    )
}


export default SideBar;