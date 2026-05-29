CREATE DATABASE attendease_database;
USE attendease_database;
-- --------------------------------------Employee Master Table --------------------------------------------------------------------------------
CREATE TABLE employee_master(
id INT PRIMARY KEY AUTO_INCREMENT,
employee_code VARCHAR(100),
employee_name VARCHAR(100),
gender ENUM('Male','Female'),
designation_id INT,
department_id INT,
branch_id INT,
shift_id INT,
role_id INT,
reporting_manager_id INT NULL,
employeement_status ENUM('ACTIVE', 'RESIGNED') DEFAULT 'ACTIVE',
employee_mobile_no VARCHAR(255),
employee_email_id VARCHAR(100),
employee_joining_date DATE,
city VARCHAR(50),
emergency_contact_no VARCHAR(255),
employee_adhar_no VARCHAR(100),
employee_bank_account_no VARCHAR(200),
employee_bank_name VARCHAR(100),
employee_bank_ifsc_code VARCHAR(100),
employee_uan_no VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (role_id)
REFERENCES roles(id),

FOREIGN KEY (department_id)
REFERENCES departments(id),

FOREIGN KEY (designation_id)
REFERENCES designations(id),

FOREIGN KEY (branch_id)
REFERENCES branches(id),

FOREIGN KEY (shift_id)
REFERENCES shift_master(id),

FOREIGN KEY (reporting_manager_id)
REFERENCES employee_master(id)
);

SELECT * FROM employee_master;

ALTER  TABLE employee_master
MODIFY employee_mobile_no varchar(255);

CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE departments
ADD COLUMN status ENUM('Active','Inactive') DEFAULT 'Active';


CREATE TABLE attendance(
id INT PRIMARY KEY AUTO_INCREMENT,

employee_id INT NOT NULL,
attendance_date DATE,
punch_in TIME,
punch_out TIME,
punch_in_selfie VARCHAR(255),
punch_out_selfie VARCHAR(255),
punch_in_latitude DECIMAL(10,8),
punch_in_longitude DECIMAL(11,8),
punch_out_latitude DECIMAL (10,8),
punch_out_longitude DECIMAL(11,8),




status ENUM(
'PRESENT',
'ABSENT',
'LATE',
'HALF DAY',
'LEAVE'
),
late_minutes INT DEFAULT 0,
attendance_mode ENUM(
'OFFICE',
'WFH',
'FIELD'
) DEFAULT 'OFFICE',
remark VARCHAR(255),
late_approved_by INT NULL,
office_location_id INT NOT NULL,
gps_location VARCHAR(100),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (employee_id)
REFERENCES employee_master(id),

FOREIGN KEY (late_approved_by)  -- --Temporary Based
REFERENCES roles(id),

FOREIGN KEY (office_location_id)
REFERENCES office_locations(id)

);

ALTER TABLE attendance
ADD COLUMN punch_in_selfie VARCHAR(255),
ADD COLUMN punch_out_selfie VARCHAR(255),
ADD COLUMN punch_in_latitude DECIMAL(10,8),
ADD COLUMN punch_in_longitude DECIMAL(11,8),
ADD COLUMN punch_out_latitude DECIMAL (10,8),
ADD COLUMN punch_out_longitude DECIMAL(11,8);

DROP TABLE attendance;

SELECT * FROM attendance;
SELECT * FROM departments;

SHOW CREATE TABLE designations;

CREATE TABLE designations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    designation_name VARCHAR(100) NOT NULL,
    department_id INT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

ALTER TABLE designations
ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active',
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

SELECT * FROM designations;


CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE roles
ADD COLUMN status ENUM('Active','Inactive') DEFAULT 'Active';
	

CREATE TABLE branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    branch_name VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE branches
ADD COLUMN status ENUM('Active','Inactive') DEFAULT 'Active';

SELECT * FROM branches;
DELETE FROM branches where id = 2;


CREATE TABLE office_locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    branch_id INT,
    office_name VARCHAR(100),
    
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    allowed_radius INT DEFAULT 100,
    
    FOREIGN KEY (branch_id)
    REFERENCES branches(id)
    ON DELETE CASCADE
);


SELECT * FROM office_locations;

UPDATE office_locations
SET allowed_radius = 40000
WHERE id=2;


CREATE TABLE holidays(
id INT PRIMARY KEY AUTO_INCREMENT,
holiday_date DATE UNIQUE,
holiday_name VARCHAR(200),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT * FROM holidays;
delete FROM holidays;

SET SQL_SAFE_UPDATES = 0;
CREATE TABLE shift_master (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    shift_name VARCHAR(50),
    
    start_time TIME,
    end_time TIME,
    
    late_after TIME,
    half_day_after TIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE shift_master
ADD COLUMN status ENUM('Active','Inactive') DEFAULT 'Active';


SELECT * FROM shift_master;
