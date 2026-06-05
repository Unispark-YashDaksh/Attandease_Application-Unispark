import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

function Shifts() {
  const [showModal, setShowModal] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lateAfter, setLateAfter] = useState("");
  const [halfdayAfter, setHalfdayAfter] = useState("");
  const [showAllShifts, setShowAllShifts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Active");

  async function getShifts(filter) {
    try {
      const response = await axios.get(
        `http://localhost:7000/fetch-shifts?status=${filter}`,
      );
      return response.data.result;
    } catch (error) {
      console.error(error);
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

  const openAddModal = () => {
    try {
      setEditingId(null);
      setShiftName("");
      setStartTime("");
      setEndTime("");
      setLateAfter("");
      setHalfdayAfter("");
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (shift_master) => {
    try {
      setEditingId(shift_master.id);
      setShiftName(shift_master.shift_name);
      setStartTime(shift_master.start_time);
      setEndTime(shift_master.end_time);
      setLateAfter(shift_master.late_after);
      setHalfdayAfter(shift_master.half_day_after);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitShift = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/updateShift/${editingId}`, {
          shiftName,
          startTime,
          endTime,
          lateAfter,
          halfdayAfter,
        });
      } else {
        await axios.post(`http://localhost:7000/addShift`, {
          shiftName,
          startTime,
          endTime,
          lateAfter,
          halfdayAfter,
        });
      }
    } catch (err) {
      console.error(err);
    }
    setShowModal(false);
    refreshShifts();
  };

  const handleDeactivate = async (shift_master) => {
    const nextStatus = shift_master.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(
        `http://localhost:7000/updateShiftStatus/${shift_master.id}`,
        {
          shiftName: shift_master.shift_name,
          startTime: shift_master.start_time,
          endTime: shift_master.end_time,
          lateAfter: shift_master.late_after,
          halfdayAfter: shift_master.half_day_after,
          status: nextStatus,
        },
      );
    } catch (error) {
      console.error(error);
    }
    refreshShifts();
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
  return (
    <div>
      <div className="mt-5">
        <div style={{ display: "flex", justifyContent: "start" }}>
          <div
            className="active-branch"
            id="dashboard-cards"
            style={{ marginLeft: "20px" }}
          ></div>
          <div className="active-employee" id="dashboard-cards"></div>
        </div>

        <div
          className="mt-5"
          style={{ border: "1px solid black", height: "400px", width: "100%" }}
        >
          <div className="mt-5">
            <input type="search" placeholder="Search shift" />
            <button
              className="btn btn-primary"
              onClick={() => {
                openAddModal();
              }}
            >
              + Add New Shift
            </button>
            <select
              className="branch-filter-select form-select d-inline-block"
              style={{ width: "180px", marginLeft: "2px" }}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
              }}
            >
              <option value="Active">Active Shift</option>
              <option value="Inactive">Inactive Shift</option>
              <option value="All">All Shift</option>
            </select>
            <button
              style={{ marginLeft: "2px" }}
              className="btn btn-primary"
              onClick={() => refreshShifts()}
            >
              Refresh
            </button>
          </div>

          <table className="table mt-5">
            <thead>
              <tr>
                <th scope="col">Shift Name</th>
                <th scope="col">StartTime</th>
                <th scope="col">End Time</th>
                <th scope="col">Late After</th>
                <th scope="col">Half Day After</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {showAllShifts.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.shift_name}</td>
                    <td>{item.start_time}</td>
                    <td>{item.end_time}</td>
                    <td>{item.late_after}</td>
                    <td>{item.half_day_after}</td>
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
                            ? "Deactivate Shift"
                            : "Activate Shift"
                        }
                        onClick={() => handleDeactivate(item)}
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
          {showModal && (
            <div className="modal-overlay" role="presentation">
              <div
                className="designation-modal"
                role="dialog"
                aria-modal="true"
              >
                <h4>{editingId ? "Edit Shift" : "Add Shift"}</h4>
                <span>Shift Name</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Shift name"
                  value={shiftName}
                  onChange={(event) => setShiftName(event.target.value)}
                />
                <span>Start Time</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Start Time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
                <span>End Time</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="End Time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                />
                Late After
                <input
                  type="text"
                  className="form-control"
                  placeholder="Late After"
                  value={lateAfter}
                  onChange={(event) => setLateAfter(event.target.value)}
                />
                <span>Haflday After</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Haflday After"
                  value={halfdayAfter}
                  onChange={(event) => setHalfdayAfter(event.target.value)}
                />
                <div className="modal-actions">
                  <button
                    className="save-btn"
                    type="button"
                    onClick={(e) => handleSubmitShift(e)}
                  >
                    {editingId ? "Update" : "Submit"}
                  </button>

                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setShiftName("");
                      setStartTime("");
                      setEndTime("");
                      setLateAfter("");
                      setHalfdayAfter("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shifts;
