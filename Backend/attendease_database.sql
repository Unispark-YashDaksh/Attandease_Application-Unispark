
CREATE DATABASE attendease_database;
USE attendease_database;


CREATE TABLE users(
id INT PRIMARY KEY AUTO_INCREMENT,
employee_id INT NOT NULL UNIQUE,
employee_email VARCHAR(50),
password VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (employee_id)
REFERENCES employee_master(id)

);

SELECT * FROM users;
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
photo_url VARCHAR(255),
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


ALTER TABLE employee_master
ADD COLUMN photo_url VARCHAR(255);
SELECT * FROM employee_master;
DELETE FROM employee_master WHERE id= 2;
ALTER  TABLE employee_master
MODIFY employee_mobile_no varchar(255);

CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE departments
ADD COLUMN status ENUM('Active','Inactive') DEFAULT 'Active';

SELECT * FROM departments;

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
'HALF DAY',
'LEAVE'
),
late_minutes INT DEFAULT 0,
is_late BOOLEAN DEFAULT false,
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
ADD COLUMN is_late BOOLEAN DEFAULT false;

 

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
    status ENUM('Active','Inactive') DEFAULT 'Active',
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
    status ENUM('Active','Inactive') DEFAULT 'Active',
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
INSERT INTO office_locations(branch_id, office_name, latitude, longitude, allowed_radius  ) VALUES(1,"Noida Office", 28.499718, 77.414824, 500);
UPDATE office_locations
SET latitude = 28.4997222
WHERE id=1;


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
    status ENUM('Active','Inactive') DEFAULT 'Active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE shift_master
ADD COLUMN status ENUM('Active','Inactive') DEFAULT 'Active';


SELECT * FROM shift_master;


CREATE TABLE leave_types(
id INT PRIMARY KEY AUTO_INCREMENT,
leave_name ENUM("Sick Leave", "Casual Leave", "Earn Leave") NOT NULL,
code ENUM("SL", "CL", "EL") NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_defaults(
id INT PRIMARY KEY AUTO_INCREMENT,
leave_type_id INT NOT NULL,
default_days INT,
financial_year VARCHAR(10),
is_Active BOOLEAN,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (leave_type_id)
REFERENCES leave_types(id)
);

CREATE TABLE employee_leave_balances(
id INT PRIMARY KEY AUTO_INCREMENT,
employee_id INT NOT NULL,
leave_type_id INT,
total_days INT,
used_days INT,
remaining_days INT,
financial_year VARCHAR(10),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

FOREIGN KEY (employee_id)
REFERENCES employee_master(id),

FOREIGN KEY (leave_type_id)
REFERENCES leave_types(id)
);

CREATE TABLE leave_applications(
id INT PRIMARY KEY AUTO_INCREMENT,
employee_id INT NOT NULL,
leave_type_id INT NOT NULL,
from_date DATE,
to_date DATE,
total_days INT,
reason TEXT,
status ENUM("PENDING", "APPROVED", "REJECTED") DEFAULT "PENDING",
applied_on DATE,
approved_by INT,
approved_on TIMESTAMP NULL,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (employee_id)
REFERENCES employee_master(id),

FOREIGN KEY (leave_type_id)
REFERENCES leave_types(id),

FOREIGN KEY (approved_by)
REFERENCES employee_master(id)
);

CREATE TABLE leave_adjustments(
id INT PRIMARY KEY AUTO_INCREMENT,
employee_id INT NOT NULL,
leave_type_id INT NOT NULL,
adjustment_type ENUM("CREDIT", "DEBIT"),
days INT,
reason VARCHAR(255),
adjusted_by INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (employee_id)
REFERENCES employee_master(id),

FOREIGN KEY (leave_type_id)
REFERENCES leave_types(id),

FOREIGN KEY (adjusted_by)
REFERENCES employee_master(id)
);
CREATE TABLE work_from_home_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id)
    REFERENCES employee_master(id)
    ON DELETE CASCADE
);

SELECT * FROM work_from_home_requests;
SELECT attendance_date,
       DATE(attendance_date),
       CURDATE()
FROM attendance
WHERE employee_id = 11;

SHOW COLUMNS FROM attendance;


SELECT attendance_date
FROM attendance
WHERE id = 7;

DELETE FROM attendance WHERE id= 7;