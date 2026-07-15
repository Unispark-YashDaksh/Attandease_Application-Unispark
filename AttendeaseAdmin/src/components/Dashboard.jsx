import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/designation.css";
import "../css/Dashboard.css";
import LoadingSpinner from "./LoadingSpinner";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const weeklyData = [
  { present: 38, late: 4, absent: 3 },
  { present: 42, late: 2, absent: 1 },
  { present: 40, late: 3, absent: 2 },
  { present: 41, late: 1, absent: 3 },
  { present: 39, late: 5, absent: 1 },
  { present: 12, late: 2, absent: 0 },
  { present: 0, late: 0, absent: 0 },
];

const deptData = [
  { name: "Engineering", present: 85, total: 100 },
  { name: "Sales", present: 24, total: 30 },
  { name: "HR", present: 14, total: 15 },
  { name: "Finance", present: 18, total: 22 },
  { name: "Operations", present: 30, total: 35 },
];

const recentActivity = [
  {
    icon: "person_add",
    color: "green-icon",
    text: "New employee joined",
    detail: "Rahul Sharma · Engineering",
    time: "10 min ago",
  },
  {
    icon: "logout",
    color: "orange-icon",
    text: "Early punch-out detected",
    detail: "Priya Patel · Sales",
    time: "1 hour ago",
  },
  {
    icon: "approval",
    color: "blue-icon",
    text: "Leave approved",
    detail: "Amit Verma · 2 days (Sick Leave)",
    time: "2 hours ago",
  },
  {
    icon: "home_pin",
    color: "purple-icon",
    text: "WFH request approved",
    detail: "Neha Gupta · Today",
    time: "3 hours ago",
  },
  {
    icon: "error",
    color: "red-icon",
    text: "Missed punch-out reminder",
    detail: "3 employees need correction",
    time: "4 hours ago",
  },
];

const quickActions = [
  {
    to: "/Employees",
    icon: "person_add",
    bg: "blue-bg",
    label: "Add New Employee",
    desc: "Onboard a new team member",
  },
  {
    to: "/dailyAttendance",
    icon: "edit_note",
    bg: "orange-bg",
    label: "Manual Attendance",
    desc: "Correct or mark attendance",
  },
  {
    to: "/LeaveManag",
    icon: "event",
    bg: "green-bg",
    label: "Approve Leaves",
    desc: "Pending leave requests",
  },
  {
    to: "/reports",
    icon: "bar_chart",
    bg: "purple-bg",
    label: "View Reports",
    desc: "Attendance & leave reports",
  },
];

function Dashboard() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const maxVal = Math.max(
    ...weeklyData.map((d) => d.present + d.late + d.absent),
    1,
  );

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Dashboard</h2>
            <p className="dashboard-subtitle">
              Welcome back, Admin — here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="dashboard-date">
            <span>Today</span>
            {dateStr}
          </div>
        </div>

        <section className="dashboard-metrics-grid">
          <article className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon metric-icon-blue">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <span className="metric-label">Total Employees</span>
            </div>
            <p className="metric-value">202</p>
            <div className="metric-change up">
              <span className="material-symbols-outlined">trending_up</span>
              <span>+5 this month</span>
            </div>
            <span className="material-symbols-outlined metric-watermark">
              badge
            </span>
          </article>

          <article className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon metric-icon-green">
                <span className="material-symbols-outlined">
                  check_circle
                </span>
              </div>
              <span className="metric-label">Present Today</span>
            </div>
            <p className="metric-value">156</p>
            <div className="metric-change up">
              <span className="material-symbols-outlined">trending_up</span>
              <span>77% attendance</span>
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon metric-icon-orange">
                <span className="material-symbols-outlined">
                  schedule
                </span>
              </div>
              <span className="metric-label">Late Today</span>
            </div>
            <p className="metric-value">14</p>
            <div className="metric-change down">
              <span className="material-symbols-outlined">trending_down</span>
              <span>+3 vs yesterday</span>
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon metric-icon-red">
                <span className="material-symbols-outlined">
                  person_off
                </span>
              </div>
              <span className="metric-label">On Leave</span>
            </div>
            <p className="metric-value">8</p>
            <div className="metric-change down">
              <span className="material-symbols-outlined">trending_down</span>
              <span>2 more than yesterday</span>
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon metric-icon-purple">
                <span className="material-symbols-outlined">
                  home_pin
                </span>
              </div>
              <span className="metric-label">WFH Today</span>
            </div>
            <p className="metric-value">12</p>
            <div className="metric-change up">
              <span className="material-symbols-outlined">trending_up</span>
              <span>Stable vs last week</span>
            </div>
          </article>
        </section>

        <div className="dashboard-row">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Weekly Attendance Overview</h3>
              <span className="material-symbols-outlined">
                calendar_month
              </span>
            </div>
            <div className="dashboard-card-body">
              <div className="weekly-chart">
                {weeklyData.map((day, i) => {
                  const total = day.present + day.late + day.absent;
                  const pctPresent = (day.present / maxVal) * 100;
                  const pctLate = (day.late / maxVal) * 100;
                  const pctAbsent = (day.absent / maxVal) * 100;
                  const barH = Math.max((total / maxVal) * 100, 4);

                  return (
                    <div className="chart-bar-group" key={days[i]}>
                      <div
                        className="chart-bar-stack"
                        style={{ height: `${barH}%` }}
                      >
                        {day.present > 0 && (
                          <div
                            className="chart-bar-segment chart-bar-present"
                            style={{
                              height: `${(day.present / total) * 100}%`,
                            }}
                          />
                        )}
                        {day.late > 0 && (
                          <div
                            className="chart-bar-segment chart-bar-late"
                            style={{
                              height: `${(day.late / total) * 100}%`,
                            }}
                          />
                        )}
                        {day.absent > 0 && (
                          <div
                            className="chart-bar-segment chart-bar-absent"
                            style={{
                              height: `${(day.absent / total) * 100}%`,
                            }}
                          />
                        )}
                      </div>
                      <span className="chart-bar-label">{days[i]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot green" />
                  Present
                </div>
                <div className="legend-item">
                  <span className="legend-dot orange" />
                  Late
                </div>
                <div className="legend-item">
                  <span className="legend-dot red" />
                  Absent
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Recent Activity</h3>
              <span className="material-symbols-outlined">
                notifications
              </span>
            </div>
            <div className="dashboard-card-body">
              <div className="dashboard-mini-list">
                {recentActivity.map((item, i) => (
                  <div className="mini-activity-item" key={i}>
                    <div
                      className={`mini-activity-icon ${item.color}`}
                    >
                      <span className="material-symbols-outlined">
                        {item.icon}
                      </span>
                    </div>
                    <div className="mini-activity-text">
                      <p>{item.text}</p>
                      <span>{item.detail}</span>
                    </div>
                    <span className="mini-activity-time">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-row-3">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Department-wise Attendance</h3>
              <span className="material-symbols-outlined">
                business
              </span>
            </div>
            <div className="dashboard-card-body">
              <div className="dept-list">
                {deptData.map((dept) => {
                  const pct = Math.round(
                    (dept.present / dept.total) * 100,
                  );
                  return (
                    <div className="dept-row" key={dept.name}>
                      <span className="dept-name">{dept.name}</span>
                      <div className="dept-bar-wrap">
                        <div
                          className="dept-bar-fill present-fill"
                          style={{ width: `${pct}%` }}
                        >
                          {pct > 20 && `${pct}%`}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#434653",
                          flex: "0 0 60px",
                          textAlign: "right",
                        }}
                      >
                        {dept.present}/{dept.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="quick-actions-card">
            <h4>Quick Actions</h4>
            {quickActions.map((action) => (
              <Link
                to={action.to}
                className="quick-action-link"
                key={action.label}
              >
                <div
                  className={`quick-action-link-icon ${action.bg}`}
                >
                  <span className="material-symbols-outlined">
                    {action.icon}
                  </span>
                </div>
                <div className="quick-action-text">
                  <p>{action.label}</p>
                  <span>{action.desc}</span>
                </div>
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
