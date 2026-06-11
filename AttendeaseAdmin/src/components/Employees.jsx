import React, { useEffect, useState } from "react";
import AddNewEmployeeForm from "./AddNewEmployeeForm";
import axios from "axios";
import "../css/designation.css";
import "../css/Employees.css";

function EmployeeMaster() {
  const [showModal, setshowModal] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const itemsPerPage = 10;

  const getEmployees = async (page, status) => {
    const response = await axios.get(
      `http://localhost:7000/fetch-employees?page=${page}&limit=${itemsPerPage}&status=${status}`,
    );

    return {
      employees: Array.isArray(response.data.result)
        ? response.data.result
        : [],
      total: response.data.totalEmployees || 0,
      active: response.data.activeEmployees || 0,
    };
  };

  const fetchEmployees = async () => {
    try {
      const employeeData = await getEmployees(currentPage, statusFilter);

      setAllEmployees(employeeData.employees);
      setTotalEmployees(employeeData.total);
      setActiveEmployees(employeeData.active);
    } catch (error) {
      console.error(error);
      setAllEmployees([]);
      setTotalEmployees(0);
      setActiveEmployees(0);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadEmployees() {
      try {
        const employeeData = await getEmployees(currentPage, statusFilter);

        if (!ignore) {
          setAllEmployees(employeeData.employees);
          setTotalEmployees(employeeData.total);
          setActiveEmployees(employeeData.active);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setAllEmployees([]);
          setTotalEmployees(0);
          setActiveEmployees(0);
        }
      }
    }

    loadEmployees();

    return () => {
      ignore = true;
    };
  }, [currentPage, statusFilter]);

  const openView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewModal(true);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setshowModal(true);
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setSelectedEmployee(null);
  };

  const handleUpdateEmployeeStatus = async (employee) => {
    const nextStatus =
      employee.employeement_status === "ACTIVE" ? "RESIGNED" : "ACTIVE";

    try {
      await axios.put(
        `http://localhost:7000/updateEmployeeStatus/${employee.id}`,
        {
          status: nextStatus,
        },
      );

      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const departmentOptions = [
    ...new Set(
      allEmployees.map((employee) => employee.department_name).filter(Boolean),
    ),
  ];
  const branchOptions = [
    ...new Set(
      allEmployees.map((employee) => employee.branch_name).filter(Boolean),
    ),
  ];
  const filteredEmployees = allEmployees.filter((employee) => {
    const searchableValue = [
      employee.employee_code,
      employee.employee_name,
      employee.employee_email_id,
      employee.employee_mobile_no,
      employee.department_name,
      employee.designation_name,
      employee.branch_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchTerm && !searchableValue.includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (departmentFilter && employee.department_name !== departmentFilter) {
      return false;
    }

    if (branchFilter && employee.branch_name !== branchFilter) {
      return false;
    }

    return true;
  });
  const resignedEmployees = Math.max(totalEmployees - activeEmployees, 0);
  const activePercent = totalEmployees
    ? Math.round((activeEmployees / totalEmployees) * 100)
    : 0;
  const latestJoiningDate = allEmployees
    .map((employee) => employee.employee_joining_date)
    .filter(Boolean)
    .sort()
    .at(-1);
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const showingFrom = totalEmployees ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, totalEmployees);

  return (
    <div className="designation-page">
      <main className="designation-main">
        <div className="designation-header">
          <div>
            <h2 className="designation-title">Employee Master</h2>
            <p className="designation-subtitle">
              Manage employee records, assignments, and employment status.
            </p>
          </div>

          <button
            type="button"
            className="designation-add-btn"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined">person_add</span>
            Add Employee
          </button>
        </div>

        <section className="designation-summary-grid">
          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-primary">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <span className="summary-label">Total Employees</span>
            </div>
            <p className="summary-value">{totalEmployees}</p>
            <div className="summary-note summary-note-success">
              <span className="material-symbols-outlined">trending_up</span>
              <span>Live from database</span>
            </div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-secondary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <span className="summary-label">Active</span>
            </div>
            <p className="summary-value">{activeEmployees}</p>
            <div className="summary-note">Currently employed</div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-tertiary">
                <span className="material-symbols-outlined">person_off</span>
              </div>
              <span className="summary-label">Resigned</span>
            </div>
            <p className="summary-value">{resignedEmployees}</p>
            <div className="summary-note summary-note-primary">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{activePercent}% Active</span>
            </div>
          </article>

          <article className="summary-card summary-card-sync">
            <div className="summary-card-content">
              <div className="summary-card-top">
                <div className="summary-icon summary-icon-dark">
                  <span className="material-symbols-outlined">
                    event_available
                  </span>
                </div>
                <span className="summary-label">Latest Joining</span>
              </div>
              <p className="summary-value summary-value-small">
                {formatDate(latestJoiningDate)}
              </p>
              <div className="summary-note">
                Based on loaded employee records
              </div>
            </div>
            <span className="material-symbols-outlined summary-watermark">
              badge
            </span>
          </article>
        </section>

        <section className="designation-table-card">
          <div className="table-toolbar">
            <div className="table-toolbar-left">
              <h3>Employee Directory</h3>
              <input
                className="designation-filter-select employee-search-input"
                type="search"
                placeholder="Search employees"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="table-toolbar-actions">
              <button type="button" onClick={() => setShowFilter(true)}>
                <span className="material-symbols-outlined">filter_list</span>
                Filter
              </button>

              <button type="button" onClick={fetchEmployees}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="designation-table employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee Code</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Joining Date</th>
                  <th className="actions-heading">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      No employees match your filter
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((item) => (
                    <tr className="designation-row" key={item.id}>
                      <td>
                        <div className="role-cell">
                          {item.photo_url ? (
                            <>
                              <img
                                className="employee-photo"
                                src={`http://localhost:7000${item.photo_url}`}
                                alt={item.employee_name}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                  event.currentTarget.nextElementSibling.style.display =
                                    "inline-block";
                                }}
                              />
                              <span
                                className="material-symbols-outlined"
                                style={{ display: "none" }}
                              >
                                person
                              </span>
                            </>
                          ) : (
                            <span className="material-symbols-outlined">
                              person
                            </span>
                          )}
                          <div>
                            <span>{item.employee_name}</span>
                            <p className="employee-subtext">
                              {item.employee_email_id || "No email assigned"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{item.employee_code}</td>
                      <td>{item.department_name || "-"}</td>
                      <td>{item.designation_name || "-"}</td>
                      <td>{item.branch_name || "-"}</td>
                      <td>
                        <span
                          className={
                            item.employeement_status === "ACTIVE"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {item.employeement_status}
                        </span>
                      </td>
                      <td>{formatDate(item.employee_joining_date)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            type="button"
                            aria-label={`View ${item.employee_name}`}
                            onClick={() => openView(item)}
                          >
                            <span className="material-symbols-outlined">
                              visibility
                            </span>
                          </button>

                          <button
                            className="edit-btn"
                            type="button"
                            aria-label={`Edit ${item.employee_name}`}
                            onClick={() => {
                              setEditingEmployee(item);
                              setshowModal(true);
                            }}
                          >
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            aria-label={
                              item.employeement_status === "ACTIVE"
                                ? "Mark employee resigned"
                                : "Reactivate employee"
                            }
                            onClick={() => handleUpdateEmployeeStatus(item)}
                          >
                            <span className="material-symbols-outlined">
                              {item.employeement_status === "ACTIVE"
                                ? "block"
                                : "check_circle"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination">
            <p>
              Showing {showingFrom} to {showingTo} of {totalEmployees} employees
            </p>

            <div className="pagination-buttons">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <button type="button" className="pagination-active">
                {safeCurrentPage}
              </button>

              <button
                type="button"
                disabled={safeCurrentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {showFilter && (
          <div className="modal-overlay" role="presentation">
            <div
              className="designation-modal filter-modal"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close employee filters"
                onClick={() => setShowFilter(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h2>Filter Employees</h2>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setShowFilter(false);
                }}
              >
                <div className="form-group">
                  <label htmlFor="employee_department_filter">Department</label>
                  <select
                    id="employee_department_filter"
                    value={departmentFilter}
                    onChange={(event) => {
                      setDepartmentFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Departments</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="employee_branch_filter">Branch</label>
                  <select
                    id="employee_branch_filter"
                    value={branchFilter}
                    onChange={(event) => {
                      setBranchFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Branches</option>
                    {branchOptions.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="employee_status_filter">Status</label>
                  <select
                    id="employee_status_filter"
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="ACTIVE">Active Employees</option>
                    <option value="RESIGNED">Resigned Employees</option>
                    <option value="All">All Employees</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setDepartmentFilter("");
                      setBranchFilter("");
                      setStatusFilter("ACTIVE");
                      setCurrentPage(1);
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" role="presentation">
            <div
              className="designation-modal employee-form-modal"
              role="dialog"
              aria-modal="true"
            >
              <AddNewEmployeeForm
                setshowModal={setshowModal}
                selectedEmployee={editingEmployee}
                setEditingEmployee={setEditingEmployee}
                fetchEmployees={fetchEmployees}
              />
            </div>
          </div>
        )}

        {openViewModal && selectedEmployee && (
          <div className="modal-overlay" role="presentation">
            <div
              className="designation-modal employee-details-modal"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close employee details"
                onClick={closeViewModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2>Employee Details</h2>

              <div className="employee-detail-grid">
                <p>
                  <strong>Code</strong>
                  <span>{selectedEmployee.employee_code || "-"}</span>
                </p>
                <p>
                  <strong>Name</strong>
                  <span>{selectedEmployee.employee_name || "-"}</span>
                </p>
                <p>
                  <strong>Department</strong>
                  <span>{selectedEmployee.department_name || "-"}</span>
                </p>
                <p>
                  <strong>Designation</strong>
                  <span>{selectedEmployee.designation_name || "-"}</span>
                </p>
                <p>
                  <strong>Branch</strong>
                  <span>{selectedEmployee.branch_name || "-"}</span>
                </p>
                <p>
                  <strong>Status</strong>
                  <span>{selectedEmployee.employeement_status || "-"}</span>
                </p>
                <p>
                  <strong>Email</strong>
                  <span>{selectedEmployee.employee_email_id || "-"}</span>
                </p>
                <p>
                  <strong>Mobile</strong>
                  <span>{selectedEmployee.employee_mobile_no || "-"}</span>
                </p>
                <p>
                  <strong>Joining Date</strong>
                  <span>
                    {formatDate(selectedEmployee.employee_joining_date)}
                  </span>
                </p>
                <p>
                  <strong>City</strong>
                  <span>{selectedEmployee.city || "-"}</span>
                </p>
                <p>
                  <strong>Aadhar</strong>
                  <span>{selectedEmployee.employee_adhar_no || "-"}</span>
                </p>
                <p>
                  <strong>Bank</strong>
                  <span>{selectedEmployee.employee_bank_name || "-"}</span>
                </p>
                <p>
                  <strong>Account</strong>
                  <span>
                    {selectedEmployee.employee_bank_account_no || "-"}
                  </span>
                </p>
                <p>
                  <strong>IFSC</strong>
                  <span>{selectedEmployee.employee_bank_ifsc_code || "-"}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default EmployeeMaster;
