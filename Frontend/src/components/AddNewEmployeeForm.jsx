import axios from "axios";
import React, { useEffect, useState } from "react";


function AddNewEmployeeForm() {
    const [showDepartments, setShowDepartments]= useState([]);
    const [showBranchs, setShowBranchs]= useState([]);
    const [showShifts, setShowShifts]= useState([]);
    const [showRoles, setShowRoles]= useState([]);


    const fetchDepartments= async()=>{
            const response= await axios.get(`http://localhost:8081/fetch-departments`);

            setShowDepartments(response.data.result)
        }

    const fetchBranchs= async()=>{
        const response = await axios.get(`http://localhost:8081/fetch-branches`);

        setShowBranchs(response.data.result)
    }
    const fetchShifts= async()=>{
        const response= await axios.get(`http://localhost:8081/fetch-shifts`);

        setShowShifts(response.data.result);
    }

    const fetchRoles= async()=>{
        const response= await axios.get(`http://localhost:8081/fetch-roles`);

        setShowRoles(response.data.result);
    }
    useEffect(()=>{
        
        fetchDepartments();
        fetchBranchs();
        fetchShifts();
        fetchRoles();
    },[])

    return (

        <div className="container mt-4">

            {/* Header */}
            <div className="mb-4">
                <h2>Add New Employee</h2>
                <p>Enter employee details</p>
            </div>



            {/* Basic Information */}
            <div className="card p-4 mb-4">

                <h4 className="mb-4">
                    Basic Information
                </h4>

                <div className="row">

                    <div className="col-md-6 mb-3">
                        <label>Employee Code</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Employee Code"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Employee Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Employee Name"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Gender</label>

                        <select className="form-control">
                            <option>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Mobile Number</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Mobile Number"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Email ID</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Joining Date</label>
                        <input
                            type="date"
                            className="form-control"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>City</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter City"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Emergency Contact Number</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Emergency Contact"
                        />
                    </div>

                </div>

            </div>




            {/* Organization Details */}
            <div className="card p-4 mb-4">

                <h4 className="mb-4">
                    Organization Details
                </h4>

                <div className="row">

                    <div className="col-md-6 mb-3">
                        <label>Department</label>

                        <select onClick={fetchDepartments} className="form-control">
                            <option>Select Department</option>
                            {
                                showDepartments.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>
                                            {item.department_name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Designation</label>
                        <input className="form-control" type="text" />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Branch</label>

                        <select onClick={fetchBranchs} className="form-control">
                            <option>Select Branch</option>
                            {
                                showBranchs.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>
                                            {item.branch_name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Shift</label>

                        <select onClick={fetchShifts} className="form-control">
                            <option>Select Shift</option>
                            {
                                showShifts.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.shift_name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Role</label>
                        <select onClick={fetchRoles} className="form-control">
                            <option>Select Role</option>
                            {
                                showRoles.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.role_name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Reporting Manager</label>
                        <input type="text" className="form-control" />

                        {/* <select className="form-control">
                            <option>Select Reporting Manager</option>
                        </select> */}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Employment Status</label>

                        <select className="form-control">
                            <option>ACTIVE</option>
                            <option>RESIGNED</option>
                        </select>
                    </div>

                </div>

            </div>




            {/* Identity Details */}
            <div className="card p-4 mb-4">

                <h4 className="mb-4">
                    Identity Details
                </h4>

                <div className="row">

                    <div className="col-md-6 mb-3">
                        <label>Aadhar Number</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Aadhar Number"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>UAN Number</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter UAN Number"
                        />
                    </div>

                </div>

            </div>




            {/* Bank Details */}
            <div className="card p-4 mb-4">

                <h4 className="mb-4">
                    Bank Details
                </h4>

                <div className="row">

                    <div className="col-md-6 mb-3">
                        <label>Bank Account Number</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Account Number"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Bank Name</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Bank Name"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>IFSC Code</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter IFSC Code"
                        />
                    </div>

                </div>

            </div>




            {/* Buttons */}
            <div className="mb-5">
                <button className="btn btn-primary">
                    Save Employee
                </button>

            </div>

        </div>
    );
}

export default AddNewEmployeeForm;