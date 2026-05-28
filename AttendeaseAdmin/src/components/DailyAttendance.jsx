import React from "react";
import "./css/AttendanceDashboard.css"
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const api_URL= import.meta.env.VITE_API;
function DailyAttendance(){
    const [dailyAttendanceData, setdailyAttendanceData]= useState([]);

    useEffect(()=>{
        fetchDailyAttendance()
    },[]);

    const fetchDailyAttendance= async()=>{
        const response = await axios.get(`${api_URL}/fetchAttendance`);
        setdailyAttendanceData(response.data.result || [])
        
    }
    return(
        <div>
            <h5>Attendance Dashboard</h5>
            <div className="mt-5" style={{display: "flex", justifyContent: "space-around"}}>
                <div id="attendance-dashboard"></div>
                <div id="attendance-dashboard"></div>
                <div id="attendance-dashboard"></div>
                <div id="attendance-dashboard"></div>
                <div id="attendance-dashboard"></div>
            </div>

        <div className="mt-5 mb-5" style={{display: "flex", justifyContent: "center"}}>
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

            {
                dailyAttendanceData.map((item)=>{
                    return(
                          
            <tr key={item.id}>

                {/* Employee */}
                <td>
                    <div className="employee-cell">

                        <img
                            src=""
                            alt=""
                            className="employee-image"
                        />

                        <div>
                            <h6>{item.employee_name}</h6>
                            <p>{item.employee_designation_name}</p>
                        </div>

                    </div>
                </td>

                {/* Employee Code */}
                <td>
                    {item.employee_code}
                </td>

                {/* Department */}
                <td>
                    {item.department_name}
                </td>

                {/* Punch In */}
                <td>
                    <span className="punch-in">
                        {item.punch_in}
                    </span>
                </td>

                {/* Punch Out */}
                <td>
                    {item.punch_out}
                </td>

                {/* Working Hours / Late */}
                <td>

                    <div>
                        <h6>{item.late_minutes}</h6>
                        <p className="on-time">
                            On Time
                        </p>
                    </div>

                </td>

                {/* Status */}
                <td>

                    <span className="status present">
                        {item.status}
                    </span>

                </td>

                {/* Mode */}
                <td>

                    <span className="mode office">
                        {item.attendance_mode}
                    </span>

                </td>

                {/* Location */}
                <td>
                  {item.gps_location || "N/A"}
                </td>

                {/* Actions */}
                <td>

                    <button className="correct-btn">
                        ACTION
                    </button>

                </td>

            </tr>
                    )
                })
                
            }

        </tbody>

    </table>

</div>

        </div>
    )
}

export default DailyAttendance;