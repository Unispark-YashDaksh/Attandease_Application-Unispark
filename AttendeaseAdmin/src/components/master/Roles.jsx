import React, { useEffect, useState } from "react";
import axios from "axios";
function Roles() {
  const [showInput, setShowInput] = useState(false);
  const [RoleName, setAddRole] = useState("");
  const [Desc, setAddDesc] = useState("");
  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:7000/fetch-roles`)
      .then((response) => {
        const roles = Array.isArray(response.data.result)
          ? response.data.result
          : [];

        setAllRoles(roles);
      })
      .catch((error) => {
        console.error(error);
        setAllRoles([]);
      });
  }, []);

  const handleSubmit = async () => {
    await axios.post(`http://localhost:7000/addRole`, {
      RoleName,
      Desc,
    });
    setShowInput(false);
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
            <h2>0</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>System Admin</h6>
            <h2>0</h2>
          </div>
        </div>

        {/* <div className="col-md-3">
                    <div className="card shadow-sm border-0 p-3">
                        <h6>Onboarding</h6>
                        <h2>24</h2>
                    </div>
                </div> */}

        {/* <div className="col-md-3">
                    <div className="card shadow-sm border-0 p-3">
                        <h6>Terminated</h6>
                        <h2>20</h2>
                    </div>
                </div> */}
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
                    </div>

                    <div className="col-md-2 mb-2">
                        <select className="form-select">
                            <option>All Status</option>
                        </select>
                    </div> */}

          <div className="col-md-2 mb-2">
            <button
              onClick={() => {
                setShowInput(true);
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
                <th>Role Name</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {showInput === true && (
                <tr>
                  <td>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      onChange={(event) => {
                        setAddRole(event.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(event) => {
                        setAddDesc(event.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Submit
                    </button>
                  </td>
                </tr>
              )}
              {/* Row 1 */}
              {allRoles.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="fw-bold text-primary">{item.role_name}</td>
                    <td>{item.description}</td>
                    <td>{item.created_at}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        View
                      </button>

                      <button className="btn btn-sm btn-outline-warning me-2">
                        Edit
                      </button>

                      <button className="btn btn-sm btn-outline-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
