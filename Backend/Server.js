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
    password: "",
    database: "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("MySQL Connected")
    }
})

app.listen(()=>{
    console.log(`Server Listening Port ${port}`)
})