import axios from "axios";
import React, { useEffect, useState } from "react";


function AddNewEmployeeForm({setshowModal}) {
    const [showDepartments, setShowDepartments]= useState([]);
    const [showBranchs, setShowBranchs]= useState([]);
    const [showShifts, setShowShifts]= useState([]);
    const [showRoles, setShowRoles]= useState([]);
    const [showDesignation, setShowDesignation]= useState([]);
    const employeeForm={
        employee_name: "",
        employee_code: "",
        gender: "",
        designation_id: "",
        department_id: "",
        branch_id: "",
        shift_id:"",
        role_id:"",
        reporting_manager_id:"",
        employeement_status:"",
        employee_mobile_no:"",
        employee_email_id:"",
        employee_joining_date:"",
        city: "",
        emergency_contact_no: "",
        employee_adhar_no: "",
        employee_bank_account_no: "",
        employee_bank_name: "",
        employee_bank_ifsc_code:"",
        employee_uan_no: ""
    }
const [addEmployeeForm, setAddEmployeeForm]= useState(employeeForm);

const handleChange= (event)=>{
    setAddEmployeeForm({
        ...addEmployeeForm,
        [event.target.name]: event.target.value
    })
}

const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
        console.log(addEmployeeForm)
        await axios.post(`http://localhost:8081/addNewEmployee`,{
          addEmployeeForm
        })
        setshowModal(false)
    }catch(err){
        console.log(err);
    }
}


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

    const fetchDesignation= async()=>{
        const response= await axios.get(`http://localhost:8081/fetch-designation`);

        setShowDesignation(response.data.result);
        
    }
    useEffect(()=>{
        
        fetchDepartments();
        fetchBranchs();
        fetchShifts();
        fetchRoles();
        fetchDesignation();
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
                            name="employee_code"
                            value={addEmployeeForm.employee_code}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Employee Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Employee Name"
                            name="employee_name"
                            value={addEmployeeForm.employee_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Gender</label>

                        <select onChange={handleChange} name="gender" className="form-control" value={addEmployeeForm.gender}>
                            <option value= "">Select Gender</option>
                            <option value= "Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Mobile Number</label>
                        <input name="employee_mobile_no"
                            type="text"
                            className="form-control"
                            placeholder="Enter Mobile Number"
                            value={addEmployeeForm.employee_mobile_no}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Email ID</label>
                        <input name="employee_email_id"
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            value={addEmployeeForm.employee_email_id}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Joining Date</label>
                        <input name="employee_joining_date"
                            type="date"
                            className="form-control"
                            value={addEmployeeForm.employee_joining_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>City</label>
                        <input name="city"
                            type="text"
                            className="form-control"
                            placeholder="Enter City"
                            value={addEmployeeForm.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Emergency Contact Number</label>
                        <input name="emergency_contact_no"
                            type="text"
                            className="form-control"
                            placeholder="Emergency Contact"
                            value={addEmployeeForm.emergency_contact_no}
                            onChange={handleChange}
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

                        <select onChange={handleChange} name="department_id" onClick={fetchDepartments} className="form-control" value={addEmployeeForm.department_id}>
                            <option value= "">Select Department</option>
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
                       <select onChange={handleChange} className="form-control" onClick={fetchDesignation} name="designation_id" id="" value={addEmployeeForm.designation_id}>
                        <option value="">Select Designation</option>
                        {
                            showDesignation.map((item)=>{
                                return(
                                    <option key={item.id} value={item.id}>{item.designation_name}</option>
                                )
                            })
                        }
                       </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Branch</label>

                        <select onChange={handleChange} name="branch_id" onClick={fetchBranchs} className="form-control" value={addEmployeeForm.branch_id}>
                            <option value= "">Select Branch</option>
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

                        <select onChange={handleChange} name="shift_id" onClick={fetchShifts} className="form-control" value={addEmployeeForm.shift_id}>
                            <option value= "">Select Shift</option>
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
                        <select onChange={handleChange} name="role_id" onClick={fetchRoles} className="form-control" value={addEmployeeForm.role_id}>
                            <option value= "">Select Role</option>
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
                        <select onChange={handleChange} className="form-control" name="reporting_manager_id" value={addEmployeeForm.reporting_manager_id}>
                            <option value= "">Select Reporting Manager</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Employment Status</label>

                        <select onChange={handleChange} name="employeement_status" className="form-control" value={addEmployeeForm.employeement_status}>
                            <option value= "ACTIVE">ACTIVE</option>
                            <option  value= "RESIGNED">RESIGNED</option>
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

                        <input name="employee_adhar_no"
                            type="text"
                            className="form-control"
                            placeholder="Enter Aadhar Number"
                            value={addEmployeeForm.employee_adhar_no}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>UAN Number</label>

                        <input name="employee_uan_no"
                            type="text"
                            className="form-control"
                            placeholder="Enter UAN Number"
                            value={addEmployeeForm.employee_uan_no}
                            onChange={handleChange}
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

                        <input name="employee_bank_account_no"
                            type="text"
                            className="form-control"
                            placeholder="Enter Account Number"
                            value={addEmployeeForm.employee_bank_account_no}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Bank Name</label>

                        <input name="employee_bank_name"
                            type="text"
                            className="form-control"
                            placeholder="Enter Bank Name"
                            value={addEmployeeForm.employee_bank_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>IFSC Code</label>

                        <input name="employee_bank_ifsc_code"
                            type="text"
                            className="form-control"
                            placeholder="Enter IFSC Code"
                            value={addEmployeeForm.employee_bank_ifsc_code}
                            onChange={handleChange}
                        />
                    </div>

                </div>

            </div>




            {/* Buttons */}
            <div className="mb-5">
                <button type="button" onClick={handleSubmit}  className="btn btn-primary">
                    Save Employee
                </button>

            </div>

        </div>
    );
}

export default AddNewEmployeeForm;