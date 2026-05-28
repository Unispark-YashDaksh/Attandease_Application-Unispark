-- ==========================================
-- SEED DATA for Attendance Management System
-- Run this AFTER the main schema is created
-- ==========================================

-- 1. Add a test branch (if not exists)
INSERT INTO branches (branch_name, address, city, state, pincode) 
VALUES ('Noida Branch', 'The Berry Co Works, Sector 142', 'Noida', 'Uttar Pradesh', '244001');

-- 2. Add office location (lat/lng for Noida Sector 142)
--    allowed_radius = 500 meters (geo-fencing)
INSERT INTO office_locations (branch_id, office_name, latitude, longitude, allowed_radius)
VALUES (LAST_INSERT_ID(), 'Noida Office (The Berry Co Works)', 28.593572, 77.445044, 500);

-- 3. Add a shift
INSERT INTO shift_master (shift_name, start_time, end_time, late_after, half_day_after)
VALUES ('General Shift', '09:00:00', '18:00:00', '09:30:00', '13:00:00');

-- 4. Add departments
INSERT INTO departments (department_name) VALUES ('Engineering'), ('HR'), ('Sales');

-- 5. Add designations
INSERT INTO designations (designation_name, department_id) VALUES ('Software Engineer', 1), ('Senior Developer', 1), ('HR Manager', 2);

-- 6. Add roles
INSERT INTO roles (role_name, description) VALUES ('Employee', 'Regular Employee'), ('Admin', 'System Administrator'), ('Manager', 'Team Manager');

-- 7. Add test employee (employee_id will be 1)
INSERT INTO employee_master (
    employee_code, employee_name, gender, 
    designation_id, department_id, branch_id, shift_id, role_id,
    employeement_status, employee_mobile_no, employee_email_id, 
    employee_joining_date, city
) VALUES (
    'EMP001', 'Test Employee', 'Male',
    1, 1, 1, 1, 1,
    'ACTIVE', 9876543210, 'test@sparkhr.com',
    '2025-01-01', 'Noida'
);

-- ==========================================
-- VERIFICATION QUERIES (run after seeding)
-- ==========================================
-- SELECT * FROM employee_master;
-- SELECT * FROM office_locations;
-- SELECT * FROM branches;
