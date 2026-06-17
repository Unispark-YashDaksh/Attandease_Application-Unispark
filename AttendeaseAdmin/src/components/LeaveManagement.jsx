import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  autoAssignLeaveBalance,
  fetchLeaveBalance,
  fetchLeaveApplications,
  updateLeaveStatus,
  createLeaveAdjustment,
  runCarryForward,
} from "../services/leaveApi";
import "../css/designation.css";
import "../css/Employees.css";

const apiUrl = import.meta.env.VITE_API;

function LeaveManagement() {
  const [activeSection, setActiveSection] = useState("assign");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Assign Balance
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignFY, setAssignFY] = useState("2026-27");
  const [assignLeaveConfigs, setAssignLeaveConfigs] = useState([
    { leave_type_id: 1, code: "SL", label: "Sick Leave", checked: true, days: 12 },
    { leave_type_id: 2, code: "CL", label: "Casual Leave", checked: true, days: 8 },
    { leave_type_id: 3, code: "EL", label: "Earn Leave", checked: true, days: 18 },
  ]);
  const [assignResult, setAssignResult] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/activeEmployee`)
      .then((res) => setEmployees(res.data.result || []))
      .catch(() => {});
  }, []);

  // View Balance
  const [viewEmpId, setViewEmpId] = useState("");
  const [viewYear, setViewYear] = useState("");
  const [viewData, setViewData] = useState(null);

  // Leave History
  const [histEmpId, setHistEmpId] = useState("");
  const [histStatus, setHistStatus] = useState("");
  const [histData, setHistData] = useState(null);

  // Approvals
  const [approvals, setApprovals] = useState([]);
  const [approvalAdmin, setApprovalAdmin] = useState("1");
  const [processingId, setProcessingId] = useState(null);

  // Adjustments
  const [adjEmpId, setAdjEmpId] = useState("");
  const [adjLeaveType, setAdjLeaveType] = useState("");
  const [adjType, setAdjType] = useState("CREDIT");
  const [adjDays, setAdjDays] = useState("");
  const [adjBy, setAdjBy] = useState("1");
  const [adjReason, setAdjReason] = useState("");
  const [adjResult, setAdjResult] = useState(null);

  // Carry Forward
  const [cfFrom, setCfFrom] = useState("2025-2026");
  const [cfTo, setCfTo] = useState("2026-2027");
  const [cfResult, setCfResult] = useState(null);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAssign = async () => {
    if (!assignEmpId) return showMessage("Select an employee", true);
    setLoading(true); setAssignResult(null);
    try {
      const payload = {
        financial_year: assignFY,
        leave_types: assignLeaveConfigs
          .filter((c) => c.checked)
          .map((c) => ({ leave_type_id: c.leave_type_id, code: c.code, default_days: parseInt(c.days) })),
      };
      const res = await autoAssignLeaveBalance(assignEmpId, payload);
      setAssignResult(res);
      showMessage(res.message || "Assigned successfully");
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setAssignResult({ error: msg });
      showMessage(msg, true);
    } finally { setLoading(false); }
  };

  const handleViewBalance = async () => {
    if (!viewEmpId) return showMessage("Select an employee", true);
    setLoading(true); setViewData(null);
    try {
      const res = await fetchLeaveBalance(viewEmpId, viewYear || undefined);
      setViewData(res);
    } catch (err) {
      showMessage(err.response?.data?.error || err.message, true);
    } finally { setLoading(false); }
  };

  const handleHistory = async () => {
    if (!histEmpId) return showMessage("Select an employee", true);
    setLoading(true); setHistData(null);
    try {
      const params = { employee_id: histEmpId };
      if (histStatus) params.status = histStatus;
      const res = await fetchLeaveApplications(params);
      setHistData(res);
    } catch (err) {
      showMessage(err.response?.data?.error || err.message, true);
    } finally { setLoading(false); }
  };

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const res = await fetchLeaveApplications({ status: "PENDING" });
      setApprovals(res.data || []);
    } catch (err) {
      showMessage(err.response?.data?.error || err.message, true);
    } finally { setLoading(false); }
  };

  const handleApproval = async (id, status) => {
    setProcessingId(id);
    try {
      const res = await updateLeaveStatus(id, status, parseInt(approvalAdmin));
      showMessage(res.message);
      loadApprovals();
    } catch (err) {
      showMessage(err.response?.data?.error || err.message, true);
    } finally { setProcessingId(null); }
  };

  const handleAdjustment = async () => {
    if (!adjEmpId || !adjLeaveType || !adjDays || !adjBy)
      return showMessage("Fill all required fields", true);
    setLoading(true); setAdjResult(null);
    try {
      const res = await createLeaveAdjustment({
        employee_id: parseInt(adjEmpId),
        leave_type_id: parseInt(adjLeaveType),
        adjustment_type: adjType,
        days: parseInt(adjDays),
        reason: adjReason || undefined,
        adjusted_by: parseInt(adjBy),
      });
      setAdjResult(res);
      showMessage(res.message);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setAdjResult({ error: msg });
      showMessage(msg, true);
    } finally { setLoading(false); }
  };

  const handleCarryForward = async () => {
    if (!cfFrom || !cfTo) return showMessage("Fill both years", true);
    setLoading(true); setCfResult(null);
    try {
      const res = await runCarryForward(cfFrom, cfTo);
      setCfResult(res);
      showMessage(res.message);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setCfResult({ error: msg });
      showMessage(msg, true);
    } finally { setLoading(false); }
  };

  const sections = [
    { key: "assign", label: "Assign Balance", icon: "account_balance_wallet" },
    { key: "view", label: "View Balance", icon: "visibility" },
    { key: "history", label: "Leave History", icon: "history" },
    { key: "approvals", label: "Approvals", icon: "check_circle" },
    { key: "adjust", label: "Adjustments", icon: "tune" },
    { key: "carry", label: "Carry Forward", icon: "forward" },
  ];

  return (
    <div className="designation-page">
      <div className="designation-main">
        <div className="breadcrumb-container">
          <span className="material-symbols-outlined breadcrumb-icon">home</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Leave Management</span>
        </div>

        <div className="designation-header">
          <div>
            <h1 className="designation-title">Leave Management</h1>
            <p className="designation-subtitle">Manage employee leave balances, applications, and carry-forwards</p>
          </div>
        </div>

        {message && (
          <div className={`designation-error`} style={{ background: message.isError ? "#ffdad6" : "#d1fae5", borderColor: message.isError ? "#ba1a1a" : "#059669", color: message.isError ? "#93000a" : "#065f46" }}>
            {message.text}
          </div>
        )}

        <div className="directory-tabs" style={{ marginBottom: 24 }}>
          {sections.map((s) => (
            <button key={s.key} className={activeSection === s.key ? "directory-tab-active" : ""} onClick={() => setActiveSection(s.key)}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "middle", marginRight: 6 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* ===================== ASSIGN BALANCE ===================== */}
        {activeSection === "assign" && (
          <div className="designation-table-card">
            <div className="table-toolbar"><h3>Auto-Assign Leave Balance</h3></div>
            <div style={{ padding: 24 }}>
              <p style={{ color: "#737784", fontSize: 14, marginBottom: 20 }}>Creates leave balance entries for the selected financial year. Choose which leave types to assign and their day counts.</p>

              <div className="form-group"><label>Select Employee</label>
                <select value={assignEmpId} onChange={(e) => setAssignEmpId(e.target.value)}>
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_code} — {emp.employee_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginTop: 16 }}><label>Financial Year</label>
                <input value={assignFY} onChange={(e) => setAssignFY(e.target.value)} placeholder="e.g. 2026-27" />
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={{ fontWeight: 600, fontSize: 14, color: "#191b22", display: "block", marginBottom: 10 }}>Leave Types</label>
                <div className="table-scroll">
                  <table className="designation-table" style={{ minWidth: 400 }}>
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>Assign</th>
                        <th>Leave Type</th>
                        <th style={{ width: 120 }}>Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignLeaveConfigs.map((cfg, i) => (
                        <tr key={cfg.code}>
                          <td>
                            <input type="checkbox" checked={cfg.checked} onChange={() => {
                              const updated = [...assignLeaveConfigs];
                              updated[i] = { ...updated[i], checked: !updated[i].checked };
                              setAssignLeaveConfigs(updated);
                            }} style={{ width: 18, height: 18, cursor: "pointer" }} />
                          </td>
                          <td style={{ fontWeight: 600, color: "#191b22" }}>{cfg.label} ({cfg.code})</td>
                          <td>
                            <input type="number" value={cfg.days} onChange={(e) => {
                              const updated = [...assignLeaveConfigs];
                              updated[i] = { ...updated[i], days: e.target.value };
                              setAssignLeaveConfigs(updated);
                            }} style={{ width: 80, padding: "6px 8px", border: "1px solid #c3c6d5", borderRadius: 6, fontSize: 14 }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center" }}>
                <button className="save-btn" onClick={handleAssign} disabled={loading}>{loading ? "Assigning..." : "Assign Balance"}</button>
                {assignResult && <span style={{ color: assignResult.error ? "#ba1a1a" : "#059669", fontSize: 14 }}>{assignResult.error || assignResult.message}</span>}
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW BALANCE ===================== */}
        {activeSection === "view" && (
          <div className="designation-table-card">
            <div className="table-toolbar"><h3>View Leave Balance</h3></div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}><label>Select Employee</label>
                  <select value={viewEmpId} onChange={(e) => setViewEmpId(e.target.value)}>
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.employee_code} — {emp.employee_name}</option>
                    ))}
                  </select></div>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}><label>Financial Year (optional)</label>
                  <input placeholder="e.g. 2026-27" value={viewYear} onChange={(e) => setViewYear(e.target.value)} /></div>
              </div>
              <button className="save-btn" onClick={handleViewBalance} disabled={loading}>{loading ? "Fetching..." : "Fetch Balance"}</button>

              {viewData && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ margin: "0 0 4px", color: "#191b22" }}>{viewData.employee || `Employee #${viewEmpId}`}</h4>
                  <p style={{ color: "#737784", fontSize: 13, marginBottom: 16 }}>FY: {viewData.financial_year || viewYear || "Current"} | Total Remaining: {viewData.total || 0}</p>
                  {viewData.leaves?.length > 0 ? (
                    <div className="table-scroll"><table className="designation-table">
                      <thead><tr><th>Leave Type</th><th>Code</th><th>Total</th><th>Used</th><th>Remaining</th></tr></thead>
                      <tbody>{viewData.leaves.map((item, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: "#191b22" }}>{item.leave_name || item.lave_name || `Type #${item.leave_type_id}`}</td>
                          <td>{item.code}</td><td>{item.total_days}</td><td>{item.used_days}</td>
                          <td><span className="status-active">{item.remaining_days}</span></td>
                        </tr>
                      ))}</tbody>
                    </table></div>
                  ) : <p style={{ color: "#737784", padding: 20, textAlign: "center" }}>{viewData.message || "No balance found"}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== LEAVE HISTORY ===================== */}
        {activeSection === "history" && (
          <div className="designation-table-card">
            <div className="table-toolbar"><h3>Leave History</h3></div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}><label>Select Employee</label>
                  <select value={histEmpId} onChange={(e) => setHistEmpId(e.target.value)}>
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.employee_code} — {emp.employee_name}</option>
                    ))}
                  </select></div>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}><label>Status Filter</label>
                  <select value={histStatus} onChange={(e) => setHistStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select></div>
              </div>
              <button className="save-btn" onClick={handleHistory} disabled={loading}>{loading ? "Fetching..." : "Fetch History"}</button>

              {histData && (
                <div style={{ marginTop: 24 }}>
                  <p style={{ color: "#737784", marginBottom: 12 }}>{histData.total || 0} application(s)</p>
                  {histData.data?.length > 0 ? (
                    <div className="table-scroll"><table className="designation-table">
                      <thead><tr><th>Employee</th><th>Leave Type</th><th>Dates</th><th>Days</th><th>Status</th><th>Applied</th><th>Approved By</th></tr></thead>
                      <tbody>{histData.data.map((item, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: "#191b22" }}>{item.employee_name || `#${item.employee_id}`}</td>
                          <td>{item.leave_name || item.code}</td>
                          <td>{(item.from_date || "").split("T")[0]} → {(item.to_date || "").split("T")[0]}</td>
                          <td>{item.total_days}</td>
                          <td><span className={item.status === "APPROVED" ? "status-active" : item.status === "REJECTED" ? "status-inactive" : ""} style={{ background: item.status === "PENDING" ? "#fffbeb" : undefined, color: item.status === "PENDING" ? "#d97706" : undefined, borderRadius: 9999, padding: "4px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.status}</span></td>
                          <td>{(item.applied_on || "").split("T")[0]}</td>
                          <td>{item.approved_by_name || "-"}</td>
                        </tr>
                      ))}</tbody>
                    </table></div>
                  ) : <p style={{ color: "#737784", textAlign: "center", padding: 20 }}>No applications found</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== APPROVALS ===================== */}
        {activeSection === "approvals" && (
          <div className="designation-table-card">
            <div className="table-toolbar" style={{ justifyContent: "space-between" }}>
              <h3>Approve / Reject</h3>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input placeholder="Your Admin ID" value={approvalAdmin} onChange={(e) => setApprovalAdmin(e.target.value)} style={{ width: 100, border: "1px solid #c3c6d5", borderRadius: 8, padding: "6px 10px", fontSize: 13 }} />
                <button className="save-btn" onClick={loadApprovals} disabled={loading}>Load Pending</button>
              </div>
            </div>
            <div style={{ padding: 24 }}>
              {approvals.length === 0 && !loading && <p style={{ color: "#737784", textAlign: "center", padding: 20 }}>No pending applications. Click "Load Pending" to fetch.</p>}
              {loading && <p style={{ color: "#737784", textAlign: "center", padding: 20 }}>Loading...</p>}
              {approvals.length > 0 && (
                <div className="table-scroll"><table className="designation-table">
                  <thead><tr><th>Employee</th><th>Leave Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Actions</th></tr></thead>
                  <tbody>{approvals.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, color: "#191b22" }}>{item.employee_name || `#${item.employee_id}`}</td>
                      <td>{item.leave_name || item.code}</td>
                      <td>{(item.from_date || "").split("T")[0]} → {(item.to_date || "").split("T")[0]}</td>
                      <td>{item.total_days}</td>
                      <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.reason || "-"}</td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="save-btn" style={{ background: "#059669", padding: "6px 14px", minHeight: 32, fontSize: 12 }} onClick={() => handleApproval(item.id, "APPROVED")} disabled={processingId === item.id}>
                            {processingId === item.id ? "..." : "Approve"}
                          </button>
                          <button className="cancel-btn" style={{ background: "#dc2626", color: "#fff", padding: "6px 14px", minHeight: 32, fontSize: 12 }} onClick={() => handleApproval(item.id, "REJECTED")} disabled={processingId === item.id}>
                            {processingId === item.id ? "..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table></div>
              )}
            </div>
          </div>
        )}

        {/* ===================== ADJUSTMENTS ===================== */}
        {activeSection === "adjust" && (
          <div className="designation-table-card">
            <div className="table-toolbar"><h3>Credit / Debit Override</h3></div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="form-group"><label>Select Employee</label>
                  <select value={adjEmpId} onChange={(e) => setAdjEmpId(e.target.value)}>
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.employee_code} — {emp.employee_name}</option>
                    ))}
                  </select></div>
                <div className="form-group"><label>Leave Type</label>
                  <select value={adjLeaveType} onChange={(e) => setAdjLeaveType(e.target.value)}>
                    <option value="">-- Select Leave Type --</option>
                    <option value="1">Sick Leave (SL)</option>
                    <option value="2">Casual Leave (CL)</option>
                    <option value="3">Earn Leave (EL)</option>
                  </select></div>
                <div className="form-group"><label>Type</label>
                  <select value={adjType} onChange={(e) => setAdjType(e.target.value)}>
                    <option value="CREDIT">CREDIT</option>
                    <option value="DEBIT">DEBIT</option>
                  </select></div>
                <div className="form-group"><label>Days</label>
                  <input type="number" placeholder="Number of days" value={adjDays} onChange={(e) => setAdjDays(e.target.value)} /></div>
                <div className="form-group"><label>Adjusted By (Admin ID)</label>
                  <input type="number" placeholder="Admin employee ID" value={adjBy} onChange={(e) => setAdjBy(e.target.value)} /></div>
                <div className="form-group"><label>Reason (optional)</label>
                  <input placeholder="Reason for adjustment" value={adjReason} onChange={(e) => setAdjReason(e.target.value)} /></div>
              </div>
              <button className="save-btn" style={{ background: adjType === "CREDIT" ? "#059669" : "#dc2626" }} onClick={handleAdjustment} disabled={loading}>{loading ? "Applying..." : `Apply ${adjType}`}</button>
              {adjResult && (
                <div style={{ marginTop: 12, color: adjResult.error ? "#ba1a1a" : "#059669", fontSize: 14 }}>
                  <p>{adjResult.error || adjResult.message}</p>
                  {adjResult.data && <p style={{ color: "#434653" }}>New Total: {adjResult.data.new_total_days} | Remaining: {adjResult.data.new_remaining_days}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== CARRY FORWARD ===================== */}
        {activeSection === "carry" && (
          <div className="designation-table-card">
            <div className="table-toolbar"><h3>Year-End EL Carry Forward</h3></div>
            <div style={{ padding: 24 }}>
              <p style={{ color: "#737784", fontSize: 14, marginBottom: 20 }}>Carries forward remaining Earned Leave (EL) balances from the old financial year to the new one (max 15 days).</p>
              <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}><label>From Year</label>
                  <input placeholder="e.g. 2025-2026" value={cfFrom} onChange={(e) => setCfFrom(e.target.value)} /></div>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}><label>To Year</label>
                  <input placeholder="e.g. 2026-2027" value={cfTo} onChange={(e) => setCfTo(e.target.value)} /></div>
              </div>
              <button className="save-btn" style={{ background: "#37474F" }} onClick={handleCarryForward} disabled={loading}>{loading ? "Processing..." : "Run Carry Forward"}</button>
              {cfResult && (
                <div style={{ marginTop: 12, color: cfResult.error ? "#ba1a1a" : "#059669", fontSize: 14 }}>
                  <p>{cfResult.error || cfResult.message}</p>
                  {cfResult.employees_updated !== undefined && <p style={{ color: "#434653" }}>Employees updated: {cfResult.employees_updated} | {cfResult.from} → {cfResult.to}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveManagement;
