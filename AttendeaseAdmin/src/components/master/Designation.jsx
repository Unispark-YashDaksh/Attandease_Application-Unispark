/* eslint-disable react-hooks/set-state-in-effect */
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import "../css/designation.css";

// to be moved to .env file in for better security and configurability
const Fetch_API_URL = "http://localhost:8081/fetch-designation";
const Post_API_URL = "http://localhost:8081/addDesignation";

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
  const [showModal, setShowModal] = useState(false); // created a state variable to control the visibility of the add/edit modal
  const [showFilter, setShowFilter] = useState(false); // created a state variable to control the visibility of the filter modal
  const [viewMode, setViewMode] = useState("all"); // created a state variable to control the current view mode (all roles or by department)

  const [editingId, setEditingId] = useState(null); // created a state variable to hold the ID of the designation being edited (null when adding a new designation)
  const [loading, setLoading] = useState(true); // created a state variable to indicate whether the designations are currently being loaded from the server
  const [error, setError] = useState(null); // created a state variable to hold any error messages that occur during API calls or other operations

  const nav = useNavigate();

  // created a state variable to hold the current filter criteria for designation name, department, and status
  const [filterCriteria, setFilterCriteria] = useState({
    designation_name: "",
    department: "",
    status: "",
  });

  // created a state variable to hold the form data for adding/editing a designation, initialized with empty values for designation name and department, and "Active" as the default status
  const [formData, setFormData] = useState({
    designation_name: "",
    department: "",
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

  // to fetch the list of designations from the server when the component mounts, and to handle loading and error states during the fetch operation
  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(Fetch_API_URL);
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
        department: "",
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
        department: designation.department,
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
        await axios.put(`${Post_API_URL}/${editingId}`, formData);
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

  // to handle the deletion of a designation.
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this designation?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${Fetch_API_URL}/${id}`);
      fetchDesignations();
    } catch (error) {
      console.error("Error deleting designation:", error);
      setError(
        "An error occurred while deleting the designation. Please try again.",
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
          filterCriteria.department &&
          d.department !== filterCriteria.department
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
        department: "",
        status: "",
      });
    } catch (error) {
      console.error("Error clearing filters:", error);
      setError("An error occurred while clearing filters. Please try again.");
      return;
    }
  };

  const filteredDesignations = filterDesignations();

  // to group the designations by their department.
  const groupByDepartment = () => {
    const grouped = {};
    filteredDesignations.forEach((d) => {
      const dept = d.department || "Unassigned";
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      grouped[dept].push(d);
    });
    return grouped;
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
        <nav className="breadcrumb-container">
          <span className="material-symbols-outlined breadcrumb-icon">
            home
          </span>
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => nav("/dashbord")}
          >
            Home
          </button>
          <span className="material-symbols-outlined breadcrumb-separator">
            chevron_right
          </span>
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => nav("/department")}
          >
            Masters Management
          </button>
          <span className="material-symbols-outlined breadcrumb-separator">
            chevron_right
          </span>
          <span className="breadcrumb-current">Designation Tab</span>
        </nav>

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
                    filteredDesignations.map((d, index) => (
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
                        <td>{d.department || "Not assigned"}</td>
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
                              <span className="material-symobols-outlined">
                                edit
                              </span>
                            </button>
                            <button
                              type="button"
                              className="delete-btn"
                              aria-label="Delete designation"
                              onClick={() => handleDelete(d.id)}
                            >
                              <span className="material-symbols-outlined">
                                delete
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
                                aria-label="Delete designation"
                                onClick={() => handleDelete(d.id)}
                              >
                                <span className="material-symbols-outlined">
                                  delete
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
              Showing {designation.length ? 1 : 0} to {designation.length} of{" "}
              {designation.length} designations
            </p>
            <div className="pagination-buttons">
              <button type="button" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="pagination-active">
                1
              </button>
              <button type="button">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        <section className="designation-insights">
          <div className="insight-card">
            <div>
              <span className="insight-kicker">Master Insight</span>
              <h3>Optimize Department Structure</h3>
              <p>
                Review your role distribution to ensure optimal hierarchical
                balance across your engineering and product teams.
              </p>
              <button type="button">Analyze Structure</button>
            </div>
            <div
              className="efficiency-ring"
              aria-label={`${operationalPercent}% efficiency`}
            >
              <svg viewBox="0 0 192 192">
                <circle cx="96" cy="96" r="80" />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  style={{
                    strokeDashoffset: 502 - (502 * operationalPercent) / 100,
                  }}
                />
              </svg>
              <div>
                <span>{operationalPercent}%</span>
                <small>Efficiency</small>
              </div>
            </div>
          </div>

          <div className="quick-actions-card">
            <h4>Quick Actions</h4>
            <a href="#designation-directory">
              <div className="quick-action-icon">
                <span className="material-symbols-outlined">category</span>
              </div>
              <div className="quick-action-text">
                <p>Manage Categories</p>
                <span>Group your designations</span>
              </div>
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </a>
            <a href="#designation-directory">
              <div className="quick-action-icon quick-action-icon-primary">
                <span className="material-symbols-outlined">history_edu</span>
              </div>
              <div className="quick-action-text">
                <p>Audit Logs</p>
                <span>Track recent changes</span>
              </div>
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </a>
            <a href="#designation-directory">
              <div className="quick-action-icon quick-action-icon-tertiary">
                <span className="material-symbols-outlined">cloud_upload</span>
              </div>
              <div className="quick-action-text">
                <p>Bulk Import</p>
                <span>CSV or Excel files</span>
              </div>
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </a>
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

                  <label htmlFor="department">Department</label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />

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

                  <label htmlFor="filter_department">Department</label>
                  <select
                    id="filter_department"
                    name="department"
                    value={filterCriteria.department}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Departments</option>
                    {[
                      ...new Set(
                        designation.map((d) => d.department).filter(Boolean),
                      ),
                    ].map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
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
