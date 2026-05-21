const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

// why used this because
//Multiple Connections, Faste, Production Standard, Handles Many Requests
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "]v>GK68Gxyz8A3y",
  database: "attendease_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/addDepartmentName", (req, res) => {
  console.log(req.body);
  const departmentName = req.body.departmentName;

  const sql = `INSERT INTO departments (department_name) VALUES (?)`;
  pool.query(sql, [departmentName], (err, result) => {
    if (err) {
      console.log(err);
      return res.send({ success: false, message: err });
    }

    res.json({
      success: true,
      message: "Department Added Successfully",
    });
  });
});

app.get("/fetch-departments", (req, res) => {
  const sql = `SELECT * FROM departments`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
      });
    }
    res.json({
      success: true,
      message: "Fetched Successfully",
      result,
    });
  });
});
// this api not connected with frontend
app.post("/addDesignation", (req, res) => {
  console.log(req.body);
  const designationName = req.body.designation_name;
  const department_id = req.body.department_id;

  const sql = `INSERT INTO designations(designation_name, department_id) VALUES(?,?)`;

  pool.query(sql, [designationName, department_id], (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
      });
    }
    res.json({
      success: true,
      message: "Data Saved Successfully",
    });
  });
});

// this api not conneted with frontend
app.get("/fetch-designation", (req, res) => {
  const sql = `
      SELECT designations.*, departments.department_name AS department
      FROM designations
      LEFT JOIN departments ON designations.department_id = departments.id
    `;

  pool.query(sql, (err, result) => {
    if (err) {
      res.send({
        success: false,
        message: err,
      });
    }
    res.json({
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
    [branchName, address, state, city, pincode],
    (err, result) => {
      if (err) {
        return res.send({
          success: false,
          message: err,
        });
        console.log(err);
      }
      res.json({
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
      return res.send({
        success: false,
        message: err,
      });
      console.log(err);
    }
    res.json({
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
        return res.send({
          success: true,
          message: "Added Successfully",
        });
      }
    },
  );
});

app.get("/fetch-shifts", (req, res) => {
  const sql = `SELECT * FROM shift_master`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
      });
    }
    res.json({
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
      return res.send({
        success: false,
        message: err,
      });
    }
    res.json({
      success: true,
      message: "Holidays Added Suceessfully",
    });
  });
});

app.get("/fetch-holidays", (req, res) => {
  const sql = `SELECT * FROM holidays`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
      });
    }
    res.json({
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
      returnres.send({
        success: false,
        message: err,
      });
    }

    res.json({
      success: true,
      message: "Data Added Successfully",
    });
  });
});

app.get("/fetch-roles", (req, res) => {
  const sql = `SELECT * FROM roles`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: err,
      });
    }
    res.json({
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

        return res.send({
          success: false,
          message: err,
        });
      }

      res.json({
        success: true,
        message: "Data Added Successfully",
      });
    },
  );
});

app.get("/fetch-employees", (req, res) => {
  //pagnition fuctioanlity logic

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `SELECT employee_master.*,
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

  const countSql = `SELECT COUNT(*) AS totalEmployees FROM employee_master`;

  pool.query(sql, [limit, offset], (err, result) => {
    if (err) {
      console.log(err);
      return res.send({
        success: false,
        message: err,
      });
    }
    pool.query(countSql, (err, countResult) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: err,
        });
      }
      const totalCount = countResult[0].totalEmployees;

      res.json({
        success: true,
        message: "Fetching Employees",
        totalEmployees: totalCount,
        result,
      });
    });
  });
});

app.post("/dailyAttendance", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server Listening Port ${port}`);
});
