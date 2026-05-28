const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require('dotenv').config()

const app = express();
const port = 7000;

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded selfies as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Unispark@2022",
  database: "attendease_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Convert pool to promise-based (was missing - caused async/await crash)
const promisePool = pool.promise();

// Multer config for selfie uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `selfie_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files allowed"));
  },
});

// ---------- Existing CRUD routes (unchanged) ----------
app.post("/addDepartmentName", (req, res) => {
  console.log(req.body);
  const departmentName = req.body.departmentName;
  const sql = `INSERT INTO departments (department_name) VALUES (?)`;
  pool.query(sql, [departmentName], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Department Added Successfully" });
  });
});

app.get("/fetch-departments", (req, res) => {
  const sql = `SELECT * FROM departments`;
  pool.query(sql, (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Fetched Successfully", result });
  });
});

app.post("/addDesignation", (req, res) => {
  console.log(req.body);
  const designationName = req.body.designation_name;
  const department_id = req.body.department_id;
  const sql = `INSERT INTO designations(designation_name, department_id) VALUES(?,?)`;
  pool.query(sql, [designationName, department_id], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Data Saved Successfully" });
  });
});

app.get("/fetch-designation", (req, res) => {
  const sql = `SELECT designations.*, departments.department_name AS department FROM designations LEFT JOIN departments ON designations.department_id = departments.id`;
  pool.query(sql, (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Fetching Successfully", result });
  });
});

app.post("/addBranch", (req, res) => {
  const { branchName, address, city, state, pincode } = req.body;
  const sql = `INSERT INTO branches (branch_name, address, city, state, pincode) VALUES(?,?,?,?,?)`;
  pool.query(sql, [branchName, address, state, city, pincode], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Data Added Successfully" });
  });
});

app.get("/fetch-branches", (req, res) => {
  const sql = `SELECT * FROM branches;`;
  pool.query(sql, (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Fetch Successfully", result });
  });
});

app.post("/addShift", (req, res) => {
  const { shiftName, startTime, endTime, lateafter, halfdayAfter } = req.body;
  const sql = `INSERT INTO shift_master (shift_name, start_time, end_time, late_after, half_day_after) VALUES (?, ?, ?, ?, ?)`;
  pool.query(sql, [shiftName, startTime, endTime, lateafter, halfdayAfter], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Added Successfully" });
  });
});

app.get("/fetch-shifts", (req, res) => {
  const sql = `SELECT * FROM shift_master`;
  pool.query(sql, (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Fetch Successfully", result });
  });
});

app.post("/addHolidays", (req, res) => {
  const { holidayDate, holidayName } = req.body;
  const sql = `INSERT INTO holidays (holiday_date, holiday_name) VALUES (?, ?)`;
  pool.query(sql, [holidayDate, holidayName], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Holidays Added Suceessfully" });
  });
});

app.get("/fetch-holidays", (req, res) => {
  const sql = `SELECT * FROM holidays`;
  pool.query(sql, (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Fetch Successfully", result });
  });
});

app.post("/addRole", (req, res) => {
  const { RoleName, Desc } = req.body;
  const sql = `INSERT INTO roles(role_name, description) VALUES (?,?)`;
  pool.query(sql, [RoleName, Desc], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Data Added Successfully" });
  });
});

app.get("/fetch-roles", (req, res) => {
  const sql = `SELECT * FROM roles`;
  pool.query(sql, (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Data Fetch Successfully", result });
  });
});

app.post("/addNewEmployee", (req, res) => {
  const employeeForm = req.body.addEmployeeForm;
  const sql = `INSERT INTO employee_master(employee_code, employee_name, gender, designation_id, department_id, branch_id, shift_id, role_id, reporting_manager_id, employeement_status, employee_mobile_no, employee_email_id, employee_joining_date, city, emergency_contact_no, employee_adhar_no, employee_bank_account_no, employee_bank_name, employee_bank_ifsc_code, employee_uan_no) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  pool.query(sql, [
    employeeForm.employee_code,
    employeeForm.employee_name,
    employeeForm.gender,
    employeeForm.designation_id,
    employeeForm.department_id,
    employeeForm.branch_id,
    employeeForm.shift_id,
    employeeForm.role_id,
    employeeForm.reporting_manager_id || null,
    employeeForm.employeement_status || "ACTIVE",
    employeeForm.employee_mobile_no,
    employeeForm.employee_email_id,
    employeeForm.employee_joining_date || null,
    employeeForm.city,
    employeeForm.emergency_contact_no,
    employeeForm.employee_adhar_no,
    employeeForm.employee_bank_account_no,
    employeeForm.employee_bank_name,
    employeeForm.employee_bank_ifsc_code,
    employeeForm.employee_uan_no,
  ], (err, result) => {
    if (err) {
      console.log(err);
      return res.send({ success: false, message: err });
    }
    res.json({ success: true, message: "Data Added Successfully" });
  });
});

app.get("/fetch-employees", (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const sql = `SELECT employee_master.*, departments.department_name, designations.designation_name, branches.branch_name, shift_master.shift_name, roles.role_name FROM employee_master JOIN departments ON employee_master.department_id= departments.id JOIN designations ON employee_master.designation_id= designations.id JOIN branches ON employee_master.branch_id= branches.id JOIN shift_master ON employee_master.shift_id= shift_master.id JOIN roles ON employee_master.role_id = roles.id LIMIT ? OFFSET ?`;
  pool.query(sql, [limit, offset], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Fetching Employees", result });
  });
});

// ==================== ATTENDANCE APIs ====================

// Why: On screen load, frontend calls this to know TODAY's state.
// Backend checks: has employee punched in? punched out?
// Returns canPunchIn / canPunchOut so frontend shows correct button.
app.post("/attendance", async (req, res) => {
  try {
    const employeeId = req.body.employee_id;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID Missing" });
    }

    // BUG FIXED: column name is `attendance` not `attendance_date`
    // Also use promisePool.query for async/await
    const [rows] = await promisePool.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = CURDATE()`,
      [employeeId]
    );

    if (rows.length === 0) {
      return res.json({
        canPunchIn: true,
        canPunchOut: false,
        message: "Allow Punch In",
        record: null,
      });
    }

    const record = rows[0];
    // Format times for frontend display (HH:MM AM/PM)
    const formatTime = (t) => {
      if (!t) return null;
      const [h, m] = t.split(":");
      const hour = parseInt(h);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${m} ${ampm}`;
    };

    if (record.punch_in && !record.punch_out) {
      return res.json({
        canPunchIn: false,
        canPunchOut: true,
        message: "Allow Punch Out",
        record: {
          punch_in: formatTime(record.punch_in),
          punch_out: null,
          punch_in_selfie: record.punch_in_selfie,
          gps_location: record.gps_location,
          attendance_mode: record.attendance_mode,
          readable_address: record.gps_location,
        },
      });
    }
    if (record.punch_in && record.punch_out) {
      return res.json({
        canPunchIn: false,
        canPunchOut: false,
        message: "Attendance Completed",
        record: {
          punch_in: formatTime(record.punch_in),
          punch_out: formatTime(record.punch_out),
          punch_in_selfie: record.punch_in_selfie,
          punch_out_selfie: record.punch_out_selfie,
          gps_location: record.gps_location,
          attendance_mode: record.attendance_mode,
          readable_address: record.gps_location,
        },
      });
    }

    return res.json({
      canPunchIn: true,
      canPunchOut: false,
      message: "Allow Punch In",
      record: null,
    });
  } catch (err) {
    console.error("Attendance API Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Why: Fetch the office location (lat, lng, allowed_radius) for the employee's branch.
// This is used by frontend's haversine formula to check if employee is within 500m.
app.get("/office-location/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [employees] = await promisePool.query(
      `SELECT branch_id FROM employee_master WHERE id = ?`,
      [employeeId]
    );

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const branchId = employees[0].branch_id;

    const [locations] = await promisePool.query(
      `SELECT * FROM office_locations WHERE branch_id = ? LIMIT 1`,
      [branchId]
    );

    if (locations.length === 0) {
      return res.status(404).json({ success: false, message: "No office location mapped to your branch" });
    }

    return res.json({
      success: true,
      officeLocation: locations[0],
    });
  } catch (err) {
    console.error("Office Location Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Why: Check if employee is approved for WFH today.
// If approved → skip 500m geo-fencing validation.
app.get("/wfh-status/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [requests] = await promisePool.query(
      `SELECT * FROM work_from_home_requests
       WHERE employee_id = ? AND status = 'APPROVED'
       AND CURDATE() BETWEEN start_date AND end_date
       LIMIT 1`,
      [employeeId]
    );

    return res.json({
      success: true,
      isWFH: requests.length > 0,
    });
  } catch (err) {
    console.error("WFH Status Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Why: The main Punch In API.
// Flow: Frontend validates everything (permissions, GPS, distance, selfie),
// then sends all data here for storage.
app.post("/punch-in", upload.single("selfie"), async (req, res) => {
  try {
    const {
      employee_id,
      latitude,
      longitude,
      readable_address,
      attendance_mode,
      office_location_id,
    } = req.body;

    // Validation
    if (!employee_id) {
      return res.status(400).json({ success: false, message: "Employee ID required" });
    }
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "GPS coordinates required" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Selfie image required" });
    }

    // Double-check: ensure no duplicate punch in for today
    const [existing] = await promisePool.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = CURDATE()`,
      [employee_id]
    );

    if (existing.length > 0) {
      // Clean up uploaded file if duplicate
      const fs = require("fs");
      if (req.file?.path) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, message: "Already punched in today" });
    }

    const selfiePath = `/uploads/${req.file.filename}`;

    const [result] = await promisePool.query(
      `INSERT INTO attendance
       (employee_id, attendance_date, punch_in, punch_in_selfie, punch_in_latitude, punch_in_longitude, gps_location, attendance_mode, office_location_id, status)
       VALUES (?, CURDATE(), CURTIME(), ?, ?, ?, ?, ?, ?, 'PRESENT')`,
      [
        employee_id,
        selfiePath,
        latitude,
        longitude,
        readable_address || "",
        attendance_mode || "OFFICE",
        office_location_id || null,
      ]
    );

    return res.json({
      success: true,
      message: "Punch In Successful",
      attendanceId: result.insertId,
    });
  } catch (err) {
    console.error("Punch In Error:", err);
    // Clean up uploaded file on error
    if (req.file?.path) {
      const fs = require("fs");
      fs.unlink(req.file.path, () => {});
    }
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Why: Punch Out API
// Employee must have punched in today already.
app.post("/punch-out", upload.single("selfie"), async (req, res) => {
  try {
    const {
      employee_id,
      latitude,
      longitude,
    } = req.body;

    if (!employee_id) {
      return res.status(400).json({ success: false, message: "Employee ID required" });
    }

    // Find today's attendance record
    const [existing] = await promisePool.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = CURDATE()`,
      [employee_id]
    );

    if (existing.length === 0) {
      return res.status(400).json({ success: false, message: "No punch in found for today" });
    }

    if (existing[0].punch_out) {
      return res.status(400).json({ success: false, message: "Already punched out today" });
    }

    let selfiePath = null;
    if (req.file) {
      selfiePath = `/uploads/${req.file.filename}`;
    }

    await promisePool.query(
      `UPDATE attendance
       SET punch_out = CURTIME(),
           punch_out_selfie = COALESCE(?, punch_out_selfie),
           punch_out_latitude = ?,
           punch_out_longitude = ?
       WHERE id = ?`,
      [selfiePath, latitude || null, longitude || null, existing[0].id]
    );

    return res.json({
      success: true,
      message: "Punch Out Successful",
    });
  } catch (err) {
    console.error("Punch Out Error:", err);
    if (req.file?.path) {
      const fs = require("fs");
      fs.unlink(req.file.path, () => {});
    }
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/fetchAttendance", (req, res) => {
  const sql = `SELECT * FROM attendance`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message
      });
    }

    // 🔥 Sahi jagah: Yeh hamesha IF block ke BAHAR hona chahiye
    return res.json({
      success: true,
      message: "Attendance Fetch Successfully",
      result: result
    });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server Listening Port ${port}`);
});
