import React from "react";
import "../css/Branches.css";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
// const api_URL = import.meta.env.VITE_API;

function Branches() {
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allBranchesData, setAllBranchesData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [editingId, setEditingId] = useState(null);

  async function getBranches(filter) {
    const response = await axios.get(
      `http://localhost:7000/fetch-branches?status=${filter}`,
    );
    return response.data.result;
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

  const openAddModal = () => {
    try {
      setEditingId(null);
      setBranchName("");
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (branches) => {
    try {
      setEditingId(branches.id);
      setBranchName(branches.branch_name);
      setAddress(branches.address);
      setCity(branches.city);
      setState(branches.state);
      setPincode(branches.pincode);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:7000/updateBranch/${editingId}`, {
          branchName,
          address,
          city,
          state,
          pincode,
        });
      } else {
        await axios.post(`http://localhost:7000/addBranch`, {
          branchName,
          address,
          city,
          state,
          pincode,
        });
      }
    } catch (err) {
      console.log(err);
    }
    refreshBranches();
    setShowModal(false);
    setEditingId(null);
  };

  const handleDeactivate = async (branches) => {
    const nextStatus = branches.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(
        `http://localhost:7000/updateBranchStatus/${branches.id}`,
        {
          branchName: branches.branch_name,
          address: branches.address,
          city: branches.city,
          state: branches.state,
          pincode: branches.pincode,
          status: nextStatus,
        },
      );
    } catch (error) {
      console.error(error);
    }
    refreshBranches();
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
    <div className="branches-page mt-5">
      <div
        className="branch-summary-grid"
        style={{ display: "flex", justifyContent: "start" }}
      >
        <div
          className="active-branch"
          id="dashboard-cards"
          style={{ marginLeft: "20px" }}
        ></div>
        <div className="active-employee" id="dashboard-cards"></div>
      </div>

      <div
        className="branch-table-card mt-5"
        style={{ border: "1px solid black", height: "400px", width: "100%" }}
      >
        <div className="branch-table-toolbar mt-5">
          <input
            className="branch-search-input"
            type="search"
            placeholder="Search Branch"
          />
          <button
            className="branch-add-btn btn btn-primary"
            onClick={() => {
              openAddModal();
            }}
          >
            + Add New Branch
          </button>
          <select
            className="branch-filter-select form-select d-inline-block"
            style={{ width: "180px", marginLeft: "2px" }}
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
            }}
          >
            <option value="Active">Active Branches</option>
            <option value="Inactive">Inactive Branches</option>
            <option value="All">All Branches</option>
          </select>
          <button
            style={{ marginLeft: "10px" }}
            className="branch-refresh-btn btn btn-primary"
            onClick={refreshBranches}
          >
            Refresh
          </button>
        </div>

        <div className="branch-table-scroll">
          <table className="branch-table table mt-5">
            <thead>
              <tr>
                <th scope="col">Branch Name</th>
                <th scope="col">Address</th>
                <th scope="col">City</th>
                <th scope="col">State</th>
                <th scope="col">Pincode</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {allBranchesData.map((item) => {
                return (
                  <tr className="branch-row" key={item.id}>
                    <td>{item.branch_name}</td>
                    <td>{item.address}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.pincode}</td>
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
                            ? "Deactivate Branch"
                            : "Activate Branch"
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
        </div>
        {showModal && (
          <div className="modal-overlay" role="presentation">
            <div className="designation-modal" role="dialog" aria-modal="true">
              <h4>{editingId ? "Edit Branch" : "Add Branch"}</h4>

              <span>Branch Name</span>
              <input
                type="text"
                className="form-control"
                placeholder="Branch name"
                value={branchName}
                onChange={(event) => setBranchName(event.target.value)}
              />

              <span>Address</span>
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />

              <span>City</span>
              <input
                type="text"
                className="form-control"
                placeholder="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />

              <span>State</span>
              <input
                type="text"
                className="form-control"
                placeholder="State"
                value={state}
                onChange={(event) => setState(event.target.value)}
              />

              <span>Pincode</span>
              <input
                type="text"
                className="form-control"
                placeholder="Pincode"
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
              />

              <div className="modal-actions">
                <button
                  className="save-btn"
                  type="button"
                  onClick={(e) => handleBranchSubmit(e)}
                >
                  {editingId ? "Update" : "Submit"}
                </button>

                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setBranchName("");
                    setAddress("");
                    setCity("");
                    setState("");
                    setPincode("");
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
  );
}

export default Branches;
