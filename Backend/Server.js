const express= require("express");
const mysql= require("mysql2")
const cors= require("cors");

const app= express();
const port= 8081;

app.use(cors())
app.use(express.json())

// why used this because 
//Multiple Connections, Faste, Production Standard, Handles Many Requests
const pool= mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Unispark@2022",
    database: "attendease_database",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


app.post("/addDepartmentName", (req, res)=>{
    console.log(req.body)
    const departmentName= req.body.departmentName;

    const sql= `INSERT INTO departments (department_name) VALUES (?)`
    pool.query(sql, [departmentName], (err, result)=>{
        if(err){
            console.log(err);
            return res.send({success: false, message: err})
        }

        res.json({
            success:  true,
            message: "Department Added Successfully"
        }
        )
    })

})

app.get("/fetch-departments", (req, res)=>{
    const sql= `SELECT * FROM departments`

    pool.query(sql,(err, result)=>{
        if(err){
            return res.send({
                success: false,
                message: err
            })
        }
        res.json({
            success: true,
            message: "Fetched Successfully",
            result
        })
    
    })
})

app.post("/addBranch", (req, res)=>{
    console.log(req.body)
    const branchName= req.body.branchName;
    const address= req.body.address;
    const city= req.body.city;
    const state= req.body.state;
    const pincode= req.body.pincode;

    const sql= `INSERT INTO branches (branch_name, address, city, state, pincode) VALUES(?,?,?,?,?)`;
    pool.query(sql,[branchName, address, state, city, pincode], (err, result)=>{
        if(err){
            return res.send({
                success: false,
                message: err
            })
            console.log(err)
        }
        res.json({
            success: true,
            message: "Data Added Successfully",
        })
    })
    
})

app.get("/fetch-branches", (req, res)=>{
    const sql= `SELECT * FROM branches;`

    pool.query(sql, (err, result)=>{
        if(err){
            return res.send({
                success: false,
                message: err
            })
            console.log(err)
        }
        res.json({
            success: true,
            message: "Fetch Successfully",
            result
        })
    })
})

app.post("/addShift", (req, res)=>{
    console.log(req.body)
    const shiftName= req.body.shiftName;
    const startTime= req.body.startTime;
    const endTime= req.body.endTime;
    const lateafter= req.body.lateafter;
    const halfdayAfter= req.body.halfdayAfter;

    const sql= `INSERT INTO shift_master (shift_name, start_time, end_time, late_after, half_day_after) VALUES (?, ?, ?, ?, ?)`

    pool.query(sql, [shiftName, startTime, endTime, lateafter, halfdayAfter], (err, result)=>{
        if(err){
            return(res.send({
                success: true,
                message: "Added Successfully"
            }))
        }
    })

})

app.get("/fetch-shifts", (req, res)=>{
    const sql= `SELECT * FROM shift_master`;

    pool.query(sql, (err, result)=>{
        if(err){
            return res.send({
                success: false,
                message: err
            })
        }
        res.json({
            success: true,
            message: "Fetch Successfully",
            result
        })
    })

})

app.post("/addHolidays", (req, res)=>{
    console.log(req.body);
    const holidayDate= req.body.holidayDate;
    const holidayName= req.body.holidayName;

    const sql= `INSERT INTO holidays (holiday_date, holiday_name) VALUES (?, ?)`;

    pool.query(sql, [holidayDate, holidayName], (err, result)=>{
        if(err){
            return res.send({
                success: false,
                message: err
            })
        }
        res.json({
            success: true,
            message: "Holidays Added Suceessfully"
        })
    })
})

app.get("/fetch-holidays", (req, res)=>{
    const sql= `SELECT * FROM holidays`

    pool.query(sql, (err, result)=>{
        if(err){
            return res.send({
                success: false,
                message: err
            })
        }
        res.json({
            success: true,
            message: "Fetch Successfully",
            result
        })
    })
})

app.post("/addRole", (req, res)=>{
    console.log(req.body);
    const RoleName= req.body.RoleName;
    const Desc= req.body.Desc;

    const sql= `INSERT INTO roles(role_name, description) VALUES (?,?)`;

    pool.query(sql, [RoleName, Desc], (err, result)=>{
            if(err){
                returnres.send({
                    success: false,
                    message: err
                })
            }

            res.json({
                success: true,
                message: "Data Added Successfully"
            })
    })
});

app.get("/fetch-roles", (req, res)=>{
    const sql= `SELECT * FROM roles`;

    pool.query(sql, (err, result)=>{
        if(err){
            return res.send({
                success: false,
                message: err
            })
            
        }
        res.json({
            success: true,
            message: "Data Fetch Successfully",
            result
        })
    })
})
app.listen(port, ()=>{
    console.log(`Server Listening Port ${port}`)
})