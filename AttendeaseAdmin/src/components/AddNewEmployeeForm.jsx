/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/Employees.css";
const apiUrl= import.meta.env.VITE_API;

function AddNewEmployeeForm({
  setshowModal,
  selectedEmployee,
  setEditingEmployee,
  fetchEmployees,
}) {
  const [showDepartments, setShowDepartments] = useState([]);
  const [showBranchs, setShowBranchs] = useState([]);
  const [showShifts, setShowShifts] = useState([]);
  const [showRoles, setShowRoles] = useState([]);
  const [showDesignation, setShowDesignation] = useState([]);
  const [reportingManagers, setReportingManagers] = useState([]);
  const employeeForm = {
    employee_name: "",
    employee_code: "",
    gender: "",
    designation_id: "",
    department_id: "",
    branch_id: "",
    shift_id: "",
    role_id: "",
    reporting_manager_id: "",
    employeement_status: "ACTIVE",
    employee_mobile_no: "",
    employee_email_id: "",
    employee_joining_date: "",
    city: "",
    emergency_contact_no: "",
    employee_adhar_no: "",
    employee_bank_account_no: "",
    employee_bank_name: "",
    employee_bank_ifsc_code: "",
    employee_uan_no: "",
  };
  const [addEmployeeForm, setAddEmployeeForm] = useState(employeeForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleChange = (event) => {
    setAddEmployeeForm({
      ...addEmployeeForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = () => {
    setshowModal(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(addEmployeeForm).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      if (selectedEmployee) {
        await axios.put(
          `${apiUrl}/updateEmployee/${selectedEmployee.id}`,
          formData,
        );
      } else {
        await axios.post(`${apiUrl}/addNewEmployee`, formData);
      }

      fetchEmployees();
      setshowModal(false);
      setEditingEmployee(null);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchDepartments = async () => {
    const response = await axios.get(
      `${apiUrl}/fetch-departments?status=Active`,
    );

    setShowDepartments(response.data.result);
  };

  const departmentsForDropdown =
    selectedEmployee &&
    selectedEmployee.department_id &&
    !showDepartments.some((item) => item.id === selectedEmployee.department_id)
      ? [
          ...showDepartments,
          {
            id: selectedEmployee.department_id,
            department_name: selectedEmployee.department_name,
          },
        ]
      : showDepartments;

  const fetchBranchs = async () => {
    const response = await axios.get(`${apiUrl}/fetch-branches`);

    setShowBranchs(response.data.result);
  };
  const fetchShifts = async () => {
    const response = await axios.get(`${apiUrl}/fetch-shifts`);

    setShowShifts(response.data.result);
  };

  const fetchRoles = async () => {
    const response = await axios.get(`${apiUrl}/fetch-roles`);

    setShowRoles(response.data.result);
  };

  const fetchDesignation = async () => {
    const response = await axios.get(`${apiUrl}/designationStatus`);

    setShowDesignation(response.data.result);
  };

  const designationsForDropdown =
    selectedEmployee &&
    selectedEmployee.designation_id &&
    !showDesignation.some((item) => item.id === selectedEmployee.designation_id)
      ? [
          ...showDesignation,
          {
            id: selectedEmployee.designation_id,
            designation_name: selectedEmployee.designation_name,
          },
        ]
      : showDesignation;

  const fetchReportingManagers = async () => {
    const response = await axios.get(`${apiUrl}/activeEmployee`);
    setReportingManagers(response.data.result);
  };

  useEffect(() => {
    fetchDepartments();
    fetchBranchs();
    fetchShifts();
    fetchRoles();
    fetchDesignation();
    fetchReportingManagers();
    if (selectedEmployee) {
      setAddEmployeeForm({
        employee_name: selectedEmployee.employee_name || "",
        employee_code: selectedEmployee.employee_code || "",
        gender: selectedEmployee.gender || "",
        designation_id: selectedEmployee.designation_id || "",
        department_id: selectedEmployee.department_id || "",
        branch_id: selectedEmployee.branch_id || "",
        shift_id: selectedEmployee.shift_id || "",
        role_id: selectedEmployee.role_id || "",
        reporting_manager_id: selectedEmployee.reporting_manager_id || "",
        employeement_status: selectedEmployee.employeement_status || "ACTIVE",
        employee_mobile_no: selectedEmployee.employee_mobile_no || "",
        employee_email_id: selectedEmployee.employee_email_id || "",
        employee_joining_date: selectedEmployee.employee_joining_date
          ? selectedEmployee.employee_joining_date.slice(0, 10)
          : "",
        city: selectedEmployee.city || "",
        emergency_contact_no: selectedEmployee.emergency_contact_no || "",
        employee_adhar_no: selectedEmployee.employee_adhar_no || "",
        employee_bank_account_no:
          selectedEmployee.employee_bank_account_no || "",
        employee_bank_name: selectedEmployee.employee_bank_name || "",
        employee_bank_ifsc_code: selectedEmployee.employee_bank_ifsc_code || "",
        employee_uan_no: selectedEmployee.employee_uan_no || "",
        photo_url: selectedEmployee.photo_url || "",
      });
    }
  }, [selectedEmployee]);

  return (
    <form className="employee-entry-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="modal-close-btn"
        aria-label="Close employee form"
        onClick={handleClose}
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="employee-form-header">
        <div className="summary-icon summary-icon-primary">
          <span className="material-symbols-outlined">badge</span>
        </div>
        <div>
          <h2>{selectedEmployee ? "Edit Employee" : "Add New Employee"}</h2>
          <p>Capture profile, organization, identity, and payroll details.</p>
        </div>
      </div>

      <section className="employee-form-section">
        <div className="employee-section-heading">
          <span className="material-symbols-outlined">person</span>
          <div>
            <h3>Basic Information</h3>
            <p>Primary employee identity and contact details.</p>
          </div>
        </div>

        <div className="employee-form-grid">
          <label>
            <span>Employee Code</span>
            <input
              type="text"
              placeholder="Enter Employee Code"
              name="employee_code"
              value={addEmployeeForm.employee_code}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Employee Name</span>
            <input
              type="text"
              placeholder="Enter Employee Name"
              name="employee_name"
              value={addEmployeeForm.employee_name}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Gender</span>
            <select
              onChange={handleChange}
              name="gender"
              value={addEmployeeForm.gender}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label>
            <span>Mobile Number</span>
            <input
              name="employee_mobile_no"
              type="text"
              placeholder="Enter Mobile Number"
              value={addEmployeeForm.employee_mobile_no}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Email ID</span>
            <input
              name="employee_email_id"
              type="email"
              placeholder="Enter Email"
              value={addEmployeeForm.employee_email_id}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Joining Date</span>
            <input
              name="employee_joining_date"
              type="date"
              value={addEmployeeForm.employee_joining_date}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>City</span>
            <input
              name="city"
              type="text"
              placeholder="Enter City"
              value={addEmployeeForm.city}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Emergency Contact Number</span>
            <input
              name="emergency_contact_no"
              type="text"
              placeholder="Emergency Contact"
              value={addEmployeeForm.emergency_contact_no}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Employee Photo (limit 5MB)</span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
          {(photoPreview || addEmployeeForm.photo_url) && (
            <img
              className="employee-photo-preview"
              src={
                photoPreview ||
                (addEmployeeForm.photo_url?.startsWith("http")
                  ? addEmployeeForm.photo_url
                  : `${apiUrl}${addEmployeeForm.photo_url}`)
              }
              alt="Employee preview"
            />
          )}
        </div>
      </section>

      <section className="employee-form-section">
        <div className="employee-section-heading">
          <span className="material-symbols-outlined">account_tree</span>
          <div>
            <h3>Organization Details</h3>
            <p>Map this employee to teams, access, and reporting lines.</p>
          </div>
        </div>

        <div className="employee-form-grid">
          <label>
            <span>Department</span>
            <select
              onChange={handleChange}
              name="department_id"
              onClick={fetchDepartments}
              value={addEmployeeForm.department_id}
            >
              <option value="">Select Department</option>
              {departmentsForDropdown.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.department_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Designation</span>
            <select
              onChange={handleChange}
              onClick={fetchDesignation}
              name="designation_id"
              value={addEmployeeForm.designation_id}
            >
              <option value="">Select Designation</option>
              {designationsForDropdown.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.designation_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Branch</span>
            <select
              onChange={handleChange}
              name="branch_id"
              onClick={fetchBranchs}
              value={addEmployeeForm.branch_id}
            >
              <option value="">Select Branch</option>
              {showBranchs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.branch_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Shift</span>
            <select
              onChange={handleChange}
              name="shift_id"
              onClick={fetchShifts}
              value={addEmployeeForm.shift_id}
            >
              <option value="">Select Shift</option>
              {showShifts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.shift_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Role</span>
            <select
              onChange={handleChange}
              name="role_id"
              onClick={fetchRoles}
              value={addEmployeeForm.role_id}
            >
              <option value="">Select Role</option>
              {showRoles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.role_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Reporting Manager</span>
            <select
              onChange={handleChange}
              name="reporting_manager_id"
              value={addEmployeeForm.reporting_manager_id}
            >
              <option value="">Select Reporting Manager</option>
              {reportingManagers
                .filter((item) => item.id !== selectedEmployee?.id)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.employee_code} - {item.employee_name}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </section>

      <section className="employee-form-section">
        <div className="employee-section-heading">
          <span className="material-symbols-outlined">id_card</span>
          <div>
            <h3>Identity Details</h3>
            <p>Statutory identifiers used for employee records.</p>
          </div>
        </div>

        <div className="employee-form-grid">
          <label>
            <span>Aadhar Number</span>
            <input
              name="employee_adhar_no"
              type="text"
              placeholder="Enter Aadhar Number"
              value={addEmployeeForm.employee_adhar_no}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>UAN Number</span>
            <input
              name="employee_uan_no"
              type="text"
              placeholder="Enter UAN Number"
              value={addEmployeeForm.employee_uan_no}
              onChange={handleChange}
            />
          </label>
        </div>
      </section>

      <section className="employee-form-section">
        <div className="employee-section-heading">
          <span className="material-symbols-outlined">account_balance</span>
          <div>
            <h3>Bank Details</h3>
            <p>Payroll account information for salary processing.</p>
          </div>
        </div>

        <div className="employee-form-grid">
          <label>
            <span>Bank Account Number</span>
            <input
              name="employee_bank_account_no"
              type="text"
              placeholder="Enter Account Number"
              value={addEmployeeForm.employee_bank_account_no}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Bank Name</span>
            <input
              name="employee_bank_name"
              type="text"
              placeholder="Enter Bank Name"
              value={addEmployeeForm.employee_bank_name}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>IFSC Code</span>
            <input
              name="employee_bank_ifsc_code"
              type="text"
              placeholder="Enter IFSC Code"
              value={addEmployeeForm.employee_bank_ifsc_code}
              onChange={handleChange}
            />
          </label>
        </div>
      </section>

      <div className="employee-form-actions">
        <button type="submit" className="save-btn">
          {selectedEmployee ? "Update Employee" : "Save Employee"}
        </button>
      </div>
    </form>
  );
}

export default AddNewEmployeeForm;
