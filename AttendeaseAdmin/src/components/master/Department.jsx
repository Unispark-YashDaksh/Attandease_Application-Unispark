import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/designation.css";
const apiUrl = import.meta.env.VITE_API

function Department() {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const getDepartments = async (filter) => {
    const response = await axios.get(
      `${apiUrl}/fetch-departments?status=${filter}`,
    );

    return Array.isArray(response.data.result) ? response.data.result : [];
  };

  const fetchDepartments = async () => {
    try {
      const departmentData = await getDepartments(statusFilter);
      setDepartments(departmentData);
    } catch (error) {
      console.log(error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadDepartments() {
      try {
        const departmentData = await getDepartments(statusFilter);

        if (!ignore) {
          setDepartments(departmentData);
        }
      } catch (error) {
        console.log(error);

        if (!ignore) {
          setDepartments([]);
        }
      }
    }

    loadDepartments();

    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setDepartmentName("");
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingId(department.id);
    setDepartmentName(department.department_name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setDepartmentName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/updateDepartment/${editingId}`, {
          departmentName,
        });
      } else {
        await axios.post("http://localhost:7000/addDepartmentName", {
          departmentName,
        });
      }

      await fetchDepartments();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeactivateDepartment = async (department) => {
    const nextStatus = department.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(
        `http://localhost:7000/updateDepartmentStatus/${department.id}`,
        {
          status: nextStatus,
        },
      );
      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredDepartments = departments.filter((department) =>
    department.department_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
  const activeDepartments = departments.filter(
    (department) => department.status === "Active",
  ).length;
  const operationalPercent = departments.length
    ? Math.round((activeDepartments / departments.length) * 100)
    : 0;
  const latestCreatedAt = departments
    .map((department) => department.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);
  const showingFrom = filteredDepartments.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, filteredDepartments.length);

  return (
    <div className="designation-page">
      <main className="designation-main">
        <div className="designation-header">
          <div>
            <h2 className="designation-title">Department Management</h2>
            <p className="designation-subtitle">
              Configure and manage organizational departments.
            </p>
          </div>

          <button
            type="button"
            className="designation-add-btn"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Department
          </button>
        </div>

        <section className="designation-summary-grid">
          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-primary">
                <span className="material-symbols-outlined">
                  corporate_fare
                </span>
              </div>
              <span className="summary-label">Total Departments</span>
            </div>
            <p className="summary-value">{departments.length}</p>
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
            <p className="summary-value">{activeDepartments}</p>
            <div className="summary-note">Currently operational</div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-tertiary">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <span className="summary-label">Operational</span>
            </div>
            <p className="summary-value">{operationalPercent}%</p>
            <div className="summary-note summary-note-primary">
              <span className="material-symbols-outlined">check_circle</span>
              <span>By current filter set</span>
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

        <section className="designation-table-card">
          <div className="table-toolbar">
            <div className="table-toolbar-left">
              <h3>Department Directory</h3>
              <input
                className="designation-filter-select"
                type="search"
                placeholder="Search departments"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="table-toolbar-actions">
              <select
                className="designation-filter-select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="Active">Active Departments</option>
                <option value="Inactive">Inactive Departments</option>
                <option value="All">All Departments</option>
              </select>
              <button type="button" onClick={fetchDepartments}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="designation-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th className="actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No departments match your filter
                    </td>
                  </tr>
                ) : (
                  paginatedDepartments.map((item, index) => (
                    <tr className="designation-row" key={item.id}>
                      <td>
                        <div className="role-cell">
                          <div
                            className={`role-avatar role-avatar-${(index % 5) + 1}`}
                          >
                            <span className="material-symbols-outlined">
                              groups
                            </span>
                          </div>
                          <span>{item.department_name}</span>
                        </div>
                      </td>
                      <td>{formatDate(item.created_at)}</td>
                      <td>
                        <span
                          className={
                            item.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            type="button"
                            aria-label={`Edit ${item.department_name} department`}
                            onClick={() => openEditModal(item)}
                          >
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                          <button
                            className="delete-btn"
                            type="button"
                            aria-label={
                              item.status === "Active"
                                ? "Deactivate Department"
                                : "Activate Department"
                            }
                            onClick={() => handleDeactivateDepartment(item)}
                          >
                            <span className="material-symbols-outlined">
                              {item.status === "Active"
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
              Showing {showingFrom} to {showingTo} of{" "}
              {filteredDepartments.length} departments
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

        {showModal && (
          <div className="modal-overlay" role="presentation">
            <div className="designation-modal" role="dialog" aria-modal="true">
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close department modal"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2>{editingId ? "Edit Department" : "Add New Department"}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="department_name">Department Name</label>
                  <input
                    id="department_name"
                    type="text"
                    name="department_name"
                    placeholder="Department Name"
                    value={departmentName}
                    onChange={(event) => setDepartmentName(event.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    Save
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

export default Department;
