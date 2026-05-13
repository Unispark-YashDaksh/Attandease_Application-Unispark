import React from "react";
import "./css/Employees.css"

function Employees(){
    return(
        <div>
            <div style={{height: "110px", width: "100%", backgroundColor: "#043B5C"}}>
                <h3 style={{color: "white", padding: "30px"}}>
                    Employees Managment
                </h3>
            </div>
            
            <div style={{display: "block", margin: "30px"}}>
                <div className="all-employees-div" style={{height: "400px", width: "800px"}}>
                    <h5>All Employees</h5>

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Employee Code</th>
                                <th scope="col">Employee Name</th>
                                <th scope="col">Designation</th>
                                <th scope="col">Department</th>
                                <th scope="col">Status</th>
                                <th scope="col">Today</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                
                            }
                            <tr>
                                <th scope="row">1</th>
                                <td>UNI1534</td>
                                <td>Yash Kumar Daksh</td>
                                <td>Executive-Product Engineering & Automation</td>
                                <td>R&D</td>
                                <td>Active</td>
                                <td>Present-10:04 AM</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{height: "400px", width: "800px", border: "1px solid black"}}>

                </div>
            </div>
        </div>
    )
}

export default Employees;