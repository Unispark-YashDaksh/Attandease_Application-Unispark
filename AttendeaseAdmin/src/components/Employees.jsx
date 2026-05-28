/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { useState } from "react";
import AddNewEmployeeForm from "./AddNewEmployeeForm";
import "./css/Employees.css";
import axios from "axios";
import { useEffect } from "react";

function EmployeeMaster() {
  const [showModal, setshowModal] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0); // added state to store total employees count
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  // removed the redundent totalPages state
  const itemsPerPage = 3;

  const fetchEmployees = async () => {
    const response = await axios.get(
      `http://localhost:8081/fetch-employees?page=${currentPage}&limit=${itemsPerPage}&status=${statusFilter}`,
    );
    console.log(response.data.result);
    setAllEmployees(response.data.result);
    console.log(response.data.totalEmployees);
    setTotalEmployees(response.data.totalEmployees);
    console.log(response.data.activeEmployees);
    setActiveEmployees(response.data.activeEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, statusFilter]);

  const openView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewModal(true);
  };

  const handleUpdateEmployeeStatus = async (employee) => {
    const nextStatus =
      employee.employeement_status === "ACTIVE" ? "RESIGNED" : "ACTIVE";

    try {
      await axios.put(
        `http://localhost:8081/updateEmployeeStatus/${employee.id}`,
        {
          status: nextStatus,
        },
      );

      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(totalEmployees / itemsPerPage); // moved this inside the component and removed the state as it can be calculated directly from allEmployees length and itemsPerPage

  const startIndex = (currentPage - 1) * itemsPerPage; // calculating the start index for pagination based on current page and items per page page 1 => startIndex = 0, page 2 => startIndex = 3, page 3 => startIndex = 6 and so on

  const endIndex = startIndex + itemsPerPage; // calculating the end index for pagination which is start index + items per page page 1 => endIndex = 3, page 2 => endIndex = 6, page 3 => endIndex = 9 and so on

  const showingForm = totalEmployees ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, totalEmployees);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Heading */}
      <div className="mb-4">
        <h2 className="fw-bold">Employee Master</h2>
        <p className="text-muted">Manage all employees</p>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Total Employees</h6>
            <h2>{totalEmployees}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Active</h6>
            <h2>{activeEmployees}</h2>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card shadow-sm border-0 p-3 mb-4">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Quick Search..."
            />
          </div>

          <div className="col-md-2 mb-2">
            <select className="form-select">
              <option>All Departments</option>
            </select>
          </div>

          <div className="col-md-2 mb-2">
            <select className="form-select">
              <option>All Branches</option>
            </select>
          </div>

          <div className="col-md-2 mb-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ACTIVE">Active Employees</option>
              <option value="RESIGNED">Inactive Employees</option>
              <option value="All">All Employees</option>
            </select>
          </div>

          <div className="col-md-2 mb-2">
            <button
              onClick={() => {
                setEditingEmployee(null);
                setshowModal(true);
              }}
              className="btn btn-primary w-100"
            >
              + Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Photo</th>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Branch Name</th>
                <th>Reporting Manager</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {allEmployees.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <img
                        src="https://i.pravatar.cc/40?img=1"
                        alt=""
                        className="rounded-circle"
                      />
                    </td>

                    <td className="fw-bold text-primary">
                      {item.employee_code}
                    </td>

                    <td>
                      <div>
                        <h6 className="mb-0">{item.employee_name}</h6>

                        <small className="text-muted"></small>
                      </div>
                    </td>

                    <td>{item.department_name}</td>

                    <td>{item.designation_name}</td>

                    <td>{item.branch_name}</td>

                    <td></td>

                    <td>
                      <span className="badge bg-success">
                        {item.employeement_status}
                      </span>
                    </td>

                    <td>{item.employee_joining_date}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openView(item)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => {
                          setEditingEmployee(item);
                          setshowModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className={
                          item.employeement_status === "ACTIVE"
                            ? "btn btn-sm btn-outline-danger"
                            : "btn btn-sm btn-outline-success"
                        }
                        onClick={() => handleUpdateEmployeeStatus(item)}
                      >
                        {item.employeement_status === "ACTIVE"
                          ? "Resign"
                          : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showModal === true && (
          <div className="modal-overlay">
            <div className="modal-container">
              <AddNewEmployeeForm
                setshowModal={setshowModal}
                selectedEmployee={editingEmployee}
                setEditingEmployee={setEditingEmployee}
                fetchEmployees={fetchEmployees}
              />

              <button
                className="btn btn-secondary me-3"
                onClick={() => {
                  setshowModal(false);
                  setEditingEmployee(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {openViewModal && selectedEmployee && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h3>Employee Details</h3>

              <p>
                <strong>Code:</strong> {selectedEmployee.employee_code}
              </p>
              <p>
                <strong>Name:</strong> {selectedEmployee.employee_name}
              </p>
              <p>
                <strong>Department:</strong> {selectedEmployee.department_name}
              </p>
              <p>
                <strong>Designation:</strong>{" "}
                {selectedEmployee.designation_name}
              </p>
              <p>
                <strong>Branch:</strong> {selectedEmployee.branch_name}
              </p>
              <p>
                <strong>Status:</strong> {selectedEmployee.employeement_status}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.employee_email_id}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedEmployee.employee_mobile_no}
              </p>
              <p>
                <strong>Joining Date:</strong>{" "}
                {selectedEmployee.employee_joining_date}
              </p>
              <p>
                <strong>City:</strong> {selectedEmployee.city}
              </p>
              <p>
                <strong>Aadhar:</strong> {selectedEmployee.employee_adhar_no}
              </p>
              <p>
                <strong>Bank:</strong> {selectedEmployee.employee_bank_name}
              </p>
              <p>
                <strong>Account:</strong>{" "}
                {selectedEmployee.employee_bank_account_no}
              </p>
              <p>
                <strong>IFSC:</strong>{" "}
                {selectedEmployee.employee_bank_ifsc_code}
              </p>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setOpenViewModal(false);
                  setSelectedEmployee(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <p className="mb-0">
            Showing {showingForm} to {showingTo} of {totalEmployees}{" "}
            employees
          </p>

          <div>
            <button
              className="btn btn-light me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Prev
            </button>

            <button type="button" className="pagination-active">
              {currentPage}
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeMaster;
