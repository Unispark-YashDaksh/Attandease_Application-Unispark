import api from "./api";

export const autoAssignLeaveBalance = async (employeeId, payload = {}) => {
  const res = await api.post(`/employees/${employeeId}/leave-balance`, payload);
  return res.data;
};

export const fetchLeaveBalance = async (employeeId, year) => {
  const params = year ? { year } : {};
  const res = await api.get(`/employees/${employeeId}/leave-balance`, {
    params,
  });
  return res.data;
};

export const applyLeave = async (payload) => {
  const res = await api.post(`/leave-applications`, payload);
  return res.data;
};

export const fetchLeaveApplications = async (params = {}) => {
  const res = await api.get(`/leave-applications`, { params });
  return res.data;
};

export const updateLeaveStatus = async (id, status, approvedBy) => {
  const res = await api.put(`/leave-applications/${id}/status`, {
    status,
    approved_by: approvedBy,
  });
  return res.data;
};

export const createLeaveAdjustment = async (payload) => {
  const res = await api.post(`/leave-adjustments`, payload);
  return res.data;
};

export const runCarryForward = async (fromYear, toYear) => {
  const res = await api.post(`/carry-forward`, {
    from_year: fromYear,
    to_year: toYear,
  });
  return res.data;
};
