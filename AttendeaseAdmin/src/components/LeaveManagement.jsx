import React from "react";

function LeaveManagement() {
  return (
    <div>
      <h1>Leave Management</h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div className="Stats-Div">Casual Leave</div>
        <div className="Stats-Div">Sick Leave</div>
        <div className="Stats-Div">Earned Leave</div>
        <div className="Stats-Div">Compo Off</div>
      </div>
      <div className="row mt-5">
        <div className="col-6  large-stats-div">
          Weekely Attandance Overview
        </div>
        <div className="col-6 large-stats-div">Recent Activity</div>
      </div>
    </div>
  );
}

export default LeaveManagement;
