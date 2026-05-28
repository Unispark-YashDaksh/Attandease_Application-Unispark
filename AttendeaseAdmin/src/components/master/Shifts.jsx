import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

function Shifts(){
    const [showAddShiftInput, setShowAddShiftInput]= useState(false)
    const [shiftName, setShiftName]= useState("");
    const [startTime, setStartTime]= useState("");
    const [endTime, setEndTime]= useState("");
    const [lateafter, setLateAfter]= useState("");
    const [halfdayAfter, setHalfdayAfter]= useState("");
    const [showAllShifts, setShowAllShifts]= useState([])


    useEffect(()=>{
        fetchShifts()
    },[])

    const fetchShifts= async()=>{
        try{
            const response= await axios.get(`http://localhost:7000/fetch-shifts`)

            setShowAllShifts(response.data.result)
        }catch(err){    
            console.log(err)
        }
    }


    const handleSubmitShift=async()=>{
        try{
           await axios.post(`http://localhost:7000/addShift`,{
                shiftName,
                startTime,
                endTime,
                lateafter,
                halfdayAfter

            })
            setShowAddShiftInput(false)
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div>
         <div className="mt-5">
            <div style={{display: "flex", justifyContent: "start"}}>
                <div className="active-branch" id="dashboard-cards" style={{marginLeft: "20px"}}></div>
                <div className="active-employee" id="dashboard-cards"></div>
            </div>

             <div className="mt-5" style={{border: "1px solid black", height: "400px", width: "100%"}}>
            <div className="mt-5">
                <input type="search" placeholder="Search shift"/>
                <button className="btn btn-primary" onClick={()=>{setShowAddShiftInput(true)}}>+ Add New Shift</button>
            </div>

            <table className="table mt-5">
                <thead>
                    <tr>
                        <th scope="col">Shift Name</th>
                        <th scope="col">StartTime</th>
                        <th scope="col">End Time</th>
                        <th scope="col">Late After</th>
                        <th scope="col">Half Day After</th>
                        <th scope="col">Action</th>
                        <th scope="col">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {showAddShiftInput=== true &&
                    
                    <tr>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="text" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setShiftName(event.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type= "time" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setStartTime(event.target.value)}} />
                                   
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="time" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setEndTime(event.target.value)}} />
                                    
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="time" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setLateAfter(event.target.value)}} />
                                 
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="time" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setHalfdayAfter(event.target.value)}}  />
                                   
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSubmitShift} >Submit</button>
                                </div>
                            </td>
                        </tr>
                    
                    }
                         
                         {
                            showAllShifts.map((item)=>{
                                return(
                        <tr key={item.id}>
                            <td>{item.shift_name}</td>
                            <td>{item.start_time}</td>
                             <td>{item.end_time}</td>
                              <td>{item.late_after}</td>
                               <td>{item.half_day_after}</td> 
                            <td>
                                <button>edit</button>
                                <button>delete</button>
                            </td>
                             <td>{item.created_at}</td>
                        </tr>
                                )
                            })
                         }
                    </tbody>
            </table>
        </div>
        </div>
        </div>
    )
}

export default Shifts;