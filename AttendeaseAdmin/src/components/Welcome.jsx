import React from "react";
import "../components/Welcome.css";

const features = [
  {
    module: "MODULE_01",
    icon: "groups",
    title: "Centralized Employee Master",
    description:
      "A single source of truth for all employee data, structured for rapid access and uncompromising data integrity.",
    type: "wide",
  },
  {
    icon: "schedule",
    title: "Attendance & Shift Tracking",
    description:
      "Real-time attendance, shift, rostering, and time-clock management for your workforce.",
    type: "standard",
  },
  {
    icon: "monitoring",
    title: "Real-Time HR Analytics",
    description: "Live visibility into workforce metrics and operational performance.",
    type: "chart",
  },
  {
    icon: "admin_panel_settings",
    title: "Enterprise Administration & Masters",
    description:
      "Granular role-based access control and configurable masters for complete organizational governance.",
    type: "admin",
  },
];

export default function Welcome({ onLogin, onGetStarted }) {
  const handleLogin = () => {
    if (onLogin) onLogin();
  };

  const handleGetStarted = () => {
    if (onGetStarted) onGetStarted();
  };

  return (
    <div className="spark-welcome">
      {/* Top Navigation */}
      <nav className="spark-navbar">
        <div className="spark-nav-inner">
          <a className="spark-brand" href="#" aria-label="Spark HRMS Home">
             <img src="/screen.svg" className="animate-spin" alt="Logo" style={{ width: 40, height: 40 }} />
            <span className="spark-brand-text">
              <strong>Spark HRMS</strong>
              <small>Enterprise Suite</small>
            </span>
          </a>

          <div className="spark-nav-links">
            <a className="active" href="#features">Features</a>
            <a href="#attendance">Attendance</a>
            <a href="#analytics">Analytics</a>
            <a href="#solutions">Solutions</a>
          </div>

          <div className="spark-nav-actions">
            <button className="spark-login-link" onClick={handleLogin}>
              Login
            </button>
            <button className="spark-btn spark-btn-primary" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>

          <button className="spark-mobile-menu" aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="spark-hero">
          <div className="spark-hero-content">
            <div className="spark-eyebrow">
              <span className="material-symbols-outlined">bolt</span>
              Next-Gen Enterprise HRMS Platform
            </div>

            <h1>
              Complete HR &amp; Workforce Management for Modern Organizations.
            </h1>

            <p className="spark-hero-copy">
              Streamline operations, empower your teams, and scale your
              organization with a high-performance HR command center designed
              for precision and absolute control.
            </p>

            <div className="spark-hero-actions">
              <button className="spark-btn spark-btn-primary spark-btn-large" onClick={handleGetStarted}>
                Start Free Trial
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <button className="spark-btn spark-btn-outline spark-btn-large">
                <span className="material-symbols-outlined">play_circle</span>
                Watch Demo
              </button>
            </div>
          </div>

          <div className="spark-hero-visual">
            <div className="spark-dashboard-preview">
              <div className="spark-preview-header">
                <div className="spark-preview-brand">
                  {/* <span className="spark-mini-logo">
                    <span />
                  </span> */}
                  <div>
                    <strong>Spark HRMS</strong>
                    <small>Admin Dashboard</small>
                  </div>
                </div>
                <span className="spark-preview-date">TODAY</span>
              </div>

              <div className="spark-preview-stats">
                <div className="preview-stat">
                  <span className="preview-icon blue">
                    <span className="material-symbols-outlined">groups</span>
                  </span>
                  <div>
                    <small>TOTAL EMPLOYEES</small>
                    <strong>202</strong>
                    <em>+5 this month</em>
                  </div>
                </div>

                <div className="preview-stat">
                  <span className="preview-icon green">
                    <span className="material-symbols-outlined">check_circle</span>
                  </span>
                  <div>
                    <small>PRESENT TODAY</small>
                    <strong>156</strong>
                    <em>77% attendance</em>
                  </div>
                </div>

                <div className="preview-stat">
                  <span className="preview-icon amber">
                    <span className="material-symbols-outlined">schedule</span>
                  </span>
                  <div>
                    <small>LATE TODAY</small>
                    <strong>14</strong>
                    <em>+3 vs yesterday</em>
                  </div>
                </div>

                <div className="preview-stat">
                  <span className="preview-icon purple">
                    <span className="material-symbols-outlined">location_on</span>
                  </span>
                  <div>
                    <small>WFH TODAY</small>
                    <strong>12</strong>
                    <em>Stable vs last week</em>
                  </div>
                </div>
              </div>

              <div className="preview-main">
                <div className="preview-chart-card">
                  <div className="preview-card-title">
                    <strong>Weekly Attendance Overview</strong>
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>

                  <div className="preview-chart">
                    {[
                      ["MON", 84, 11, 5],
                      ["TUE", 91, 7, 2],
                      ["WED", 88, 9, 4],
                      ["THU", 89, 8, 3],
                      ["FRI", 86, 10, 4],
                      ["SAT", 35, 8, 0],
                      ["SUN", 0, 0, 0],
                    ].map(([day, present, late, absent]) => (
                      <div className="preview-day" key={day}>
                        <div className="preview-bar">
                          <span className="present" style={{ height: `${present}%` }} />
                          <span className="late" style={{ height: `${late}%` }} />
                          <span className="absent" style={{ height: `${absent}%` }} />
                        </div>
                        <small>{day}</small>
                      </div>
                    ))}
                  </div>

                  <div className="preview-legend">
                    <span><i className="present" /> Present</span>
                    <span><i className="late" /> Late</span>
                    <span><i className="absent" /> Absent</span>
                  </div>
                </div>

                <div className="preview-activity">
                  <div className="preview-card-title">
                    <strong>Recent Activity</strong>
                    <span className="material-symbols-outlined">notifications</span>
                  </div>

                  <div className="preview-activity-item">
                    <span className="activity-icon green">
                      <span className="material-symbols-outlined">person_add</span>
                    </span>
                    <div>
                      <strong>New employee joined</strong>
                      <small>Rahul Sharma · Engineering</small>
                    </div>
                    <time>10m</time>
                  </div>

                  <div className="preview-activity-item">
                    <span className="activity-icon amber">
                      <span className="material-symbols-outlined">logout</span>
                    </span>
                    <div>
                      <strong>Early punch-out detected</strong>
                      <small>Priya Patel · Sales</small>
                    </div>
                    <time>1h</time>
                  </div>

                  <div className="preview-activity-item">
                    <span className="activity-icon blue">
                      <span className="material-symbols-outlined">event_available</span>
                    </span>
                    <div>
                      <strong>Leave approved</strong>
                      <small>Amit Verma · 2 days</small>
                    </div>
                    <time>2h</time>
                  </div>
                </div>
              </div>
            </div>

            <div className="spark-floating-card spark-floating-top">
              <span className="status-dot" />
              <div>
                <small>SYSTEM STATUS</small>
                <strong>All HR modules operational</strong>
              </div>
            </div>

            <div className="spark-floating-card spark-floating-bottom">
              <span className="material-symbols-outlined">sync</span>
              <div>
                <small>LIVE SYNC</small>
                <strong>Real-time Attendance Sync</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="spark-section-heading" id="features">
          <h2>Built for Scale, Accuracy, and Efficiency</h2>
          <p>
            Deploy enterprise-grade HR modules designed to handle complex
            workforce operations with precision and clarity.
          </p>
        </section>

        {/* Feature Bento */}
        <section className="spark-feature-grid" id="solutions">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`spark-feature-card ${feature.type}`}
            >
              {feature.module && (
                <span className="spark-module-label">{feature.module}</span>
              )}

              <div className="spark-feature-body">
                <div>
                  <div className="spark-feature-icon">
                    <span className="material-symbols-outlined">
                      {feature.icon}
                    </span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>

                {feature.type === "wide" && (
                  <div className="spark-mini-ui">
                    <div className="mini-lines">
                      <span />
                      <span />
                    </div>
                    <div className="mini-avatar">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  </div>
                )}

                {feature.type === "chart" && (
                  <div className="spark-mini-chart" id="analytics">
                    <span style={{ height: "40%" }} />
                    <span style={{ height: "70%" }} />
                    <span style={{ height: "55%" }} />
                    <span style={{ height: "90%" }} />
                    <span style={{ height: "76%" }} />
                  </div>
                )}

                {feature.type === "admin" && (
                  <div className="spark-mini-table">
                    <div className="mini-table-heading" />
                    <div><span /><b /></div>
                    <div><span /><b /></div>
                    <div><span /><b /></div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Operations */}
        <section className="spark-operations" id="attendance">
          <div>
            <span className="spark-module-label">HR OPERATIONS</span>
            <h2>One Platform. Every HR Operation.</h2>
            <p>
              Bring your people, processes, organizational masters, and
              workforce insights together in one connected HR workspace.
            </p>
          </div>

          <div className="spark-workflow">
            {["Employees", "Attendance", "Leave", "Workforce", "Reports", "Administration"].map(
              (item, index, arr) => (
                <React.Fragment key={item}>
                  <div className="workflow-item">
                    <span className="workflow-number">0{index + 1}</span>
                    <strong>{item}</strong>
                  </div>
                  {index < arr.length - 1 && (
                    <span className="material-symbols-outlined workflow-arrow">
                      arrow_forward
                    </span>
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </section>
      </main>

      {/* CTA */}
      <section className="spark-bottom-cta">
        <h2>Ready to upgrade your HR operations?</h2>
        <p>
          Join modern organizations using Spark HRMS to power their workforce.
        </p>
        <button className="spark-btn spark-btn-primary spark-btn-large" onClick={handleGetStarted}>
          Create Admin Account
        </button>
      </section>

      {/* Footer */}
      <footer className="spark-footer">
        <div className="spark-footer-brand">Spark HRMS © 2026</div>
        <div className="spark-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
}
