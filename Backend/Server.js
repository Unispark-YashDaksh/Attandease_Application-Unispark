require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { error } = require("console");
// const redisClient= require("./config/redis");

const {storage}= require("./cloudConfig");
const upload= multer({storage});

const app = express();
const { url } = require("inspector");
const port = 7000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "employee-id"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded selfies as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// why used this because
//Multiple Connections, Faste, Production Standard, Handles Many Requests
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE || process.env.DB_NAME || "attendease_database",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 150,
  queueLimit: 0,
});

const dbTimezone = process.env.DB_TIMEZONE || "+05:30";

pool.on("connection", (connection) => {
  connection.query("SET time_zone = ?", [dbTimezone], (err) => {
    if (err) {
      console.error("Failed to set DB timezone:", err.message);
    }
  });
});

// Convert pool to promise-based (was missing - caused async/await crash)
const promisePool = pool.promise();

// Multer config for selfie uploads //local storage for attendance
const localDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");xl
  },
  filename: (req, file, cb) => {
    const uniqueName = `selfie_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
console.log(process.env.VITE_API)

const SelfieUpload = multer({
  storage: localDiskStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files allowed"));
  },
});
// upload image particular image
const employeePhotoStorage = multer({
  storage: storage,
  limits: {fileSize: 5*1024*1024}, // 5MB limit
});

app.get("/health",(req ,res)=>{
  const sql = `
    SELLECT * FROM employee_master
    LIMIT 2;
  `
  pool.query(sql, (err, result) => {
    if (err) {
      console.log("SQL error:", err.sqlMessage)
      return res.status(500).json({
        success: false,
        error: err.sqlMessaage
      })
      retun res.status(200).json({
        success: true,
        message: "Employee Data Successfully fetched"
      })
  }
  console.log("Health Checked...Backend Run Properly");
})

const employeePhotoUpload = multer({
  storage: storage,
  limits: {fileSize: 5 * 1024*1024}
});


module.exports={
  SelfieUpload,
  employeePhotoUpload
}
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


//---------- Fetch Users API---------------------------------------------------

app.get("/fetch-user",async(req, res)=>{
  const employeeId= req.body.employee_id;

  const [rows]= promisePool.query(`SELECT * FROM users`);
  
})

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
      message: "Fetching Successfully",
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
      message: "Fetching Successfully",
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

app.get("/fetch-branches", (req, res) => {
  const status = req.query.status;
  let sql = `SELECT * FROM branches;`;

  const params = [];

  if (status === "Active" || status === "Inactive") {
    sql = `
        SELECT * FROM branches
        WHERE status = ?
      `;
    params.push(status);
  }

  pool.query(sql, params, (err, result) => {
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
      message: "Fetch Successfully",
      result,
    });
  });
});

app.put("/updateBranch/:id", (req, res) => {
  const id = req.params.id;
  const branchName = req.body.branchName;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const pincode = req.body.pincode;

  const sql = `
      UPDATE branches
      SET branch_name = ?,
        address = ?,
        city = ?,
        state = ?,
        pincode = ?
      WHERE id = ?
    `;

  const params = [branchName, address, city, state, pincode, id];

  pool.query(sql, params, (err, result) => {
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
      message: "Branch Updated Successfully",
      result,
    });
  });
});

app.put("/updateBranchStatus/:id", (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  const sql = `
      UPDATE branches
      SET status = ?
      WHERE id = ?
    `;

  pool.query(sql, [status, id], (err, result) => {
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
      message: "Status Updated Successfully",
      result,
    });
  });
});

app.post("/addShift", (req, res) => {
  console.log(req.body);
  const shiftName = req.body.shiftName;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const lateAfter = req.body.lateAfter;
  const halfdayAfter = req.body.halfdayAfter;

  const sql = `INSERT INTO shift_master (shift_name, start_time, end_time, late_after, half_day_after) VALUES (?, ?, ?, ?, ?)`;

  pool.query(
    sql,
    [shiftName, startTime, endTime, lateAfter, halfdayAfter],
    (err, result) => {
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
        message: "Added Successfully",
      });
    },
  );
});

app.get("/fetch-shifts", (req, res) => {
  const status = req.query.status;

  let sql = `SELECT * FROM shift_master`;
  const params = [];

  if (status === "Active" || status === "Inactive") {
    sql = `
        SELECT * FROM shift_master
        WHERE status = ?
      `;
    params.push(status);
  }

  pool.query(sql, params, (err, result) => {
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

app.put("/updateShift/:id", (req, res) => {
  const id = req.params.id;
  const shiftName = req.body.shiftName;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const lateAfter = req.body.lateAfter;
  const halfdayAfter = req.body.halfdayAfter;

  const sql = `
      UPDATE shift_master
      SET shift_name = ?,
          start_time = ?,
          end_time = ?,
          late_after = ?,
          half_day_after = ?
      WHERE id = ?
    `;

  const params = [shiftName, startTime, endTime, lateAfter, halfdayAfter, id];

  pool.query(sql, params, (err, result) => {
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
      message: "Shift Updated Successfully",
    });
  });
});

app.put("/updateShiftStatus/:id", (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  const sql = `
      UPDATE shift_master
      SET status = ?
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
  const status = req.query.status;

  let sql = `SELECT * FROM roles`;
  const params = [];

  if (status === "Active" || status === "Inactive") {
    sql = `
        SELECT * FROM roles
        WHERE status = ?
      `;

    params.push(status);
  }

  pool.query(sql, params, (err, result) => {
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

app.put("/updateRole/:id", (req, res) => {
  const id = req.params.id;
  const RoleName = req.body.RoleName;
  const Desc = req.body.Desc;

  const sql = `
      UPDATE roles
      SET role_name = ?,
      description = ?
      WHERE id = ?
    `;

  pool.query(sql, [RoleName, Desc, id], (err, result) => {
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
      message: "Role Updated Successfully",
    });
  });
});

app.put("/updateRoleStatus/:id", (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  const sql = `
      UPDATE roles
      SET status = ?
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
    });
  });
});

app.post("/addNewEmployee", employeePhotoUpload.single("photo"), (req, res) => {
  console.log(req.body);
  console.log(req.file);//this will show cloudinaryuploads details

  const employeeForm = req.body;
  const cloudinaryUrl = req.file ? req.file.path: null;



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
      employee_uan_no,
      photo_url
    )
    
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
      cloudinaryUrl,
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
        url: cloudinaryUrl
      });
    },
  );
});

app.put(
  "/updateEmployee/:id",
  employeePhotoUpload.single("photo"),
  (req, res) => {
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
    const photoUrl = req.file
      ? req.file.path
      : req.body.photo_url || null;

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
      employee_uan_no = ?,
      photo_url = ?
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
        photoUrl,
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
  },
);

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


// This API fetch All employees from database
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

//This api checks employee Active or not
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

    

    // Also use promisePool.query for async/await
    const [rows] = await promisePool.query(
      `SELECT * FROM attendance WHERE employee_id = ? AND attendance_date >= CURDATE() AND attendance_date < CURDATE() + INTERVAL 1 DAY ORDER BY id DESC LIMIT 1`,
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

// ============================================
// POST /wfh-request — Submit a Work From Home request
// Why: Employee applies for WFH from the mobile app.
// Body: { employee_id, start_date, end_date, reason }
// Flow: Validates fields → inserts into work_from_home_requests table → returns success
// ============================================
app.post("/wfh-request", async (req, res) => {
  try {
    const { employee_id, start_date, end_date, reason } = req.body;

    // ---- Validation ----
    if (!employee_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: "employee_id, start_date, and end_date are required",
      });
    }

    // Insert the WFH request with status = 'PENDING' by default
    const [result] = await promisePool.query(
      `INSERT INTO work_from_home_requests (employee_id, start_date, end_date, reason)
       VALUES (?, ?, ?, ?)`,
      [employee_id, start_date, end_date, reason || null],
    );

    return res.status(201).json({
      success: true,
      message: "WFH request submitted successfully",
      requestId: result.insertId,
    });
  } catch (err) {
    console.error("WFH Request Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// GET /pending-approvals/:managerId
// Why: Returns all pending WFH + Leave requests from employees
//      whose reporting_manager_id matches the given manager.
// Flow: Manager opens Approvals screen → app calls this endpoint →
//       backend queries both work_from_home_requests and
//       leave_applications where status = 'PENDING' and the
//       employee's reporting_manager = this manager.
// Returns: Array of requests with a "type" field ('WFH' or 'LEAVE')
// ============================================
app.get("/pending-approvals/:managerId", async (req, res) => {
  try {
    const { managerId } = req.params;

    // Fetch pending WFH requests from subordinates
    const [wfhRequests] = await promisePool.query(
      `SELECT wfr.id, wfr.employee_id, wfr.start_date, wfr.end_date,
              wfr.reason, wfr.status, wfr.created_at,
              em.employee_name, em.employee_code
       FROM work_from_home_requests wfr
       JOIN employee_master em ON em.id = wfr.employee_id
       WHERE em.reporting_manager_id = ?
         AND wfr.status = 'PENDING'
       ORDER BY wfr.created_at DESC`,
      [managerId],
    );

    // Fetch pending Leave requests from subordinates
    const [leaveRequests] = await promisePool.query(
      `SELECT la.id, la.employee_id, la.from_date AS start_date,
              la.to_date AS end_date, la.reason, la.status, la.created_at,
              em.employee_name, em.employee_code,
              lt.leave_name AS leave_type_name
       FROM leave_applications la
       JOIN employee_master em ON em.id = la.employee_id
       JOIN leave_types lt ON lt.id = la.leave_type_id
       WHERE em.reporting_manager_id = ?
         AND la.status = 'PENDING'
       ORDER BY la.created_at DESC`,
      [managerId],
    );

    // Tag each request with its type so frontend can distinguish them
    const taggedWfh = wfhRequests.map((r) => ({ ...r, requestType: "WFH" }));
    const taggedLeave = leaveRequests.map((r) => ({
      ...r,
      requestType: "LEAVE",
    }));

    // Combine both arrays into a single response
    const allPending = [...taggedWfh, ...taggedLeave];

    // Sort by created_at descending (newest first)
    allPending.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.json({
      success: true,
      count: allPending.length,
      requests: allPending,
    });
  } catch (err) {
    console.error("Pending Approvals Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// PUT /wfh-request/:id/approve
// Why: Manager approves or rejects a WFH request.
// Body: { status: "APPROVED" | "REJECTED", approved_by: <manager_employee_id> }
// Flow: Frontend sends status + manager's ID → backend verifies
//       the manager IS the reporting manager of the requesting employee →
//       updates the request status, approved_by, and approved_on.
// ============================================
app.put("/wfh-request/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approved_by } = req.body; // "APPROVED" or "REJECTED"

    // ---- Validate status ----
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be APPROVED or REJECTED",
      });
    }

    // ---- Validate approved_by ----
    if (!approved_by) {
      return res.status(400).json({
        success: false,
        error: "approved_by (manager employee ID) is required",
      });
    }

    // ---- Fetch the WFH request along with the employee's reporting manager ----
    const [requests] = await promisePool.query(
      `SELECT wfr.*, em.reporting_manager_id, em.employee_name AS employee_name
       FROM work_from_home_requests wfr
       JOIN employee_master em ON em.id = wfr.employee_id
       WHERE wfr.id = ?`,
      [id],
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        error: "WFH request not found",
      });
    }

    const request = requests[0];

    // ---- Check if already processed ----
    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        error: `This request is already ${request.status.toLowerCase()}`,
      });
    }

    // ---- Hierarchy check: only the reporting manager can approve ----
    if (request.reporting_manager_id !== parseInt(approved_by)) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to approve this request",
      });
    }

    // ---- Update the request ----
    await promisePool.query(
      `UPDATE work_from_home_requests
       SET status = ?, approved_by = ?, approved_on = NOW()
       WHERE id = ?`,
      [status, approved_by, id],
    );

    // ---- Fetch the updated record to return ----
    const [updated] = await promisePool.query(
      `SELECT wfr.*, em.employee_name, ap.employee_name AS approved_by_name
       FROM work_from_home_requests wfr
       JOIN employee_master em ON em.id = wfr.employee_id
       LEFT JOIN employee_master ap ON ap.id = wfr.approved_by
       WHERE wfr.id = ?`,
      [id],
    );

    return res.json({
      success: true,
      message: `WFH request ${status.toLowerCase()} successfully`,
      data: updated[0],
    });
  } catch (err) {
    console.error("WFH Approve Error:", err);
    return res.status(500).json({ success: false, error: err.message });
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
      `SELECT * FROM attendance WHERE employee_id = ? AND attendance_date >= CURDATE() AND attendance_date < CURDATE() + INTERVAL 1 DAY`,
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
    const shiftSQL=  `SELECT s.start_time, s.late_after, s.half_day_after FROM employee_master e JOIN shift_master s ON e.shift_id= s.id WHERE e.id=?`
    const [shiftData]= await promisePool.query(shiftSQL, [employee_id]);
    if(shiftData.length===0){
      return res.status(400).json({
        success: false,
        message: "Shift not assigned to employee"
      })
    }

    const shift= shiftData[0];
    /*
     * Why: Determine if employee is late by comparing actual punch-in time
     * against the shift's late_after threshold (e.g. 09:15).
     * If punch-in > late_after → is_late=true, late_minutes = minutes past start_time.
     * If punch-in >= half_day_after → status = "HALF DAY".
     */
    let status= "PRESENT";
    let is_late= false;
    let late_minutes= 0;

    const punchInTime= new Date();
    if (shift.late_after) {
      const [lateHour, lateMinute]= shift.late_after.split(":");
      const lateThreshold= new Date();
      lateThreshold.setHours(parseInt(lateHour), parseInt(lateMinute), 0, 0);

      if (punchInTime > lateThreshold) {
        is_late= true;
        // Why: Store total minutes late relative to shift start (not late_after)
        // so admin can display "X hours Y minutes" or "Z mins late".
        if (shift.start_time) {
          const [startHour, startMinute]= shift.start_time.split(":");
          const shiftStart= new Date();
          shiftStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
          late_minutes= Math.round((punchInTime - shiftStart) / 60000);
        }
      }
    }

    // Why: If punch-in is at or after half_day_after time, mark as HALF DAY
    if (shift.half_day_after) {
      const [halfHour, halfMinute]= shift.half_day_after.split(":");
      const halfDayThreshold= new Date();
      halfDayThreshold.setHours(parseInt(halfHour), parseInt(halfMinute), 0, 0);

      if (punchInTime >= halfDayThreshold) {
        status= "HALF DAY";
      }
    }

    const selfiePath = `/uploads/${req.file.filename}`;

    const [result] = await promisePool.query(
      `INSERT INTO attendance
       (employee_id, attendance_date, punch_in, punch_in_selfie, punch_in_latitude, punch_in_longitude, gps_location, attendance_mode, office_location_id, status, late_minutes, is_late)
       VALUES (?, CURDATE(), CURTIME(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_id,
        selfiePath,
        latitude,
        longitude,
        readable_address || "",
        attendance_mode || "OFFICE",
        office_location_id || null,
        status,
        late_minutes,
        is_late,
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

app.get("/fetchAttendance", async (req, res) => {
  try {
    const [rows] =
      await promisePool.query(`SELECT a.*, e.employee_name, e.employee_code, ds.designation_name, d.department_name FROM attendance a
  LEFT JOIN employee_master e ON a.employee_id= e.id
  LEFT JOIN designations ds ON e.designation_id= ds.id
  LEFT JOIN departments d ON e.department_id= d.id
  `);

    const formattedRows = rows.map((row) => ({
      ...row,
      attendance_date: row.attendance_date
        ? row.attendance_date.toLocaleDateString("en-CA")
        : null,
    }));
    // only for debugging purpose-- rows are coming or not and correct data coming from db.
    console.log(formattedRows);
    return res.json({
      success: true,
      message: "Attendance Fetch Successfully",
      result: formattedRows,
    });
  } catch (err) {
    console.log("Ftech Attendance API Error:---->", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
});

// ============================================
// GET /attendance/:employeeId/:month/:year — monthly attendance dates for calendar dots
// ============================================
app.get("/attendance/:employeeId/:month/:year", async (req, res) => {
  const { employeeId, month, year } = req.params;
  try {
    // Fetch distinct attendance dates for the given employee in the given month/year
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const [rows] = await promisePool.query(
      `SELECT DISTINCT DAY(attendance_date) AS day 
       FROM attendance 
       WHERE employee_id = ? 
         AND attendance_date >= ? 
         AND attendance_date < DATE_ADD(?, INTERVAL 1 MONTH)`,
      [employeeId, monthStart, monthStart]
    );
    // Fetch joining date to avoid marking dates before joining as absent
    const [empRows] = await promisePool.query(
      `SELECT employee_joining_date FROM employee_master WHERE id = ?`,
      [employeeId]
    );
    const joiningDate = empRows.length > 0 ? empRows[0].employee_joining_date : null;
    // Extract just the day numbers (e.g., [1, 3, 5, ...])
    const dates = rows.map((r) => r.day);
    // Format joining date manually (YYYY-MM-DD) to avoid toISOString timezone shift
    let joiningDateStr = null;
    if (joiningDate) {
      const dt = new Date(joiningDate);
      joiningDateStr = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    }
    res.json({
      success: true,
      dates,
      joiningDate: joiningDateStr,
    });
  } catch (error) {
    console.log("Monthly Attendance Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// GET /attendance/report/:employeeId/:month/:year — detailed monthly report for admin
// Returns attendance records for the given month. Only past dates (up to today)
// are included — future dates are excluded to avoid misleading "absent" entries.
// Date keys are formatted manually (YYYY-MM-DD) to avoid the timezone shift bug
// where toISOString() converts local midnight to previous-day UTC.
// ============================================
app.get("/attendance/report/:employeeId/:month/:year", async (req, res) => {
  const { employeeId, month, year } = req.params;
  try {
    // 1. Get employee info
    const [empRows] = await promisePool.query(
      `SELECT id, employee_name, employee_code FROM employee_master WHERE id = ?`,
      [employeeId]
    );
    if (empRows.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    const employee = empRows[0];

    // 2. Get all attendance records for this employee in the given month
    const [attRows] = await promisePool.query(
      `SELECT attendance_date, punch_in, punch_out, gps_location, status
       FROM attendance 
       WHERE employee_id = ? 
         AND MONTH(attendance_date) = ? 
         AND YEAR(attendance_date) = ?
       ORDER BY attendance_date ASC`,
      [employeeId, parseInt(month), parseInt(year)]
    );

    // 3. Get all holidays in this month
    const [holRows] = await promisePool.query(
      `SELECT holiday_date, holiday_name FROM holidays
       WHERE MONTH(holiday_date) = ? AND YEAR(holiday_date) = ?`,
      [parseInt(month), parseInt(year)]
    );

    // 3b. Get approved leave applications for this employee overlapping the month
    // Used to show leave reason in the report when attendance status is "leave".
    const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = `${year}-${String(month).padStart(2, "0")}-${new Date(parseInt(year), parseInt(month), 0).getDate()}`;
    const [leaveRows] = await promisePool.query(
      `SELECT from_date, to_date, reason FROM leave_applications
       WHERE employee_id = ?
         AND status = 'APPROVED'
         AND from_date <= ? AND to_date >= ?`,
      [employeeId, lastDay, firstDay]
    );

    // Helper: format a Date object as YYYY-MM-DD using LOCAL time methods.
    // MySQL2 returns DATE columns as Date objects created in LOCAL timezone.
    // Using getFullYear/getMonth/getDate (local) preserves the correct calendar date,
    // whereas toISOString() converts to UTC which can shift the day backward
    // for timezones ahead of UTC (e.g., India UTC+5:30 → local June 17 → UTC June 16).
    const formatDate = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const d = String(dt.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    // 4. Build holiday lookup using local date keys
    const holidayMap = {};
    for (const h of holRows) {
      const key = formatDate(h.holiday_date);
      holidayMap[key] = h.holiday_name;
    }

    // 5. Build attendance lookup using local date keys
    const attMap = {};
    for (const a of attRows) {
      const key = formatDate(a.attendance_date);
      attMap[key] = a;
    }

    // 5b. Build leave reason map: dateStr → leaveReason
    // Each leave application can span multiple days (from_date → to_date),
    // so we expand the range and map every date in between to its reason.
    const leaveReasonMap = {};
    for (const l of leaveRows) {
      const from = new Date(l.from_date);
      const to = new Date(l.to_date);
      // Walk day-by-day from from_date to to_date (inclusive)
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const key = formatDate(d);
        leaveReasonMap[key] = l.reason || "Leave";
      }
    }

    // 6. Today's local midnight (for filtering future dates)
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 7. Generate only past days of the month (up to today)
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const days = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, d);
      const dateStr = formatDate(dateObj);
      const dayName = dayNames[dateObj.getDay()];

      // Skip future dates — they haven't happened yet
      if (dateObj > todayLocal) continue;

      const attRecord = attMap[dateStr];
      const holidayName = holidayMap[dateStr];
      const isSunday = dateObj.getDay() === 0;

      let status = "absent";
      let reason = null;

      if (attRecord) {
        status = attRecord.status ? attRecord.status.toLowerCase() : "present";
        // If attendance status is "leave", pull reason from leave application
        if (status === "leave") {
          reason = leaveReasonMap[dateStr] || "Leave";
        }
      } else if (isSunday) {
        reason = "Sunday";
      } else if (holidayName) {
        reason = `Holiday: ${holidayName}`;
      }

      days.push({
        date: dateStr,
        day_name: dayName,
        punch_in: attRecord ? attRecord.punch_in : null,
        punch_out: attRecord ? attRecord.punch_out : null,
        gps_location: attRecord? attRecord.gps_location: null,
        status,
        reason,
        is_sunday: isSunday,
        is_holiday: !!holidayName,
      });
    }

    res.json({
      success: true,
      employee: {
        id: employee.id,
        name: employee.employee_name,
        code: employee.employee_code,
      },
      month: parseInt(month),
      year: parseInt(year),
      totalDays: days.length,
      presentDays: attRows.length,
      absentDays: days.length - attRows.length,
      days,
    });
  } catch (error) {
    console.log("Attendance Report Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { employeeCode, email, password } = req.body;

    if (!employeeCode || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check Employee Record Exits or not in employee master table
    const [checkRecordRows] = await promisePool.query(
      `SELECT id, employee_email_id FROM employee_master WHERE employee_code= ? AND employee_email_id= ?`,
      [employeeCode, email],
    );

    if (checkRecordRows.length === 0) {
      return res.send({
        success: false,
        message: "Employee Record Not found. Pleae contact HR",
      });
    }

    // if employee found
    const employeeId = checkRecordRows[0].id;

    const [userRows] = await promisePool.query(
      `SELECT * FROM users WHERE employee_id= ?`,
      [employeeId],
    );

    if (userRows.length > 0) {
      return res.send({
        success: false,
        message: "Account already exits. Please Login",
      });
    }

    await promisePool.query(
      `INSERT INTO users(employee_id, employee_email, password) VALUES(?,?,?)`,
      [employeeId, email, password],
    );

    return res.send({
      success: true,
      message: "Account Created Successfully... Please login",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const employeeId = req.headers["employee-id"];
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    console.log("Email:", email);
    console.log("Password:", password);

    const [rows] = await promisePool.query(
      `SELECT * FROM users
       WHERE employee_email = ?
       AND password = ?`,
      [email, password],
    );

    console.log("DB Result:", rows);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        id: rows[0].id,
        employee_id: rows[0].employee_id,
        employee_email: rows[0].employee_email,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/profile/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [profileData] = await promisePool.query(
      `SELECT
    employee_master.employee_name,
    employee_master.employee_code,
    employee_master.employee_joining_date,
    employee_master.employee_email_id,
    employee_master.employee_mobile_no,
    employee_master.city,
    employee_master.photo_url,
    employee_master.gender,

    designations.designation_name AS employee_designation,

    departments.department_name AS employee_department

FROM employee_master

LEFT JOIN designations
ON employee_master.designation_id = designations.id

LEFT JOIN departments
ON employee_master.department_id = departments.id

WHERE employee_master.id = ?;`,
      [employeeId],
    );
    if (profileData.length === 0) {
      return res.send({
        success: false,
        message: "DB Error",
      });
    }
    res.json({
      success: true,
      data: profileData[0],
    });
  } catch (err) {
    console.log(err);
    return res.send({
      success: false,
      message: err,
    });
  }
});

//--------------------------------- Leaves ------------------------------------------------------------------------

app.post("/employees/:id/leave-balance", async(req, res)=>{
  const {id}= req.params;

  try{
    //check if employee exit in employtee_master table
    const [employee]= await promisePool.query(`SELECT id FROM employee_master WHERE id=?`,[id]);

    if(employee.length===0){
      return res.send({
        success: false,
        message: "Employee Not Found"
      })
    }

    //check if balance already exitNo Leaves for current financial year
    const now = new Date();
    const currentFY = now.getMonth() >= 3 ? `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}` : `${now.getFullYear() - 1}-${String(now.getFullYear()).slice(-2)}`;
    const [existing]= await promisePool.query(`SELECT id FROM employee_leave_balances WHERE employee_id=? AND financial_year= ?`,[id, currentFY]);

    // Rows check 
    if(existing.length>0){
      return res.status(409).json({
        error: "Leave Balance already exists for this year"
      })
    }

    // defaults
    const [defaults]= await promisePool.query(`SELECT Id.leave_type_id, id.default_days FROM leave_defaults Id JOIN leave_types lt ON lt.id= Id.leave_type_id WHERE Id.is_Active = TRUE AND lt.is_active= TRUE`);

    if(defaults.length===0){
      return res.status(400).json({
        error: "No Leave default configured"
      });
    }

    // Insert Balance
    const values= defaults.map(d=>[id, d.leave_type_id, d.default_days, 0, d.default_days, currentFY]);

    await promisePool.query(`INSERT INTO employee_leave_balances(employee_id, leave_type_id, total_days, used_days, remaining_days, financial_year)VALUES ?`, [values]);


    //Return the created balances
    const [balances]= await promisePool.query(`SELECT elb.*, lt.code, lt.leave_name FROM employee_leave_balances elb JOIN leave_types lt ON lt.id= elb.leave_type_id WHERE elb.employee_id=? AND elb.financial_year=?`, [id, currentFY]);

    res.status(201).json({message: "Leave Balance Assigned", data: balances});
    
  }catch(error){
    res.status(500).json({error: error.message});
  }
  
})

// Fetch Leave balance
app.get("/employees/:id/leave-balance", async(req, res)=>{
  const {id}= req.params;
  const {year}= req.query;

  try{
    const [employee]= await promisePool.query(`SELECT id, employee_email_id FROM employee_master WHERE id= ?`, [id]);

    if(employee.length===0){
      return res.status(404).json({
        error: "Employee Not Found"
      })
    }

    const now = new Date();
    const currentFY = year || (now.getMonth() >= 3 ? `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}` : `${now.getFullYear() - 1}-${String(now.getFullYear()).slice(-2)}`);
    //Fetch Balances with leave type
    const [balances]= await promisePool.query(`SELECT elb.id, elb.total_days, elb.used_days, elb.remaining_days, elb.financial_year, lt.id AS leave_type_id, lt.code, lt.leave_name FROM employee_leave_balances elb JOIN leave_types lt ON lt.id= elb.leave_type_id WHERE elb.employee_id= ? AND elb.financial_year= ? ORDER BY lt.code`,[id, currentFY]);

    if(balances===0){
      return res.status(200).json({
        message: "No Balance found for this year",
        data: [],
        employee: employee[0].name
      });
    }

    //Return response
    res.status(200).json({
      employee: employee[0].name,
      financial_year: currentFY,
      total: balances.reduce((sum, b)=> sum * b.remaining_days, 0),
      leaves: balances
    })
  }catch(error){
    res.status(500).json({
      error: error.message
    });
  }
});


app.post('/leave-applications', async (req, res) => {
  const { employee_id, leave_type_id, from_date, to_date, reason } = req.body;

  try {
    // 1. Validate required fields
    if (!employee_id || !leave_type_id || !from_date || !to_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Calculate total days (inclusive of both dates)
    const from = new Date(from_date);
    const to = new Date(to_date);
    if (to < from) {
      return res.status(400).json({ error: 'to_date must be after from_date' });
    }
    const totalDays = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

    // 3. Check if employee exists
    const [employee] = await promisePool.query(
      'SELECT id FROM employee_master WHERE id = ?', [employee_id]
    );
    if (employee.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // 4. Check if leave type is active
    const [leaveType] = await promisePool.query(
      'SELECT id FROM leave_types WHERE id = ? AND is_active = TRUE', [leave_type_id]
    );
    if (leaveType.length === 0) {
      return res.status(404).json({ error: 'Leave type not found or inactive' });
    }

    // 5. Check for overlapping leave (same date range already applied)
    const [overlap] = await promisePool.query(
      `SELECT id FROM leave_applications 
       WHERE employee_id = ? 
       AND status IN ('PENDING', 'APPROVED')
       AND (
         (from_date <= ? AND to_date >= ?)
         OR (from_date <= ? AND to_date >= ?)
       )`,
      [employee_id, to_date, from_date, from_date, to_date]
    );
    if (overlap.length > 0) {
      return res.status(409).json({ error: 'Leave already applied for this date range' });
    }
    // 6. Check sufficient balance
    const fy = `${from.getFullYear()}-${String(from.getFullYear() + 1).slice(-2)}`;
    const [balance] = await promisePool.query(
      `SELECT remaining_days FROM employee_leave_balances
       WHERE employee_id = ? AND leave_type_id = ? AND financial_year = ?`,
      [employee_id, leave_type_id, fy]
    );

    if (balance.length === 0) {
      return res.status(400).json({ error: 'No leave balance found. Contact admin.' });
    }

    if (balance[0].remaining_days < totalDays) {
      return res.status(400).json({
        error: `Insufficient balance. Available: ${balance[0].remaining_days}, Requested: ${totalDays}`
      });
    }

    // 7. Insert application
    const [result] = await promisePool.query(
      `INSERT INTO leave_applications 
       (employee_id, leave_type_id, from_date, to_date, total_days, reason, status, applied_on)
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING', CURDATE())`,
      [employee_id, leave_type_id, from_date, to_date, totalDays, reason || null]
    );

    // 8. Return created record with joins
    const [application] = await promisePool.query(
      `SELECT la.*, lt.code, lt.leave_name, em.employee_name AS employee_name
       FROM leave_applications la
       JOIN leave_types lt ON lt.id = la.leave_type_id
       JOIN employee_master em ON em.id = la.employee_id
       WHERE la.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ message: 'Leave applied successfully', data: application[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/leave-applications', async (req, res) => {
  const { employee_id, status, page = 1, limit = 20 } = req.query;

  try {
    let where = '1=1';
    const params = [];

    // Filter by employee (optional - admin sees all, employee sees own)
    if (employee_id) {
      where += ' AND la.employee_id = ?';
      params.push(employee_id);
    }

    // Filter by status (optional)
    if (status) {
      where += ' AND la.status = ?';
      params.push(status.toUpperCase());
    }

    const offset = (page - 1) * limit;

    const [applications] = await promisePool.query(
      `SELECT 
        la.id, la.from_date, la.to_date, la.total_days,
        la.reason, la.status, la.applied_on, la.approved_on,
        lt.code, lt.leave_name,
        em.employee_name AS employee_name,
        ap.employee_name AS approved_by_name
      FROM leave_applications la
      JOIN leave_types lt ON lt.id = la.leave_type_id
      JOIN employee_master em ON em.id = la.employee_id
      LEFT JOIN employee_master ap ON ap.id = la.approved_by
      WHERE ${where}
      ORDER BY la.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    // Get total count for pagination
    const [countResult] = await promisePool.query(
      `SELECT COUNT(*) AS total FROM leave_applications la WHERE ${where}`,
      params
    );

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: countResult[0].total,
      totalPages: Math.ceil(countResult[0].total / limit),
      data: applications
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 2. PUT /leave-applications/:id/status — approve/reject (admin)
// ============================================
app.put('/leave-applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, approved_by } = req.body; // "APPROVED" or "REJECTED"

  try {
    // 1. Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
    }

    // 2. Fetch current application
    const [application] = await promisePool.query(
      `SELECT la.*, elb.id AS balance_id, elb.remaining_days, 
              lt.code, em.employee_name AS employee_name
       FROM leave_applications la
       JOIN leave_types lt ON lt.id = la.leave_type_id
       JOIN employee_master em ON em.id = la.employee_id
       LEFT JOIN employee_leave_balances elb 
         ON elb.employee_id = la.employee_id 
         AND elb.leave_type_id = la.leave_type_id
          AND elb.financial_year = CONCAT(
            YEAR(la.from_date) - IF(MONTH(la.from_date) < 4, 1, 0),
            '-',
            RIGHT(YEAR(la.from_date) + IF(MONTH(la.from_date) < 4, 0, 1), 2)
          )
       WHERE la.id = ?`,
      [id]
    );

    if (application.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const app = application[0];

    if (app.status !== 'PENDING') {
      return res.status(400).json({ error: `Already ${app.status.toLowerCase()}` });
    }

    // 3. If approving, deduct from balance
    if (status === 'APPROVED') {
      if (!app.balance_id) {
        return res.status(400).json({ error: 'No leave balance found' });
      }
      if (app.remaining_days < app.total_days) {
        return res.status(400).json({ 
          error: `Insufficient balance. Available: ${app.remaining_days}, Required: ${app.total_days}`
        });
      }

      await promisePool.query(
        `UPDATE employee_leave_balances 
         SET used_days = used_days + ?, 
             remaining_days = remaining_days - ?
         WHERE id = ?`,
        [app.total_days, app.total_days, app.balance_id]
      );
    }

    // 4. Update application status
    await promisePool.query(
      `UPDATE leave_applications 
       SET status = ?, approved_by = ?, approved_on = NOW()
       WHERE id = ?`,
      [status, approved_by, id]
    );

    // 5. Return updated record
    const [updated] = await promisePool.query(
      `SELECT la.*, lt.code, lt.leave_name, em.employee_name AS employee_name,
              ap.employee_name AS approved_by_name
       FROM leave_applications la
       JOIN leave_types lt ON lt.id = la.leave_type_id
       JOIN employee_master em ON em.id = la.employee_id
       LEFT JOIN employee_master ap ON ap.id = la.approved_by
       WHERE la.id = ?`,
      [id]
    );

    res.status(200).json({ 
      message: `Leave ${status.toLowerCase()} successfully`,
      data: updated[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 3. POST /leave-adjustments — admin credit/debit override
// ============================================
app.post('/leave-adjustments', async (req, res) => {
  const { employee_id, leave_type_id, adjustment_type, days, reason, adjusted_by } = req.body;

  try {
    // 1. Validate
    if (!employee_id || !leave_type_id || !adjustment_type || !days || !adjusted_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['CREDIT', 'DEBIT'].includes(adjustment_type)) {
      return res.status(400).json({ error: 'Type must be CREDIT or DEBIT' });
    }

    // 2. Get current financial year balance
    const now = new Date();
    const currentFY = now.getMonth() >= 3 ? `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}` : `${now.getFullYear() - 1}-${String(now.getFullYear()).slice(-2)}`;
    const [balance] = await promisePool.query(
      `SELECT id, total_days, used_days, remaining_days 
       FROM employee_leave_balances 
       WHERE employee_id = ? AND leave_type_id = ? AND financial_year = ?`,
      [employee_id, leave_type_id, currentFY]
    );

    if (balance.length === 0) {
      return res.status(400).json({ error: 'No balance found. Auto-assign first.' });
    }

    const bal = balance[0];
    let newTotal = bal.total_days;
    let newRemaining = bal.remaining_days;

    if (adjustment_type === 'CREDIT') {
      newTotal += parseInt(days);
      newRemaining += parseInt(days);
    } else { // DEBIT
      if (bal.remaining_days < days) {
        return res.status(400).json({ error: 'Cannot debit more than remaining days' });
      }
      newRemaining -= parseInt(days);
    }

    // 3. Update balance
    await promisePool.query(
      `UPDATE employee_leave_balances 
       SET total_days = ?, remaining_days = ?
       WHERE id = ?`,
      [newTotal, newRemaining, bal.id]
    );

    // 4. Log adjustment
    const [result] = await promisePool.query(
      `INSERT INTO leave_adjustments 
       (employee_id, leave_type_id, adjustment_type, days, reason, adjusted_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_id, leave_type_id, adjustment_type, days, reason, adjusted_by]
    );

    res.status(201).json({
      message: `${adjustment_type} of ${days} days applied`,
      data: {
        new_total_days: newTotal,
        new_remaining_days: newRemaining
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ============================================
// 4. POST /carry-forward — year-end EL carry-forward
// ============================================
app.post('/carry-forward', async (req, res) => {
  const { from_year, to_year } = req.body; // "2025-2026" → "2026-2027"

  try {
    // 1. Get EL leave type ID
    const [elType] = await promisePool.query(
      `SELECT id FROM leave_types WHERE code = 'EL' AND is_active = TRUE`
    );
    if (elType.length === 0) {
      return res.status(400).json({ error: 'EL leave type not found' });
    }
    const elTypeId = elType[0].id;

    // 2. Get max carry-forward days (from a config table or hardcoded)
    const maxCarryForward = 15; // configurable

    // 3. Get all EL balances for the old year with remaining days > 0
    const [balances] = await promisePool.query(
      `SELECT elb.*, em.employee_name
       FROM employee_leave_balances elb
       JOIN employee_master em ON em.id = elb.employee_id
       WHERE elb.leave_type_id = ? 
         AND elb.financial_year = ?
         AND elb.remaining_days > 0`,
      [elTypeId, from_year]
    );

    if (balances.length === 0) {
      return res.status(200).json({ message: 'No EL balances to carry forward' });
    }

    let carried = 0;

    for (const bal of balances) {
      // 4. Cap carry-forward amount
      const carryDays = Math.min(bal.remaining_days, maxCarryForward);

      if (carryDays <= 0) continue;

      // 5. Check if new year balance already exists
      const [existing] = await promisePool.query(
        `SELECT id FROM employee_leave_balances 
         WHERE employee_id = ? AND leave_type_id = ? AND financial_year = ?`,
        [bal.employee_id, elTypeId, to_year]
      );

      if (existing.length > 0) {
        // Update existing — add carry days to totals
        await promisePool.query(
          `UPDATE employee_leave_balances 
           SET total_days = total_days + ?,
               remaining_days = remaining_days + ?
           WHERE id = ?`,
          [carryDays, carryDays, existing[0].id]
        );
      } else {
        // Create new year balance with default + carry
        const [defaults] = await promisePool.query(
          `SELECT default_days FROM leave_defaults 
           WHERE leave_type_id = ? AND is_Active = TRUE`,
          [elTypeId]
        );
        const defaultDays = defaults.length > 0 ? defaults[0].default_days : 0;

        await promisePool.query(
          `INSERT INTO employee_leave_balances 
           (employee_id, leave_type_id, total_days, used_days, remaining_days, financial_year)
           VALUES (?, ?, ?, 0, ?, ?)`,
          [bal.employee_id, elTypeId, defaultDays + carryDays, defaultDays + carryDays, to_year]
        );
      }

      // 6. Log as adjustment (optional but recommended)
      await promisePool.query(
        `INSERT INTO leave_adjustments 
         (employee_id, leave_type_id, adjustment_type, days, reason, adjusted_by)
         VALUES (?, ?, 'CREDIT', ?, 'Carry forward from ' + ?, 0)`,
        [bal.employee_id, elTypeId, carryDays, from_year]
      );

      carried++;
    }

    res.status(200).json({
      message: `Carry-forward completed`,
      employees_updated: carried,
      from: from_year,
      to: to_year
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server Listening Port ${port}`);
});
