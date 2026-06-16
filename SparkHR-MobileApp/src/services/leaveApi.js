import api from "./api";

export const fetchLeaveBalance = async (employeeId, year) => {
  const params = year ? { year } : {};
  const res = await api.get(`/employees/${employeeId}/leave-balance`, { params });
  return res.data;
};

export const applyLeave = async (payload) => {
  const res = await api.post("/leave-applications", payload);
  return res.data;
};
