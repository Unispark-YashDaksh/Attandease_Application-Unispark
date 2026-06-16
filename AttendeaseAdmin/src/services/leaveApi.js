import axios from "axios";
const apiUrl = import.meta.env.VITE_API;

export const autoAssignLeaveBalance = async (employeeId, payload = {}) => {
  const res = await axios.post(`${apiUrl}/employees/${employeeId}/leave-balance`, payload);
  return res.data;
};

export const fetchLeaveBalance = async (employeeId, year) => {
  const params = year ? { year } : {};
  const res = await axios.get(`${apiUrl}/employees/${employeeId}/leave-balance`, { params });
  return res.data;
};

export const applyLeave = async (payload) => {
  const res = await axios.post(`${apiUrl}/leave-applications`, payload);
  return res.data;
};

export const fetchLeaveApplications = async (params = {}) => {
  const res = await axios.get(`${apiUrl}/leave-applications`, { params });
  return res.data;
};

export const updateLeaveStatus = async (id, status, approvedBy) => {
  const res = await axios.put(`${apiUrl}/leave-applications/${id}/status`, {
    status,
    approved_by: approvedBy,
  });
  return res.data;
};

export const createLeaveAdjustment = async (payload) => {
  const res = await axios.post(`${apiUrl}/leave-adjustments`, payload);
  return res.data;
};

export const runCarryForward = async (fromYear, toYear) => {
  const res = await axios.post(`${apiUrl}/carry-forward`, {
    from_year: fromYear,
    to_year: toYear,
  });
  return res.data;
};
