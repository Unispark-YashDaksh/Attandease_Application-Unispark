import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/designation.css";
import LoadingSpinner from "../LoadingSpinner";
const apiUrl= import.meta.env.VITE_API;

function Roles() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [allRoles, setAllRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  async function getRoles(filter) {
    try {
      const response = await axios.get(
        `${apiUrl}/fetch-roles?status=${filter}`,
      );

      return Array.isArray(response.data.result) ? response.data.result : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function refreshRoles() {
    const roles = await getRoles(statusFilter);
    setAllRoles(roles);
  }

  useEffect(() => {
    let ignore = false;

    async function loadRoles() {
      try {
        setLoading(true);
        const roles = await getRoles(statusFilter);
        if (!ignore) {
          setAllRoles(roles);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadRoles();

    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  const resetForm = () => {
    setRoleName("");
    setDescription("");
  };

  function openAddModal() {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  }

  function openEditModal(role) {
    setEditingId(role.id);
    setRoleName(role.role_name);
    setDescription(role.description);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${apiUrl}/updateRole/${editingId}`, {
          RoleName: roleName,
          Desc: description,
        });
      } else {
        await axios.post(`${apiUrl}/addRole`, {
          RoleName: roleName,
          Desc: description,
        });
      }

      closeModal();
      await refreshRoles();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleDeactivateRole(role) {
    const nextStatus = role.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`${apiUrl}/updateRoleStatus/${role.id}`, {
        status: nextStatus,
      });
      await refreshRoles();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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

  const filteredRoles = allRoles.filter((role) => {
    const nameMatches = role.role_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const descriptionMatches = role.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return nameMatches || descriptionMatches;
  });
  const activeRoles = allRoles.filter((role) => role.status === "Active").length;
  const documentedRoles = allRoles.filter((role) => role.description).length;
  const documentedPercent = allRoles.length
    ? Math.round((documentedRoles / allRoles.length) * 100)
    : 0;
  const latestCreatedAt = allRoles
    .map((role) => role.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
  const showingFrom = filteredRoles.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, filteredRoles.length);

  return (
    <div className="designation-page">
      {loading && <LoadingSpinner />}
      <main className="designation-main">
        <div className="designation-header">
          <div>
            <h2 className="designation-title">Roles & Permissions</h2>
            <p className="designation-subtitle">
              Configure and manage organizational access control levels.
            </p>
          </div>

          <button
            type="button"
            className="designation-add-btn"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Role
          </button>
        </div>

        <section className="designation-summary-grid">
          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-primary">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <span className="summary-label">Total Roles</span>
            </div>
            <p className="summary-value">{allRoles.length}</p>
            <div className="summary-note summary-note-success">
              <span className="material-symbols-outlined">trending_up</span>
              <span>Live from database</span>
            </div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-secondary">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <span className="summary-label">Active Roles</span>
            </div>
            <p className="summary-value">{activeRoles}</p>
            <div className="summary-note">Available for assignment</div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-tertiary">
                <span className="material-symbols-outlined">description</span>
              </div>
              <span className="summary-label">Documented</span>
            </div>
            <p className="summary-value">{documentedPercent}%</p>
            <div className="summary-note summary-note-primary">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Roles with descriptions</span>
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
              <h3>Role Directory</h3>
              <input
                className="designation-filter-select"
                type="search"
                placeholder="Search roles"
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
                <option value="Active">Active Roles</option>
                <option value="Inactive">Inactive Roles</option>
                <option value="All">All Roles</option>
              </select>
              <button type="button" onClick={refreshRoles}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="designation-table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRoles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No roles match your filter
                    </td>
                  </tr>
                ) : (
                  paginatedRoles.map((item, index) => (
                    <tr className="designation-row" key={item.id}>
                      <td>
                        <div className="role-cell">
                          <div
                            className={`role-avatar role-avatar-${(index % 5) + 1}`}
                          >
                            <span className="material-symbols-outlined">
                              badge
                            </span>
                          </div>
                          <span>{item.role_name}</span>
                        </div>
                      </td>
                      <td>{item.description || "-"}</td>
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
                      <td>{formatDate(item.created_at)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            type="button"
                            aria-label={`Edit ${item.role_name} role`}
                            onClick={() => openEditModal(item)}
                          >
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            aria-label={
                              item.status === "Active"
                                ? "Deactivate Role"
                                : "Activate Role"
                            }
                            onClick={() => handleDeactivateRole(item)}
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
              Showing {showingFrom} to {showingTo} of {filteredRoles.length}{" "}
              roles
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
                aria-label="Close role modal"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2>{editingId ? "Edit Role" : "Add Role"}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="role_name">Role Name</label>
                  <input
                    id="role_name"
                    type="text"
                    placeholder="Role name"
                    value={roleName}
                    onChange={(event) => setRoleName(event.target.value)}
                    required
                  />

                  <label htmlFor="role_description">Description</label>
                  <input
                    id="role_description"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="modal-actions">
                  <button className="save-btn" type="submit">
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

export default Roles;
