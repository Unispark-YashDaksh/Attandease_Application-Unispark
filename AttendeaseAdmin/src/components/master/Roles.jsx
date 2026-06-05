import React, { useEffect, useState } from "react";
import axios from "axios";
function Roles() {
  const [showModal, setShowModal] = useState(false);
  const [RoleName, setAddRole] = useState("");
  const [Desc, setAddDesc] = useState("");
  const [allRoles, setAllRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Active");

  async function getRoles(filter) {
    const response = await axios.get(
      `http://localhost:7000/fetch-roles?status=${filter}`,
    );
    return response.data.result;
  }

  async function refreshRoles() {
    const roles = await getRoles(statusFilter);
    setAllRoles(roles);
  }
  useEffect(() => {
    let ignore = false;

    async function loadRoles() {
      try {
        const roles = await getRoles(statusFilter);
        if (!ignore) {
          setAllRoles(roles);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadRoles();

    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  function openAddModal() {
    try {
      setEditingId(null);
      setAddRole("");
      setAddDesc("");
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  function openEditModal(roles) {
    try {
      setEditingId(roles.id);
      setAddRole(roles.role_name);
      setAddDesc(roles.description);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/updateRole/${editingId}`, {
          RoleName,
          Desc,
        });
      } else {
        await axios.post(`http://localhost:7000/addRole`, {
          RoleName,
          Desc,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setShowModal(false);
    setEditingId(null);
    refreshRoles();
  };

  async function handleDeactiveRole(roles) {
    const nextStatus = roles.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:7000/updateRoleStatus/${roles.id}`, {
        status: nextStatus,
      });
    } catch (error) {
      console.error(error);
    }
    refreshRoles();
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

  return (
    <div className="container-fluid p-4">
      {/* Heading */}
      <div className="mb-4">
        <h2 className="fw-bold">Roles & Permissions</h2>
        <p className="text-muted">
          Configure and manage organizational access control levels.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Total Roles</h6>
            <h2>{allRoles.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>System Admin</h6>
            <h2>0</h2>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card shadow-sm border-0 p-3 mb-4">
        <div className="row">
          {/* <div className="col-md-4 mb-2">
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
                    </div> */}

          <div className="col-md-3 mb-1">
            <select
              className="form-select d-inline-block"
              style={{ width: "180px", marginLeft: "2px" }}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
              }}
            >
              <option value="Active">Active Roles</option>
              <option value="Inactive">Inactive Roles</option>
              <option value="All">All Roles</option>
            </select>
            <button
              onClick={() => {
                openAddModal();
              }}
              className="btn btn-primary w-100"
            >
              + Add Role
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
                <th scope="col">Role Name</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {allRoles.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="fw-bold text-primary">{item.role_name}</td>
                    <td>{item.description}</td>
                    <td>{item.status}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(item)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        aria-label={
                          item.status === "Active"
                            ? "Deactivate Role"
                            : "Activate Role"
                        }
                        onClick={() => handleDeactiveRole(item)}
                      >
                        <span className="material-symbols-outlined">
                          {item.status === "Active" ? "block" : "check_circle"}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" role="presentation">
            <div className="designation-modal" role="dialog" aria-modal="true">
              <h4>{editingId ? "Edit Role" : "Add Role"}</h4>

              <span>Role Name</span>
              <input
                type="text"
                className="form-control"
                placeholder="Role name"
                value={RoleName}
                onChange={(event) => setAddRole(event.target.value)}
              />

              <span>Description</span>
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={Desc}
                onChange={(event) => setAddDesc(event.target.value)}
              />

              <div className="modal-actions">
                <button
                  className="save-btn"
                  type="button"
                  onClick={handleSubmit}
                >
                  {editingId ? "Update" : "Submit"}
                </button>

                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setAddRole("");
                    setAddDesc("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <p className="mb-0">Showing 1-10 of 1,284 Employees</p>

          <div>
            <button className="btn btn-light me-2">Prev</button>

            <button className="btn btn-primary me-2">1</button>

            <button className="btn btn-light me-2">2</button>

            <button className="btn btn-light">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;
