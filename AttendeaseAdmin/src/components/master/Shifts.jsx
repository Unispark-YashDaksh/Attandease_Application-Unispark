import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../css/designation.css";
import LoadingSpinner from "../LoadingSpinner";
const apiUrl= import.meta.env.VITE_API;

function Shifts() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lateAfter, setLateAfter] = useState("");
  const [halfdayAfter, setHalfdayAfter] = useState("");
  const [showAllShifts, setShowAllShifts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  async function getShifts(filter) {
    try {
      const response = await axios.get(
        `${apiUrl}/fetch-shifts?status=${filter}`,
      );

      return Array.isArray(response.data.result) ? response.data.result : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function refreshShifts() {
    const shifts = await getShifts(statusFilter);
    setShowAllShifts(shifts);
  }

  useEffect(() => {
    let ignore = false;

    async function loadShifts() {
      try {
        const shifts = await getShifts(statusFilter);

        if (!ignore) {
          setShowAllShifts(shifts);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadShifts();
    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  const resetForm = () => {
    setShiftName("");
    setStartTime("");
    setEndTime("");
    setLateAfter("");
    setHalfdayAfter("");
  };

  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (shift) => {
    setEditingId(shift.id);
    setShiftName(shift.shift_name);
    setStartTime(shift.start_time);
    setEndTime(shift.end_time);
    setLateAfter(shift.late_after);
    setHalfdayAfter(shift.half_day_after);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleSubmitShift = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${apiUrl}/updateShift/${editingId}`, {
          shiftName,
          startTime,
          endTime,
          lateAfter,
          halfdayAfter,
        });
      } else {
        await axios.post(`${apiUrl}/addShift`, {
          shiftName,
          startTime,
          endTime,
          lateAfter,
          halfdayAfter,
        });
      }

      closeModal();
      refreshShifts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeactivate = async (shift) => {
    const nextStatus = shift.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(`${apiUrl}/updateShiftStatus/${shift.id}`, {
        shiftName: shift.shift_name,
        startTime: shift.start_time,
        endTime: shift.end_time,
        lateAfter: shift.late_after,
        halfdayAfter: shift.half_day_after,
        status: nextStatus,
      });
      refreshShifts();
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

  const formatTime = (timeValue) => timeValue || "-";

  const filteredShifts = showAllShifts.filter((shift) =>
    shift.shift_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const activeShifts = showAllShifts.filter(
    (shift) => shift.status === "Active",
  ).length;
  const configuredGraceRules = showAllShifts.filter(
    (shift) => shift.late_after || shift.half_day_after,
  ).length;
  const latestCreatedAt = showAllShifts
    .map((shift) => shift.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShifts = filteredShifts.slice(startIndex, endIndex);
  const showingFrom = filteredShifts.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, filteredShifts.length);

  return (
    <>
      {loading && <LoadingSpinner message="Processing..." />}
    <div className="designation-page">
      <main className="designation-main">
        <div className="designation-header">
          <div>
            <h2 className="designation-title">Shift Management</h2>
            <p className="designation-subtitle">
              Configure work windows, late marks, and half-day thresholds.
            </p>
          </div>

          <button
            type="button"
            className="designation-add-btn"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Shift
          </button>
        </div>

        <section className="designation-summary-grid">
          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-primary">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <span className="summary-label">Total Shifts</span>
            </div>
            <p className="summary-value">{showAllShifts.length}</p>
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
              <span className="summary-label">Active Shifts</span>
            </div>
            <p className="summary-value">{activeShifts}</p>
            <div className="summary-note">Available for assignment</div>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <div className="summary-icon summary-icon-tertiary">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <span className="summary-label">Rules Set</span>
            </div>
            <p className="summary-value">{configuredGraceRules}</p>
            <div className="summary-note summary-note-primary">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Grace thresholds configured</span>
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
              <h3>Shift Directory</h3>
              <input
                className="designation-filter-select"
                type="search"
                placeholder="Search shifts"
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
                <option value="Active">Active Shifts</option>
                <option value="Inactive">Inactive Shifts</option>
                <option value="All">All Shifts</option>
              </select>
              <button type="button" onClick={refreshShifts}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="designation-table">
              <thead>
                <tr>
                  <th>Shift Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Late After</th>
                  <th>Half Day After</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedShifts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      No shifts match your filter
                    </td>
                  </tr>
                ) : (
                  paginatedShifts.map((item, index) => (
                    <tr className="designation-row" key={item.id}>
                      <td>
                        <div className="role-cell">
                          <div
                            className={`role-avatar role-avatar-${(index % 5) + 1}`}
                          >
                            <span className="material-symbols-outlined">
                              schedule
                            </span>
                          </div>
                          <span>{item.shift_name}</span>
                        </div>
                      </td>
                      <td>{formatTime(item.start_time)}</td>
                      <td>{formatTime(item.end_time)}</td>
                      <td>{formatTime(item.late_after)}</td>
                      <td>{formatTime(item.half_day_after)}</td>
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
                            aria-label={`Edit ${item.shift_name} shift`}
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
                                ? "Deactivate Shift"
                                : "Activate Shift"
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
              Showing {showingFrom} to {showingTo} of {filteredShifts.length}{" "}
              shifts
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
                aria-label="Close shift modal"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2>{editingId ? "Edit Shift" : "Add Shift"}</h2>

              <form onSubmit={handleSubmitShift}>
                <div className="form-group">
                  <label htmlFor="shift_name">Shift Name</label>
                  <input
                    id="shift_name"
                    type="text"
                    placeholder="Shift name"
                    value={shiftName}
                    onChange={(event) => setShiftName(event.target.value)}
                    required
                  />

                  <label htmlFor="start_time">Start Time</label>
                  <input
                    id="start_time"
                    type="text"
                    placeholder="Start Time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    required
                  />

                  <label htmlFor="end_time">End Time</label>
                  <input
                    id="end_time"
                    type="text"
                    placeholder="End Time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    required
                  />

                  <label htmlFor="late_after">Late After</label>
                  <input
                    id="late_after"
                    type="text"
                    placeholder="Late After"
                    value={lateAfter}
                    onChange={(event) => setLateAfter(event.target.value)}
                  />

                  <label htmlFor="halfday_after">Half Day After</label>
                  <input
                    id="halfday_after"
                    type="text"
                    placeholder="Half Day After"
                    value={halfdayAfter}
                    onChange={(event) => setHalfdayAfter(event.target.value)}
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
    </>
  );
}

export default Shifts;
