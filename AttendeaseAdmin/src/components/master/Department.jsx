/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

function Department() {
  const [departmentName, setDepartmentName] = useState(""); // this state update / store in Virtual Dom and store current value.
  const [departments, setDepartments] = useState([]); // this state stores all the departments
  const [statusFilter, setStatusFilter] = useState("Active"); // this state manages the status filter
  const [showModal, setShowModal] = useState(false); // this state manages the show hide of the confirmation modal
  const [editingId, setEditingId] = useState(null); // this state manages the id of the department bieng edited.

<<<<<<< HEAD
  // fetch all data with get api
  const fetchDepartments = async () => {
    const response = await axios.get(`http://localhost:7000/fetch-departments`);
=======
  // fetch all data with statusFilter === Active/Inactive with get api
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/fetch-departments?status=${statusFilter}`,
      );
>>>>>>> 58845a09b0e925d5e9509241a91c77981d465ae8

      const departmentData = Array.isArray(response.data.result)
        ? response.data.result
        : [];

      setDepartments(departmentData);
    } catch (error) {
      console.log(error);
      setDepartments([]);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const openAddModal = () => {
    try {
      setEditingId(null);
      setDepartmentName("");
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (department) => {
    try {
      setEditingId(department.id);
      setDepartmentName(department.department_name);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        handleUpdateDepartment(editingId);
      } else {
        handleAddDepartment();
      }
      fetchDepartments();
      setShowModal(false);
      setDepartmentName("");
      setEditingId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDepartment = async () => {
    try {
      await axios.post(`http://localhost:7000/addDepartmentName`, {
        departmentName,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // to handle the update of a department name.
  const handleUpdateDepartment = async (id) => {
    try {
      await axios.put(`http://localhost:8081/updateDepartment/${id}`, {
        departmentName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // to handle the deactivation of a department.
  const handleDeactivateDepartment = async (id, status) => {
    try {
      await axios.put(`http://localhost:8081/updateDepartmentStatus/${id}`, {
        status,
      });
    } catch (error) {
      console.log(error);
    }
    fetchDepartments();
  };

  return (
    <div
      className="mt-5"
      style={{ border: "1px solid black", height: "400px", width: "100%" }}
    >
      <div className="mt-5">
        <input type="search" placeholder="Search departments" />
        <button
          className="btn btn-primary"
          onClick={() => {
            openAddModal();
          }}
        >
          + Add New Department
        </button>

        <select
          className="form-select d-inline-block"
          style={{ width: "180px", marginLeft: "2px" }}
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
          }}
        >
          <option value="Active">Active Departments</option>
          <option value="Inactive">Inactive Departments</option>
          <option value="All">All Departments</option>
        </select>

        <button
          style={{ marginLeft: "2px" }}
          className="btn btn-primary"
          onClick={fetchDepartments}
        >
          Refresh
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" role="presentation">
          <div className="designation-modal" role="dialog" aria-modal="true">
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
                  onChange={(event) => {
                    setDepartmentName(event.target.value);
                  }}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setDepartmentName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="table mt-5">
        <thead>
          <tr>
            <th scope="col">Department Name</th>
            <th scope="col">Created Date</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.department_name}</td>
                <td>{item.created_at}</td>
                <td>{item.status}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      openEditModal(item);
                    }}
                  >
                    edit
                  </button>
                  <button
                    className={
                      item.status === "Active"
                        ? "btn btn-danger"
                        : "btn btn-success"
                    }
                    type="button"
                    style={{ marginLeft: "2px" }}
                    onClick={() => {
                      handleDeactivateDepartment(
                        item.id,
                        item.status === "Active" ? "Inactive" : "Active",
                      );
                    }}
                  >
                    {item.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Department;
