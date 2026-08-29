require("dotenv").config();
const bcryptjs = require("bcryptjs");
const mysql2 = require("mysql2")
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "attendease_database",
  waitForConnections: true,
  connectionLimit: 150,
  queueLimit: 0,
});

const promisePool = pool.promise();

async function addAdmin() {
  try {
    const rl = readline.createInterface({ input, output });
    const employeeCode = await rl.question("Employee Code: ");

    if (!employeeCode) {
      console.error({
        success: false,
        message: "Employee Code is required",
      });
      return
    }

    const [fetchEmployee] = await promisePool.query(
      `
    SELECT id, employee_name, employee_email_id, role_id 
    FROM employee_master 
    WHERE employee_code = ?`,
      [employeeCode],
    );
    if (fetchEmployee.length === 0) {
      console.error({
        success: false,
        message: "Employee Record Not found. Please contact HR",
      });
      return
    }

    const employeeId = fetchEmployee[0].id;

    const [fetchAdmin] = await promisePool.query(
      `SELECT id, employee_name
    FROM admins
    WHERE employee_id = ?`,
      [employeeId],
    );

    if (fetchAdmin.length > 0) {
      console.error({
        success: false,
        message: "Account already exits. Please Login",
      });
      return
    }

    const employeeName = fetchEmployee[0].employee_name;
    const employeeEmailId = fetchEmployee[0].employee_email_id;
    const roleId = fetchEmployee[0].role_id;

    const adminId = await rl.question("AdminId: ");
    const password = await rl.question("Password: ");
    rl.close();

    const hashedPassword = bcryptjs.hashSync(password, 10);

    await promisePool.query(
      `INSERT INTO admins(admin_id, employee_id, employee_name, employee_email, password, role_id) VALUES(?,?,?,?,?,?)`,
      [
        adminId,
        employeeId,
        employeeName,
        employeeEmailId,
        hashedPassword,
        roleId,
      ],
    );

    console.log({
      success: true,
      message: "Account Created Successfully... Please login",
    });
  } catch (error) {
    console.error({
      success: false,
      message: error.message,
    });
    return
  } finally {
    pool.end()
  }
}


addAdmin()