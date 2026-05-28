import React from "react";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, Admin</p>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div className="Stats-Div">Total Employees</div>
        <div className="Stats-Div">Present Today</div>
        <div className="Stats-Div">On Leave</div>
        <div className="Stats-Div">Late Arrivals</div>
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

export default Dashboard;
