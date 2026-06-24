/**
 * WFH API Service
 *
 * This file follows the SAME pattern as leaveApi.js.
 *
 * How the payload flow works (step-by-step):
 *
 *   applyWFHScreen.jsx (UI)                wfhApi.js (Service)              Backend (Server.js)
 *   ─────────────────────                  ───────────────────              ───────────────────
 *   const res = await applyWFH({      →    api.post("/wfh-request",   →    app.post("/wfh-request")
 *     employee_id: 1,                       payload)                          req.body.employee_id
 *     start_date: "2026-06-25",            ────────                          req.body.start_date
 *     end_date: "2026-06-26",               payload = the                    req.body.end_date
 *     reason: "Personal",                   entire object                    req.body.reason
 *   });
 *
 * Key insight: The "payload" is just a JavaScript object.
 * It's created inline at the call site (applyWFHScreen.jsx).
 * No separate variable needed — the { } is the payload.
 *
 * Same pattern in leaveApi.js:
 *   applyLeaveScreen.jsx:97-103  →  applyLeave({...})  →  api.post("/leave-applications", payload)
 *   applyWFHScreen.jsx           →  applyWFH({...})    →  api.post("/wfh-request",     payload)
 */

import api from "./api";

/**
 * Submit a Work From Home request
 *
 * @param {Object} payload - The request body (created inline at the call site)
 * @param {number} payload.employee_id - Employee ID from AsyncStorage
 * @param {string} payload.start_date - Start date in YYYY-MM-DD format
 * @param {string} payload.end_date - End date in YYYY-MM-DD format
 * @param {string} payload.reason - Reason for WFH
 * @returns {Promise<Object>} Server response { success, message, ... }
 *
 * How this works:
 *   1. applyWFH accepts one argument: the payload object
 *   2. It passes the ENTIRE object to api.post() as the request body
 *   3. axios sends it as JSON in the POST request
 *   4. Backend receives it in req.body
 *
 * See applyleaveScreen.jsx:97-103 for the identical pattern with applyLeave()
 */
export const applyWFH = async (payload) => {
  const res = await api.post("/wfh-request", payload);
  return res.data;
};
