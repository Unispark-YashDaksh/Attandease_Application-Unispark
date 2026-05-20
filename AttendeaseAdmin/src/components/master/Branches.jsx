import React from "react";
import "../css/Branches.css"
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function Branches(){
    const [branchName, setBranchName]=useState("")
    const [address, setAddress]= useState("");
    const [city, setCity]= useState("");
    const [state, setState]= useState("");
    const [pincode, setPincode]= useState("");
    const [showInputRow, setshowInputRow]= useState(false);
    const [allBranchesData, setAllBranchesData]= useState([])

const fetchBranches= async()=>{
        const response = await axios.get(`http://localhost:8081/fetch-branches`)

        setAllBranchesData(response.data.result)
    }

useEffect(()=>{
    fetchBranches()
},[])

    const handleBranchSubmit= async()=>{
        try{
           await axios.post(`http://localhost:8081/addBranch`,{
                branchName,
                address,
                city,
                state,
                pincode,
            })
        }catch(err){
            console.log(err)
        }
        setshowInputRow(false)
       
    }
    return(
        <div className="mt-5">
            <div style={{display: "flex", justifyContent: "start"}}>
                <div className="active-branch" id="dashboard-cards" style={{marginLeft: "20px"}}></div>
                <div className="active-employee" id="dashboard-cards"></div>
            </div>

             <div className="mt-5" style={{border: "1px solid black", height: "400px", width: "100%"}}>
            <div className="mt-5">
                <input type="search" placeholder="Search shift"/>
                <button className="btn btn-primary" onClick={()=>{setshowInputRow(true)}}>+ Add New Branch</button>
                <button style={{marginLeft: "10px"}} className="btn btn-primary" onClick={fetchBranches}>Refresh</button>
            </div>

            <table className="table mt-5">
                <thead>
                    <tr>
                        <th scope="col">Branch Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                        <th scope="col">Pincode</th>
                        <th scope="col">Action</th>
                        <th scope="col">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {showInputRow=== true &&
                    <tr>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="text" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setBranchName(event.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="text" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setAddress(event.target.value)}}/>
                                   
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="text" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setCity(event.target.value)}} />
                                    
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="text" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setState(event.target.value)}} />
                                 
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                     <input type="text" class="form-control" 
                                     aria-describedby="button-addon2" onChange={(event)=>{setPincode(event.target.value)}} />
                                   
                                </div>
                            </td>
                            <td>
                                <div class="input-group mb-3">
                                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleBranchSubmit} >Submit</button>
                                </div>
                            </td>
                        </tr>
                    
                    }
                         { allBranchesData.map((item)=>{
                            return(
                        <tr key={item.id}>
                            <td>{item.branch_name}</td>
                            <td>{item.address}</td>
                             <td>{item.city}</td>
                              <td>{item.state}</td>
                               <td>{item.pincode}</td> 
                            <td>
                                <button>edit</button>
                                <button>delete</button>
                            </td>
                             <td>{item.created_at}</td>
                        </tr>)
                            })
                         }
                         
                    </tbody>
            </table>
        </div>
        </div>
    )
}

export default Branches;