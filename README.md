# Attendease - Attendance Management System

A complete HR attendance system with:
- **Admin Web Panel** – for HR/Admin to manage everything
- **Mobile App** – for employees to mark attendance, apply leaves, etc.
- **Backend API** – powers both apps

---

## Tech Stack

- **Backend:** Node.js + Express.js + MySQL
- **Admin Panel:** React + Vite (runs on browser)
- **Mobile App:** React Native + Expo (runs on phone)

---

## How to Run Locally

### Backend
```bash
cd Backend
npm install
npm start
```
Server runs on `http://localhost:7000`

### Admin Panel
```bash
cd AttendeaseAdmin
npm install
npm run dev
```

### Mobile App
```bash
cd SparkHR-MobileApp
npm install
npx expo start
```

---

# All API Endpoints

Base URL: `http://localhost:7000`

---

## Employee Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/addNewEmployee` | Add a new employee (with photo upload) |
| GET | `/fetch-employees?page=&limit=&status=` | Get list of employees (with pagination, filter by Active/Resigned) |
| GET | `/fetchOneEmployee/:id` | Get details of a single employee |
| GET | `/activeEmployee` | Get list of only Active employees (for dropdowns) |
| PUT | `/updateEmployee/:id` | Update employee details (with photo upload) |
| PUT | `/updateEmployeeStatus/:id` | Change employee status (Active / Resigned) |

### Connected to (Admin Panel):
- **Employees** page → `GET /fetch-employees`, `PUT /updateEmployeeStatus/:id`
- **AddNewEmployeeForm** page → `POST /addNewEmployee`, `PUT /updateEmployee/:id`, `GET /activeEmployee`, `GET /fetch-departments`, `GET /fetch-branches`, `GET /fetch-shifts`, `GET /fetch-roles`, `GET /designationStatus`

---

## Department Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/addDepartmentName` | Add a new department |
| GET | `/fetch-departments?status=` | Get departments (filter by Active/Inactive) |
| PUT | `/updateDepartment/:id` | Update department name |
| PUT | `/updateDepartmentStatus/:id` | Toggle Active/Inactive |

### Connected to (Admin Panel):
- **Department** page → all 4 endpoints above
- **AddNewEmployeeForm** page → `GET /fetch-departments`

---

## Designation Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/addDesignation` | Add a new designation |
| GET | `/fetch-designation?status=` | Get designations (with department name, filter by status) |
| GET | `/designationStatus` | Get only Active designations in Active departments |
| PUT | `/updateDesignation/:id` | Update designation name, department, or status |

### Connected to (Admin Panel):
- **Designation** page → `POST /addDesignation`, `GET /fetch-designation`, `PUT /updateDesignation/:id`
- **AddNewEmployeeForm** page → `GET /designationStatus`

---

## Branch Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/addBranch` | Add a new branch (name, address, city, state, pincode) |
| GET | `/fetch-branches?status=` | Get branches (filter by Active/Inactive) |
| PUT | `/updateBranch/:id` | Update branch details |
| PUT | `/updateBranchStatus/:id` | Toggle Active/Inactive |

### Connected to (Admin Panel):
- **Branches** page → all 4 endpoints above
- **AddNewEmployeeForm** page → `GET /fetch-branches`

---

## Shift Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/addShift` | Add a shift (name, start/end time, late/halfday rules) |
| GET | `/fetch-shifts?status=` | Get shifts (filter by Active/Inactive) |
| PUT | `/updateShift/:id` | Update shift details |
| PUT | `/updateShiftStatus/:id` | Toggle Active/Inactive |

### Connected to (Admin Panel):
- **Shifts** page → all 4 endpoints above
- **AddNewEmployeeForm** page → `GET /fetch-shifts`

---

## Role Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/addRole` | Add a new role (name, description) |
| GET | `/fetch-roles?status=` | Get roles (filter by Active/Inactive) |
| PUT | `/updateRole/:id` | Update role name/description |
| PUT | `/updateRoleStatus/:id` | Toggle Active/Inactive |

### Connected to (Admin Panel):
- **Roles** page → all 4 endpoints above
- **AddNewEmployeeForm** page → `GET /fetch-roles`

---

## Holiday Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/addHolidays` | Add a holiday (date, name) |
| GET | `/fetch-holidays` | Get all holidays |

### Connected to (Admin Panel):
- **HolidaysManagement** page → both endpoints

### Connected to (Mobile App):
- **Apply Leave** screen → `GET /fetch-holidays` (to show holidays while choosing dates)

---

## Attendance

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/attendance` | Check if user can punch in or punch out today |
| POST | `/punch-in` | Mark punch in (with selfie photo + GPS location) |
| POST | `/punch-out` | Mark punch out (with optional selfie) |
| GET | `/fetchAttendance` | Get all attendance records (with employee details) |
| GET | `/attendance/:empId/:month/:year` | Get attendance dates for a month (for calendar view) |
| GET | `/attendance/report/:empId/:month/:year` | Get detailed monthly report (with holidays, leaves, Sundays) |
| GET | `/office-location/:empId` | Get office GPS location for the employee's branch |
| GET | `/wfh-status/:empId` | Check if employee has approved WFH today |

### Connected to (Admin Panel):
- **DailyAttendance** page → `GET /fetchAttendance`
- **AttendanceReport** page → `GET /attendance/report/:empId/:month/:year`, `GET /activeEmployee`

### Connected to (Mobile App):
- **Home** screen → `POST /attendance`, `GET /profile/:empId`
- **Attendance** (Punch In/Out) screen → `POST /attendance`, `POST /punch-in`, `POST /punch-out`, `GET /office-location/:empId`, `GET /wfh-status/:empId`, `GET /attendance/:empId/:month/:year`

---

## Authentication

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/register` | Create account (checks employee code + email match) |
| POST | `/login` | Login with email + password |

### Connected to (Mobile App):
- **Login** screen → `POST /login`
- **Signup** screen → `POST /register`

---

## Profile

| Method | Endpoint | What it does |
|--------|----------|-------------|
| GET | `/profile/:employeeId` | Get employee profile (with designation & department name) |

### Connected to (Mobile App):
- **Home** screen → `GET /profile/:empId`
- **Profile** screen → `GET /profile/:empId`

---

## Leave Management

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/employees/:id/leave-balance` | Assign default leave balance for a financial year |
| GET | `/employees/:id/leave-balance?year=` | Get employee's remaining leave balance |
| POST | `/leave-applications` | Apply for leave (checks over-lap and balance) |
| GET | `/leave-applications?employee_id=&status=&page=&limit=` | Get leave applications (filter employee/status, paginated) |
| PUT | `/leave-applications/:id/status` | Approve or reject a leave application |
| POST | `/leave-adjustments` | Admin can add or remove leave days manually |
| POST | `/carry-forward` | Year-end carry forward of Earned Leave (max 15 days) |

### Connected to (Admin Panel):
- **LeaveManagement** page → all 7 endpoints above

### Connected to (Mobile App):
- **Apply Leave** screen → `GET /employees/:id/leave-balance`, `POST /leave-applications`
- **Leave History** screen → `GET /leave-applications`
- **Approvals** screen → `PUT /leave-applications/:id/status` (for managers to approve/reject)

---

## Work From Home (WFH)

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/wfh-request` | Submit a WFH request |
| GET | `/pending-approvals/:managerId` | Get pending WFH + Leave requests for a manager |
| PUT | `/wfh-request/:id/approve` | Approve or reject a WFH request |

### Connected to (Mobile App):
- **Apply WFH** screen → `POST /wfh-request`
- **Approvals** screen → `GET /pending-approvals/:managerId`, `PUT /wfh-request/:id/approve`

---

## Database Tables

| Table | Stores |
|-------|--------|
| `employee_master` | All employee details |
| `departments` | Department list |
| `designations` | Job titles linked to departments |
| `branches` | Office locations with addresses |
| `shift_master` | Work shift timings and rules |
| `roles` | Employee roles |
| `office_locations` | GPS coordinates for branch geo-fencing |
| `attendance` | Daily punch in/out records |
| `holidays` | Company holiday list |
| `leave_types` | Leave categories (Sick, Casual, Earned) |
| `employee_leave_balances` | Leave balance per employee |
| `leave_applications` | Leave request records |
| `leave_adjustments` | Audit log for manual leave changes |
| `work_from_home_requests` | WFH request records |
| `users` | Login credentials |
