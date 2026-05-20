import React, { useEffect, useState } from "react";
import axios from "axios";
import { data } from "react-router-dom";


function Department(){
    const [showInputRow, setShowInputRow]= useState(false); // this state manage hide /unhide add department button 
    const [departmentName, setDepartmentName]= useState(""); // this state update / store in Virtual Dom and store current value.
    const [allDepartments, setAllDepartments]= useState([]);

// fetch all data with get api
    const fetchDepartments= async()=>{
         const response = await axios.get(`http://localhost:8081/fetch-departments`)

         setAllDepartments(response.data.result)
        }

        
    useEffect(()=>{
        fetchDepartments();
    },[])
    
    const handleAddDepartment= async()=>{
        try{
            await axios.post(`http://localhost:8081/addDepartmentName`,{
            departmentName
        })
        }catch(err){
            console.log(err)
        }
        setShowInputRow(false)
    }
    
    return(
        <div className="mt-5" style={{border: "1px solid black", height: "400px", width: "100%"}}>
            <div className="mt-5">
                <input type="search" placeholder="Search departments"/>
                <button className="btn btn-primary" onClick={()=>{setShowInputRow(true)}}>+ Add New Department</button>
                <button style={{marginLeft: "2px"}} className="btn btn-primary" onClick={fetchDepartments}>Refresh</button>
            </div>

            <table className="table mt-5">
                <thead>
                    <tr>
                        <th scope="col">Department Name</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    
                       {showInputRow=== true &&  <tr>
                            <td>
                                <div className="input-group mb-3">
                                     <input type="text" className= "form-control" onChange={(event)=>{setDepartmentName(event.target.value)}} />
                                    <button className="btn btn-outline-secondary" type="button" onClick={handleAddDepartment}>Submit</button>
                                </div>
                            </td>
                        </tr>}

                        {
                            allDepartments.map((item)=>{
                                return(
                                    <tr key={item.id}>
                                        <td>{item.department_name}</td>
                                        <td>{item.created_at}</td>
                                        <td>
                                            <button>edit</button>
                                            <button>delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        
                    </tbody>
            </table>
        </div>
    )
}

export default Department;