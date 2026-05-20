import React from "react";
import { useState } from "react";
import AddNewEmployeeForm from "./AddNewEmployeeForm";
import "./css/Employees.css";
import axios from "axios";
import { useEffect } from "react";

function EmployeeMaster() {
  const [showModal, setshowModal] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // removed the redundent totalPages state
  const itemsPerPage = 3;

  const fetchEmployees = async () => {
    const response = await axios.get(
      `http://localhost:8081/fetch-employees?page=${currentPage}&limit=${itemsPerPage}`,
    );
    console.log(response.data.result);
    setAllEmployees(response.data.result);
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const totalPages = Math.ceil(allEmployees.length / itemsPerPage); // moved this inside the component and removed the state as it can be calculated directly from allEmployees length and itemsPerPage

  const startIndex = (currentPage - 1) * itemsPerPage; // calculating the start index for pagination based on current page and items per page page 1 => startIndex = 0, page 2 => startIndex = 3, page 3 => startIndex = 6 and so on

  const endIndex = startIndex + itemsPerPage; // calculating the end index for pagination which is start index + items per page page 1 => endIndex = 3, page 2 => endIndex = 6, page 3 => endIndex = 9 and so on

  const paginationEmployee = allEmployees.slice(startIndex, endIndex); // slicing the allEmployees array to get only the employees for the current page based on start index and end index

  const showingForm = allEmployees.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, allEmployees.length);

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
            <h2>0</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Active</h6>
            <h2>1,240</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Onboarding</h6>
            <h2>24</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Terminated</h6>
            <h2>20</h2>
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
            <select className="form-select">
              <option>All Status</option>
            </select>
          </div>

          <div className="col-md-2 mb-2">
            <button
              onClick={() => {
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
              {paginationEmployee.map((item) => {
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
                      <button className="btn btn-sm btn-outline-primary me-2">
                        View
                      </button>

                      <button className="btn btn-sm btn-outline-warning me-2">
                        Edit
                      </button>

                      <button className="btn btn-sm btn-outline-danger">
                        Delete
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
              <AddNewEmployeeForm setshowModal={setshowModal} />

              <button
                className="btn btn-secondary me-3"
                onClick={() => {
                  setshowModal(false);
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
            Showing {showingForm} to {showingTo} of {allEmployees.length}{" "}
            designations
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
