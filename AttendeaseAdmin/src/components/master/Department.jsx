/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import axios from "axios";

function Department() {
  const [showInputRow, setShowInputRow] = useState(false); // this state manage hide /unhide add department button
  const [departmentName, setDepartmentName] = useState(""); // this state update / store in Virtual Dom and store current value.
  const [departments, setDepartments] = useState([]); // this state stores all the departments
  const [statusFilter, setStatusFilter] = useState("Active"); // this state manages the status filter
  const [editingId, setEditingId] = useState(null); // this state manages the id of the department bieng edited.

  // fetch all data with statusFilter === Active/Inactive with get api
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/fetch-departments?status=${statusFilter}`,
      );

      setDepartments(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [statusFilter]);

  const handleAddDepartment = async () => {
    try {
      await axios.post(`http://localhost:8081/addDepartmentName`, {
        departmentName,
      });
    } catch (err) {
      console.log(err);
    }
    fetchDepartments();
    setShowInputRow(false);
    setDepartmentName("");
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
    fetchDepartments();
    setShowInputRow(false);
    setEditingId(null);
    setDepartmentName("");
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
            setEditingId(null);
            setDepartmentName("");
            setShowInputRow(true);
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
          {showInputRow === true && (
            <tr key="new-department-input">
              <td>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={departmentName}
                    onChange={(event) => {
                      setDepartmentName(event.target.value);
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      if (editingId) {
                        handleUpdateDepartment(editingId);
                      } else {
                        handleAddDepartment();
                      }
                    }}
                  >
                    {editingId ? "Update" : "Submit"}
                  </button>
                </div>
              </td>
            </tr>
          )}

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
                      setEditingId(item.id);
                      setDepartmentName(item.department_name);
                      setShowInputRow(true);
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
