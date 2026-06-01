const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded selfies as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// why used this because
//Multiple Connections, Faste, Production Standard, Handles Many Requests
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Unispark@2022",
  database: process.env.DB_NAME || "attendease_database",
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

app.post("/addDepartmentName", (req, res) => {
  console.log(req.body);
  const departmentName = req.body.departmentName;

  const sql = `INSERT INTO departments (department_name) VALUES (?)`;
  pool.query(sql, [departmentName], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Department Added Successfully",
    });
  });
});

app.get("/fetch-departments", (req, res) => {
  const status = req.query.status;

  let sql = `SELECT * FROM departments`;
  const params = [];

  if (status === "Active" || status === "Inactive") {
    sql = `SELECT * FROM departments WHERE status = ?`;
    params.push(status);
  }

  pool.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      result,
    });
  });
});

app.put("/updateDepartment/:id", (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  const departmentName = req.body.departmentName;

  const sql = `
      UPDATE departments
      SET department_name = ?
      WHERE id = ?
    `;

  pool.query(sql, [departmentName, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Department Updated Successfully",
    });
  });
});

app.put("/updateDepartmentStatus/:id", (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  const sql = `
      UPDATE departments 
      SET status = ? 
      WHERE id = ?
    `;

  pool.query(sql, [status, id], (err, result) => {
    if (err) {
      console.log("Update ERROR:", err);

      return res.status(500).json({
        success: false,
        error: err.sqlMessage,
        fullError: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Department Status Updated Successfully",
      result,
    });
  });
});

app.post("/addDesignation", (req, res) => {
  console.log(req.body);
  const designationName = req.body.designation_name;
  const department_id = req.body.department_id;
  const status = req.body.status || "Active";

  const sql = `INSERT INTO designations(designation_name, department_id, status) VALUES(?, ?, ?)`;

  pool.query(sql, [designationName, department_id, status], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "Data Saved Successfully",
    });
  });
});

app.put("/updateDesignation/:id", (req, res) => {
  const id = req.params.id;
  const designationName = req.body.designation_name;
  const department_id = req.body.department_id;
  const status = req.body.status;

  const sql = `
      UPDATE designations
      SET designation_name = ?, department_id = ?, status = ?
      WHERE id = ?
    `;

  pool.query(
    sql,
    [designationName, department_id, status, id],
    (err, result) => {
      if (err) {
        console.log("Update Error: ", err);

        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
          fullError: err,
        });
      }

      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        result,
      });
    },
  );
});

// this api not conneted with frontend
app.get("/fetch-designation", (req, res) => {
  const status = req.query.status;

  let sql = `
      SELECT designations.*, departments.department_name AS department
      FROM designations
      LEFT JOIN departments ON designations.department_id = departments.id
    `;
  const params = [];

  if (status === "Active" || status === "Inactive") {
    sql = `SELECT designations.*,
      departments.department_name AS department
      FROM designations
      LEFT JOIN departments ON designations.department_id = departments.id
      WHERE designations.status = ?
    `;
    params.push(status);
  }

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log("Update ERROR:", err);

      return res.status(500).json({
        success: false,
        error: err.sqlMessage,
        fullError: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetching Successful",
      result,
    });
  });
});

app.get("/designationStatus", (req, res) => {
  const sql = `SELECT designations.*, 
    departments.department_name AS department
    FROM designations
    JOIN departments ON designations.department_id = departments.id
    WHERE designations.status = 'Active'
    AND departments.status = 'Active'
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      console.log("Fetch Error: ", err);

      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetching Successful",
      result,
    });
  });
});

app.post("/addBranch", (req, res) => {
  console.log(req.body);
  const branchName = req.body.branchName;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const pincode = req.body.pincode;

  const sql = `INSERT INTO branches (branch_name, address, city, state, pincode) VALUES(?,?,?,?,?)`;
  pool.query(
    sql,
    [branchName, address, city, state, pincode],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
          fullError: err,
        });
        console.log(err);
      }
      res.status(200).json({
        success: true,
        message: "Data Added Successfully",
      });
    },
  );
});

app.get("/fetch-branches", (req, res) => {
  const sql = `SELECT * FROM branches;`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
      console.log(err);
    }
    res.status(200).json({
      success: true,
      message: "Fetch Successfully",
      result,
    });
  });
});

app.post("/addShift", (req, res) => {
  console.log(req.body);
  const shiftName = req.body.shiftName;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const lateafter = req.body.lateafter;
  const halfdayAfter = req.body.halfdayAfter;

  const sql = `INSERT INTO shift_master (shift_name, start_time, end_time, late_after, half_day_after) VALUES (?, ?, ?, ?, ?)`;

  pool.query(
    sql,
    [shiftName, startTime, endTime, lateafter, halfdayAfter],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
          fullError: err,
        });
      }

      res.status(200).json({
        success: true,
        message: "Added Successfully",
      });
    },
  );
});

app.get("/fetch-shifts", (req, res) => {
  const sql = `SELECT * FROM shift_master`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetch Successfully",
      result,
    });
  });
});

app.post("/addHolidays", (req, res) => {
  console.log(req.body);
  const holidayDate = req.body.holidayDate;
  const holidayName = req.body.holidayName;

  const sql = `INSERT INTO holidays (holiday_date, holiday_name) VALUES (?, ?)`;

  pool.query(sql, [holidayDate, holidayName], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "Holidays Added Suceessfully",
    });
  });
});

app.get("/fetch-holidays", (req, res) => {
  const sql = `SELECT * FROM holidays`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetch Successfully",
      result,
    });
  });
});

app.post("/addRole", (req, res) => {
  console.log(req.body);
  const RoleName = req.body.RoleName;
  const Desc = req.body.Desc;

  const sql = `INSERT INTO roles(role_name, description) VALUES (?,?)`;

  pool.query(sql, [RoleName, Desc], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Data Added Successfully",
    });
  });
});

app.get("/fetch-roles", (req, res) => {
  const sql = `SELECT * FROM roles`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "Data Fetch Successfully",
      result,
    });
  });
});

app.post("/addNewEmployee", (req, res) => {
  console.log(req.body);

  const employeeForm = req.body.addEmployeeForm;

  const sql = `
    INSERT INTO employee_master(
        employee_code,
        employee_name,
        gender,
        designation_id,
        department_id,
        branch_id,
        shift_id,
        role_id,
        reporting_manager_id,
        employeement_status,
        employee_mobile_no,
        employee_email_id,
        employee_joining_date,
        city,
        emergency_contact_no,
        employee_adhar_no,
        employee_bank_account_no,
        employee_bank_name,
        employee_bank_ifsc_code,
        employee_uan_no
    )
    
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

  pool.query(
    sql,
    [
      employeeForm.employee_code,
      employeeForm.employee_name,
      employeeForm.gender,
      employeeForm.designation_id,
      employeeForm.department_id,
      employeeForm.branch_id,
      employeeForm.shift_id,
      employeeForm.role_id,

      // if empty then store NULL
      employeeForm.reporting_manager_id || null,

      // if empty then ACTIVE
      employeeForm.employeement_status || "ACTIVE",

      employeeForm.employee_mobile_no,
      employeeForm.employee_email_id,

      // if empty then NULL
      employeeForm.employee_joining_date || null,

      employeeForm.city,
      employeeForm.emergency_contact_no,
      employeeForm.employee_adhar_no,
      employeeForm.employee_bank_account_no,
      employeeForm.employee_bank_name,
      employeeForm.employee_bank_ifsc_code,
      employeeForm.employee_uan_no,
    ],

    (err, result) => {
      // VERY IMPORTANT
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
          fullError: err,
        });
      }

      res.status(200).json({
        success: true,
        message: "Data Added Successfully",
      });
    },
  );
});

app.put("/updateEmployee/:id", (req, res) => {
  const id = req.params.id;
  const employeeCode = req.body.employee_code;
  const employeeName = req.body.employee_name;
  const gender = req.body.gender;
  const designationId = req.body.designation_id;
  const departmentId = req.body.department_id;
  const branchId = req.body.branch_id;
  const shiftId = req.body.shift_id;
  const role = req.body.role_id;
  const reportingManagerId = req.body.reporting_manager_id || null;
  const employeementStatus = req.body.employeement_status;
  const employeeMobileNo = req.body.employee_mobile_no;
  const employeeEmailId = req.body.employee_email_id;
  const employeeJoiningDate = req.body.employee_joining_date || null;
  const city = req.body.city;
  const emergencyContactNo = req.body.emergency_contact_no;
  const employeeAadharNo = req.body.employee_adhar_no;
  const employeeBankAccNo = req.body.employee_bank_account_no;
  const employeeBnakName = req.body.employee_bank_name;
  const employeeIFSCCode = req.body.employee_bank_ifsc_code;
  const employeeUANNo = req.body.employee_uan_no;

  const sql = `
      UPDATE employee_master
      SET employee_code = ?,
      employee_name = ?,
      gender = ?,
      designation_id = ?,
      department_id = ?,
      branch_id = ?,
      shift_id = ?,
      role_id = ?,
      reporting_manager_id = ?,
      employeement_status = ?,
      employee_mobile_no = ?,
      employee_email_id = ?,
      employee_joining_date = ?,
      city = ?,
      emergency_contact_no = ?,
      employee_adhar_no = ?,
      employee_bank_account_no = ?,
      employee_bank_name = ?,
      employee_bank_ifsc_code = ?,
      employee_uan_no = ?
      WHERE id = ?
    `;

  pool.query(
    sql,
    [
      employeeCode,
      employeeName,
      gender,
      designationId,
      departmentId,
      branchId,
      shiftId,
      role,
      reportingManagerId,
      employeementStatus,
      employeeMobileNo,
      employeeEmailId,
      employeeJoiningDate,
      city,
      emergencyContactNo,
      employeeAadharNo,
      employeeBankAccNo,
      employeeBnakName,
      employeeIFSCCode,
      employeeUANNo,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
          fullError: err,
        });
      }
      res.status(200).json({
        success: true,
        message: "Data Updated Successfully",
        result,
      });
    },
  );
});

app.put("/updateEmployeeStatus/:id", (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  const sql = `
      UPDATE employee_master
      SET employeement_status = ?
      WHERE id = ?
    `;

  pool.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      result,
    });
  });
});

app.get("/fetch-employees", (req, res) => {
  const status = req.query.status;

  //pagnition fuctioanlity logic
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `SELECT employee_master.*,
    departments.department_name,
    designations.designation_name,
    branches.branch_name,
    shift_master.shift_name,
    roles.role_name

    FROM employee_master
    JOIN departments ON employee_master.department_id= departments.id
    JOIN designations ON employee_master.designation_id= designations.id
    JOIN branches ON employee_master.branch_id= branches.id
    JOIN shift_master ON employee_master.shift_id= shift_master.id
    JOIN roles ON employee_master.role_id = roles.id
    LIMIT ? OFFSET ?
    `;
  const params = [];

  if (status === "ACTIVE" || status === "RESIGNED") {
    sql = `SELECT employee_master.*,
    departments.department_name,
    designations.designation_name,
    branches.branch_name,
    shift_master.shift_name,
    roles.role_name

    FROM employee_master
    JOIN departments ON employee_master.department_id= departments.id
    JOIN designations ON employee_master.designation_id= designations.id
    JOIN branches ON employee_master.branch_id= branches.id
    JOIN shift_master ON employee_master.shift_id= shift_master.id
    JOIN roles ON employee_master.role_id = roles.id
    WHERE employee_master.employeement_status = ?
    LIMIT ? OFFSET ?
    `;
    params.push(status);
  }
  params.push(limit, offset);

  let countSql = `SELECT COUNT(*) AS totalEmployees FROM employee_master`; // added this to get the total count of employees for pagination
  const countParams = [];

  if (status === "ACTIVE" || status === "RESIGNED") {
    countSql = `SELECT COUNT(*) AS totalEmployees
      FROM employee_master
      WHERE employeement_status = ?
    `;
    countParams.push(status);
  }

  const activeEmpSql = `SELECT COUNT(*) AS activeEmployees FROM employee_master WHERE employeement_status = 'ACTIVE'`; // added this to get the total count of active employees for dashboard stats

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }
    pool.query(countSql, countParams, (err, countResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage,
          fullError: err,
        });
      }
      const totalCount = countResult[0].totalEmployees;

      pool.query(activeEmpSql, (err, activeEmpResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: err.sqlMessage,
            fullError: err,
          });
        }

        const activeEmpCount = activeEmpResult[0].activeEmployees;

        res.status(200).json({
          success: true,
          message: "Fetching Employees",
          totalEmployees: totalCount,
          activeEmployees: activeEmpCount,
          result,
        });
      });
    });
  });
});

app.get("/fetchOneEmployee/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
      SELECT employee_master.*,
      departments.department_name,
      designations.designation_name,
      branches.branch_name,
      shift_master.shift_name,
      roles.role_name
      FROM employee_master
      JOIN departments ON employee_master.department_id = departments.id
      JOIN designations ON employee_master.designation_id = designations.id
      JOIN branches ON employee_master.branch_id = branches.id
      JOIN shift_master ON employee_master.shift_id = shift_master.id
      JOIN roles ON employee_master.role_id = roles.id
      WHERE employee_master.id = ?
    `;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }
    res.status(200).json({
      success: true,
      message: "One employee Fetched Successfully",
      result,
    });
  });
});

app.get("/activeEmployee", (req, res) => {
  const sql = `
    SELECT id, employee_name, employee_code
    FROM employee_master
    WHERE employeement_status = 'ACTIVE'
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.sqlMessage,
        fullError: err,
      });
    }

    res.status(200).json({
      success: true,
      message: "Status Fetched Successfully",
      result,
    });
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
      return res
        .status(400)
        .json({ success: false, message: "Employee ID Missing" });
    }

    // BUG FIXED: column name is `attendance` not `attendance_date`
    // Also use promisePool.query for async/await
    const [rows] = await promisePool.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND DATE(attendance_date) = CURDATE() ORDER BY id DESC LIMIT 1`,
      [employeeId],
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
      [employeeId],
    );

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const branchId = employees[0].branch_id;

    const [locations] = await promisePool.query(
      `SELECT * FROM office_locations WHERE branch_id = ? LIMIT 1`,
      [branchId],
    );

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No office location mapped to your branch",
      });
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
      [employeeId],
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
      return res
        .status(400)
        .json({ success: false, message: "Employee ID required" });
    }
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ success: false, message: "GPS coordinates required" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Selfie image required" });
    }

    // Double-check: ensure no duplicate punch in for today
    const [existing] = await promisePool.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = CURDATE()`,
      [employee_id],
    );

    if (existing.length > 0) {
      // Clean up uploaded file if duplicate
      const fs = require("fs");
      if (req.file?.path) fs.unlink(req.file.path, () => {});
      return res
        .status(400)
        .json({ success: false, message: "Already punched in today" });
    }
    // const shiftSQL=  `SELECT s.late_after, s.half_day_after FROM employee_master e JOIN shift_master s ON e.shift_id= s.id WHERE e.id=?`
    // const [shiftData]= await promisePool.query(shiftSQL, [employee_id]);
    // if(shiftData.length===0){
    //   return res.status(400).json({
    //     success: false,
    //     message: "Shift not assigned to employee"
    //   })
    // }

    // const punchInTime= new Date();
    // const shift= shiftData[0];
    // let status= "PRESENT";
    // let is_late= false;
    // let late_minutes=0;

    
    // const [lateHour, lateMinute]= shift.late_after.split(":");
    // const [halfHour, halfMinute]= shift.half_day_after.split(":");

    // // took current date and current date to convert string to int after that 
    // const lateAfterDate= new Date();
    // lateAfterDate.setHours(parseInt(lateHour),parseInt(lateMinute), 0,0);

  


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
      ],
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
    const { employee_id, latitude, longitude } = req.body;

    if (!employee_id) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID required" });
    }

    // Find today's attendance record
    const [existing] = await promisePool.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = CURDATE()`,
      [employee_id],
    );

    if (existing.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No punch in found for today" });
    }

    if (existing[0].punch_out) {
      return res
        .status(400)
        .json({ success: false, message: "Already punched out today" });
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
      [selfiePath, latitude || null, longitude || null, existing[0].id],
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

app.get("/fetchAttendance", async(req, res) => {

  try{
      const [rows] = await promisePool.query(`SELECT a.*, e.employee_name, e.employee_code, ds.designation_name, d.department_name FROM attendance a
  LEFT JOIN employee_master e ON a.employee_id= e.id
  LEFT JOIN designations ds ON e.designation_id= ds.id
  LEFT JOIN departments d ON e.department_id= d.id
  `)

  const formattedRows = rows.map((row) => ({
  ...row,
  attendance_date: row.attendance_date
    ? row.attendance_date.toLocaleDateString("en-CA")
    : null,
}));
  // only for debugging purpose-- rows are coming or not and correct data coming from db. 
  console.log(formattedRows)
    return res.json({
      success: true,
      message: "Attendance Fetch Successfully",
      result: formattedRows,
    });
    
  }catch(err){
    console.log("Ftech Attendance API Error:---->", err)
  }

});

app.put("/updateDepartment/:id", (req, res) => {
  const { id } = req.params;
  const { departmentName } = req.body;
  const sql = `UPDATE departments SET department_name = ? WHERE id = ?`;
  pool.query(sql, [departmentName, id], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({ success: true, message: "Department Updated Successfully" });
  });
});

app.put("/updateDepartmentStatus/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = `UPDATE departments SET status = ? WHERE id = ?`;
  pool.query(sql, [status, id], (err, result) => {
    if (err) return res.send({ success: false, message: err });
    res.json({
      success: true,
      message: "Department Status Updated Successfully",
    });
  });
});

app.listen(port, () => {
  console.log(`Server Listening Port ${port}`);
});
