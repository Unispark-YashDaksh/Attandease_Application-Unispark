import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/designation.css";
const apiUrl = import.meta.env.VITE_BACKEND_URL

function Branches() {
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allBranchesData, setAllBranchesData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  async function getBranches(filter) {
    try {
      const response = await axios.get(
        `${apiUrl}/fetch-branches?status=${filter}`,
      );

      return Array.isArray(response.data.result) ? response.data.result : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function refreshBranches() {
    const branches = await getBranches(statusFilter);
    setAllBranchesData(branches);
  }

  useEffect(() => {
    let ignore = false;

    async function loadBranches() {
      try {
        const branches = await getBranches(statusFilter);

        if (!ignore) {
          setAllBranchesData(branches);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadBranches();

    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  const resetForm = () => {
    setBranchName("");
    setAddress("");
    setCity("");
    setState("");
    setPincode("");
  };

  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (branch) => {
    setEditingId(branch.id);
    setBranchName(branch.branch_name);
    setAddress(branch.address);
    setCity(branch.city);
    setState(branch.state);
    setPincode(branch.pincode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleBranchSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${apiUrl}/updateBranch/${editingId}`, {
          branchName,
          address,
          city,
          state,
          pincode,
        });
      } else {
        await axios.post(`${apiUrl}/addBranch`, {
          branchName,
          address,
          city,
          state,
          pincode,
        });
      }

      closeModal();
      refreshBranches();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeactivate = async (branch) => {
    const nextStatus = branch.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(`${apiUrl}/updateBranchStatus/${branch.id}`, {
        branchName: branch.branch_name,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        pincode: branch.pincode,
        status: nextStatus,
      });
      refreshBranches();
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
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredBranches = allBranchesData.filter((branch) => {
    const searchableValue = [
      branch.branch_name,
      branch.address,
      branch.city,
      branch.state,
      branch.pincode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableValue.includes(searchTerm.toLowerCase());
  });
  const activeBranches = allBranchesData.filter(
    (branch) => branch.status === "Active",
  ).length;
  const coveredCities = new Set(
    allBranchesData.map((branch) => branch.city).filter(Boolean),
  ).size;
  const operationalPercent = allBranchesData.length
    ? Math.round((activeBranches / allBranchesData.length) * 100)
    : 0;
  const latestCreatedAt = allBranchesData
    .map((branch) => branch.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBranches = filteredBranches.slice(startIndex, endIndex);
  const showingFrom = filteredBranches.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, filteredBranches.length);

  return (
    <div className="designation-page">
      <main className="designation-main">
        <div className="designation-header">
          <div>
            <h2 className="designation-title">Branch Management</h2>
            <p className="designation-subtitle">
              Configure office locations and operating branches.
            </p>
          </div>

          <button
            type="button"
            className="designation-add-btn"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Branch
          </button>
        </div>

        <section className="designation-summary-grid">
          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-primary">
                <span className="material-symbols-outlined">store</span>
              </div>
              <span className="summary-label">Total Branches</span>
            </div>
            <p className="summary-value">{allBranchesData.length}</p>
            <div className="summary-note summary-note-success">
              <span className="material-symbols-outlined">trending_up</span>
              <span>Live from database</span>
            </div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-secondary">
                <span className="material-symbols-outlined">location_city</span>
              </div>
              <span className="summary-label">Cities Covered</span>
            </div>
            <p className="summary-value">{coveredCities}</p>
            <div className="summary-note">Across branch locations</div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-tertiary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <span className="summary-label">Active Branches</span>
            </div>
            <p className="summary-value">{activeBranches}</p>
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

        <section className="designation-table-card">
          <div className="table-toolbar">
            <div className="table-toolbar-left">
              <h3>Branch Directory</h3>
              <input
                className="designation-filter-select"
                type="search"
                placeholder="Search branches"
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
                <option value="Active">Active Branches</option>
                <option value="Inactive">Inactive Branches</option>
                <option value="All">All Branches</option>
              </select>
              <button type="button" onClick={refreshBranches}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="designation-table">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBranches.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      No branches match your filter
                    </td>
                  </tr>
                ) : (
                  paginatedBranches.map((item, index) => (
                    <tr className="designation-row" key={item.id}>
                      <td>
                        <div className="role-cell">
                          <div
                            className={`role-avatar role-avatar-${(index % 5) + 1}`}
                          >
                            <span className="material-symbols-outlined">
                              store
                            </span>
                          </div>
                          <span>{item.branch_name}</span>
                        </div>
                      </td>
                      <td>{item.address || "-"}</td>
                      <td>{item.city || "-"}</td>
                      <td>{item.state || "-"}</td>
                      <td>{item.pincode || "-"}</td>
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
                            aria-label={`Edit ${item.branch_name} branch`}
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
                                ? "Deactivate Branch"
                                : "Activate Branch"
                            }
                            onClick={() => handleDeactivate(item)}
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
              Showing {showingFrom} to {showingTo} of {filteredBranches.length}{" "}
              branches
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
                aria-label="Close branch modal"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2>{editingId ? "Edit Branch" : "Add Branch"}</h2>

              <form onSubmit={handleBranchSubmit}>
                <div className="form-group">
                  <label htmlFor="branch_name">Branch Name</label>
                  <input
                    id="branch_name"
                    type="text"
                    placeholder="Branch name"
                    value={branchName}
                    onChange={(event) => setBranchName(event.target.value)}
                    required
                  />

                  <label htmlFor="branch_address">Address</label>
                  <input
                    id="branch_address"
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    required
                  />

                  <label htmlFor="branch_city">City</label>
                  <input
                    id="branch_city"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    required
                  />

                  <label htmlFor="branch_state">State</label>
                  <input
                    id="branch_state"
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    required
                  />

                  <label htmlFor="branch_pincode">Pincode</label>
                  <input
                    id="branch_pincode"
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(event) => setPincode(event.target.value)}
                    required
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

export default Branches;
