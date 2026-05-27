/* eslint-disable react-hooks/set-state-in-effect */
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import "../css/designation.css";

// to be moved to .env file in for better security and configurability
const Fetch_API_URL = "http://localhost:8081/fetch-designation";
const Post_API_URL = "http://localhost:8081/addDesignation";
const PUT_API_URL = "http://localhost:8081/updateDesignation"; // added this
const Fetch_Dept_ID = "http://localhost:8081/fetch-departments";

const roleIcons = [
  "engineering",
  "badge",
  "palette",
  "payments",
  "campaign",
  "work",
];

function Designation() {
  const [designation, setDesignation] = useState([]); // created a state variable to hold the list of designations

  const [departmentsID, setDepartmentsID] = useState([]); // created a state variable to hold the list of departments for the department filter dropdown

  const [showModal, setShowModal] = useState(false); // created a state variable to control the visibility of the add/edit modal

  const [showFilter, setShowFilter] = useState(false); // created a state variable to control the visibility of the filter modal

  const [statusFilter, setStatusFilter] = useState("Active"); // added this to manage the status filter for fetching designations based on their active.inactive status

  const [viewMode, setViewMode] = useState("all"); // created a state variable to control the current view mode (all roles or by department)

  const [currentPage, setCurrentPage] = useState(1); // created a state variable to hold the current page number for pagination

  const itemsPerPage = 10; // defined a constant for the number of items to display per page in the pagination

  const [editingId, setEditingId] = useState(null); // created a state variable to hold the ID of the designation being edited (null when adding a new designation)

  const [loading, setLoading] = useState(true); // created a state variable to indicate whether the designations are currently being loaded from the server

  const [error, setError] = useState(null); // created a state variable to hold any error messages that occur during API calls or other operations

  // created a state variable to hold the current filter criteria for designation name, department, and status
  const [filterCriteria, setFilterCriteria] = useState({
    designation_name: "",
    department_id: "",
    status: "",
  });

  // created a state variable to hold the form data for adding/editing a designation, initialized with empty values for designation name and department, and "Active" as the default status
  const [formData, setFormData] = useState({
    designation_name: "",
    department_id: "",
    status: "Active",
  });

  // to calculate the number of active roles, unique departments, percentage of operational roles, and the latest created date for designations to display in the summary cards at the top of the page
  const activeRoles = designation.filter((d) => d.status === "Active").length;
  const departments = new Set(
    designation.map((d) => d.department).filter(Boolean),
  ).size;
  const operationalPercent = designation.length
    ? Math.round((activeRoles / designation.length) * 100)
    : 0;
  const latestCreatedAt = designation
    .map((d) => d.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Fetch_Dept_ID}?status=Active`); // fetching only active departments for the filter and add/edit dropdowns.
      const deptData = Array.isArray(response.data)
        ? response.data
        : response.data.departments ||
          response.data.data ||
          response.data.result ||
          [];
      setDepartmentsID(deptData);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to fetch departments. Please try again later.");
      setLoading(false);
    }
  };

  // to fetch the list of designations from the server when the component mounts, and to handle loading and error states during the fetch operation
  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Fetch_API_URL}?status=${statusFilter}`, // added status filter to fetch designations based on their active/inactive status
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.designations ||
          response.data.data ||
          response.data.result ||
          [];
      setDesignation(data);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching designations:", error);
      setError("Failed to fetch designations. Please try again later.");
      setLoading(false);
    }
  };

  // useEffect hook to call the fetchDesignations function when the component mounts.
  useEffect(() => {
    fetchDesignations();
  }, [statusFilter]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  // to handle changes to the form inputs for adding/editing a designation.
  const handleChange = (e) => {
    try {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    } catch (error) {
      console.error("Error handling form change:", error);
      setError("An error occurred while updating the form. Please try again.");
    }
  };

  // to open the add/edit modal and populate the form data when editing an existing designation. When adding a new designation, it resets the form data to empty values.
  const openAddModal = () => {
    try {
      setEditingId(null);
      setFormData({
        designation_name: "",
        department_id: "",
        status: "Active",
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error opening add modal:", error);
      setError(
        "An error occurred while opening the add modal. Please try again.",
      );
    }
  };
  const openEditModal = (designation) => {
    try {
      setEditingId(designation.id);
      setFormData({
        designation_name: designation.designation_name,
        department_id: designation.department_id,
        status: designation.status,
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error opening edit modal:", error);
      setError(
        "An error occurred while opening the edit modal. Please try again.",
      );
    }
  };

  //to handle the form submission for editing or adding a designation. POST and PUT requests are made to the server based on wheather a new designation is bieng added or an existing one is bieng edited.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${PUT_API_URL}/${editingId}`, formData); // making a PUT request to uspdate an existing designation
      } else {
        await axios.post(Post_API_URL, formData);
      }

      fetchDesignations(); // Refresh the list of designations after sucessfull adding/editing
      setShowModal(false); // Close the modal after successful submission
      setError(null); // Clear any previous error messages on successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        "An error occurred while submitting the form. Please try again.",
      );
    }
  };

  // to handle the deactivation of a designation.
  const handleDeactivate = async (designation) => {
    const nextStatus = designation.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(`${PUT_API_URL}/${designation.id}`, {
        designation_name: designation.designation_name,
        department_id: designation.department_id,
        status: nextStatus,
      });

      fetchDesignations();
      setError(null);
    } catch (error) {
      console.error("Error deleting designation:", error);
      setError(
        "An error occurred while deactivating the designation. Please try again.",
      );
    }
  };

  // to format the created date of a designation in a more readable format for display in the table and summary cards.
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // to filter the list of designations based on the current filter criteria for designation name, department, and status. It returns a new array of designations that match the filter criteria.
  const filterDesignations = () => {
    try {
      return designation.filter((d) => {
        if (
          filterCriteria.designation_name &&
          !d.designation_name
            .toLowerCase()
            .includes(filterCriteria.designation_name.toLowerCase())
        ) {
          return false;
        }

        if (
          filterCriteria.department_id &&
          d.department_id !== parseInt(filterCriteria.department_id)
        ) {
          return false;
        }

        if (filterCriteria.status && d.status !== filterCriteria.status) {
          return false;
        }

        return true;
      });
    } catch (error) {
      console.error("Error filtering designations:", error);
      setError(
        "An error occurred while filtering designations. Please try again.",
      );
      return designation;
    }
  };

  // to toggle the visibility of the filter modal.
  const toggleFilter = () => {
    try {
      setShowFilter((prev) => !prev);
    } catch (error) {
      console.error("Error toggling filter visibility:", error);
      setError(
        "An error occurred while toggling filter visibility. Please try again.",
      );
    }
  };

  // to handle changes to the filter inputs for designation name, department, and status, and to update the filter criteria state accordingly.
  const handleFilterChange = (e) => {
    try {
      const { name, value } = e.target;
      setFilterCriteria({
        ...filterCriteria,
        [name]: value,
      });
    } catch (error) {
      console.error("Error handling filter change:", error);
      setError(
        "An error occurred while updating filter criteria. Please try again.",
      );
      return;
    }
  };

  // to clear all filter criteria and reset the filter inputs to their default values.
  const clearFilters = () => {
    try {
      setFilterCriteria({
        designation_name: "",
        department_id: "",
        status: "",
      });
    } catch (error) {
      console.error("Error clearing filters:", error);
      setError("An error occurred while clearing filters. Please try again.");
      return;
    }
  };

  const filteredDesignations = filterDesignations();

  const totalPages = Math.ceil(filteredDesignations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDesignations = filteredDesignations.slice(
    startIndex,
    endIndex,
  );
  const showingForm = filteredDesignations.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, filteredDesignations.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCriteria, viewMode, designation]);

  // to group the designations by their department.
  const groupByDepartment = () => {
    const grouped = {};
    paginatedDesignations.forEach((d) => {
      const dept = d.department || "Unassigned";
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      grouped[dept].push(d);
    });
    return grouped;
  };

  const getDepartmentName = (deptID) => {
    const dept = departmentsID.find((d) => d.id === deptID);
    return dept ? dept.department_name : "Not assigned";
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2
          className="animate-spin"
          color="#003c90"
          height={50}
          width={50}
        />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="designation-page">
      <main className="designation-main">
        {error && <div className="designation-error">{error}</div>}

        <div className="designation-header">
          <div>
            <h2 className="designation-title">Designation Management</h2>
            <p className="designation-subtitle">
              Configure and manage corporate roles across all departments.
            </p>
          </div>

          <button
            type="button"
            className="designation-add-btn"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Designation
          </button>
        </div>

        <section className="designation-summary-grid">
          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-primary">
                <span className="material-symbols-outlined">work</span>
              </div>
              <span className="summary-label">Total Roles</span>
            </div>
            <p className="summary-value">{designation.length}</p>
            <div className="summary-note summary-note-success">
              <span className="material-symbols-outlined">trending_up</span>
              <span>Live from database</span>
            </div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-secondary">
                <span className="material-symbols-outlined">
                  corporate_fare
                </span>
              </div>
              <span className="summary-label">Departments</span>
            </div>
            <p className="summary-value">{departments}</p>
            <div className="summary-note">Across entire enterprise</div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-tertiary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <span className="summary-label">Active Roles</span>
            </div>
            <p className="summary-value">{activeRoles}</p>
            <div className="summary-note summary-note-primary">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{operationalPercent}% Operational</span>
            </div>
          </article>

          <article className="summary-card summary-card-sync">
            <div className="summary-card-content">
              <div className="summary-card-top">
                <div className="summary-icon summary-icon-dark">
                  <span className="material-symbols-outlined">update</span>
                </div>
                <span className="summary-label">Last Sync</span>
              </div>
              <p className="summary-value summary-value-small">
                {formatDate(latestCreatedAt)}
              </p>
              <div className="summary-note">Automatic DB update completed</div>
            </div>
            <span className="material-symbols-outlined summary-watermark">
              sync
            </span>
          </article>
        </section>

        <section className="designation-table-card" id="designation-directory">
          <div className="table-toolbar">
            <div className="table-toolbar-left">
              <h3>Designation Directory</h3>
              <div className="directory-tabs">
                <button
                  type="button"
                  className={viewMode === "all" ? "directory-tab-active" : ""}
                  onClick={() => setViewMode("all")}
                >
                  All Roles
                </button>
                <button
                  type="button"
                  className={
                    viewMode === "byDepartment" ? "directory-tab-active" : ""
                  }
                  onClick={() => setViewMode("byDepartment")}
                >
                  By Department
                </button>
              </div>
            </div>
            <div className="table-toolbar-actions">
              {/* the dropdown to show active/inactive/all designations */}
              <select
                className="form-select d-inline-block"
                style={{ width: "180px", marginLeft: "2px" }}
                value={statusFilter}
                onClick={(event) => setStatusFilter(event.target.value)}
              >
                <option value="Active">Active Departments</option>
                <option value="Inactive">Inactive Departments</option>
                <option value="All">All Departments</option>
              </select>
            </div>
            <div className="table-toolbar-actions">
              <button type="button" onClick={toggleFilter}>
                <span className="material-symbols-outlined">filter_list</span>
                Filter
              </button>
              <button type="button">
                <span className="material-symbols-outlined">download</span>
                Export
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="designation-table">
              <thead>
                <tr>
                  <th>Designation Name</th>
                  <th>Department</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th className="actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {viewMode === "all" ? (
                  filteredDesignations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No designations match your filter
                      </td>
                    </tr>
                  ) : (
                    paginatedDesignations.map((d, index) => (
                      <tr key={d.id} className="designation-row">
                        <td>
                          <div className="role-cell">
                            <div
                              className={`role-avatar role-avatar-${(index % 5) + 1}`}
                            >
                              <span className="material-symbols-outlined">
                                {roleIcons[index % roleIcons.length]}
                              </span>
                            </div>
                            <span>{d.designation_name}</span>
                          </div>
                        </td>
                        <td>{getDepartmentName(d.department_id)}</td>
                        <td>{formatDate(d.created_at)}</td>
                        <td>
                          <span
                            className={
                              d.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                            }
                          >
                            {d.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="edit-btn"
                              aria-label={`Edit ${d.designation_name} designation`}
                              onClick={() => openEditModal(d)}
                            >
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                            </button>
                            {/*handle deactivation button */}
                            <button
                              type="button"
                              className="delete-btn"
                              aria-label={
                                d.status === "Active"
                                  ? "Deactivate designation"
                                  : "Activate designation"
                              }
                              onClick={() => handleDeactivate(d)}
                            >
                              <span className="material-symbols-outlined">
                                {d.status === "Active"
                                  ? "block"
                                  : "check_circle"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                ) : Object.keys(groupByDepartment()).length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan="5">
                      No designations match your filter
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupByDepartment())
                    .map(([dept, roles]) => [
                      <tr
                        key={`dept-${dept}`}
                        className="department-header-row"
                      >
                        <td colSpan="5" className="department-header">
                          <span className="material-symbols-outlined">
                            corporate_fare
                          </span>
                          {dept}
                        </td>
                      </tr>,
                      ...roles.map((d, index) => (
                        <tr key={d.id} className="designation-row">
                          <td>
                            <div className="role-cell">
                              <div
                                className={`role-avatar role-avatar-${(index % 5) + 1}`}
                              >
                                <span className="material-symbols-outlined">
                                  {roleIcons[index % roleIcons.length]}
                                </span>
                              </div>
                              <span>{d.designation_name}</span>
                            </div>
                          </td>
                          <td>{d.department}</td>
                          <td>{formatDate(d.created_at)}</td>
                          <td>
                            <span
                              className={
                                d.status === "Active"
                                  ? "status-active"
                                  : "status-inactive"
                              }
                            >
                              {d.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                type="button"
                                className="edit-btn"
                                aria-label="Edit designation"
                                onClick={() => openEditModal(d)}
                              >
                                <span className="material-symbols-outlined">
                                  edit
                                </span>
                              </button>
                              <button
                                type="button"
                                className="delete-btn"
                                aria-label={
                                  d.status === "Active"
                                    ? "Deactivate designation"
                                    : "Activate designation"
                                }
                                onClick={() => handleDeactivate(d)}
                              >
                                <span className="material-symbols-outlined">
                                  {d.status === "Active"
                                    ? "block"
                                    : "check_circle"}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )),
                    ])
                    .flat()
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination">
            <p>
              Showing {showingForm} to {showingTo} of{" "}
              {filteredDesignations.length} designations
            </p>

            <div className="pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <button type="button" className="pagination-active">
                {currentPage}
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {showModal && (
          <div className="modal-overlay" role="presentation">
            <div className="designation-modal" role="dialog" aria-modal="true">
              <h2>{editingId ? "Edit Designation" : "Add New Designation"}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="designation_name">Designation Name</label>
                  <input
                    id="designation_name"
                    type="text"
                    name="designation_name"
                    placeholder="Designation Name"
                    value={formData.designation_name}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="department_id">Department</label>
                  <select
                    id="department_id"
                    type="text"
                    name="department_id"
                    placeholder="Department"
                    value={formData.department_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    {departmentsID.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showFilter && (
          <div className="modal-overlay" role="presentation">
            <div
              className="designation-modal filter-modal"
              role="dialog"
              aria-modal="true"
            >
              <h2>Filter Designations</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowFilter(false);
                }}
              >
                <div className="form-group">
                  <label htmlFor="filter_designation_name">
                    Designation Name
                  </label>
                  <input
                    id="filter_designation_name"
                    type="text"
                    name="designation_name"
                    placeholder="Search designation name..."
                    value={filterCriteria.designation_name}
                    onChange={handleFilterChange}
                  />

                  <label htmlFor="filter_department_id">Department</label>
                  <select
                    id="filter_department_id"
                    name="department_id"
                    value={filterCriteria.department_id}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Departments</option>
                    {departmentsID.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="filter_status">Status</label>
                  <select
                    id="filter_status"
                    name="status"
                    value={filterCriteria.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowFilter(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Designation;
