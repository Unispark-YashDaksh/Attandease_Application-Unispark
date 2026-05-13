import React from "react";

function Department(){
    return(
        <div className="mt-5" style={{border: "1px solid black", height: "400px", width: "100%"}}>
            <div className="mt-5">
                <input type="search" placeholder="Search departments"/>
                <button className="btn btn-primary">+ Add New Department</button>
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
                        <tr>
                            <td>HR</td>
                            <td>13-05-2026</td>
                            <td>
                                <button>edit</button>
                                <button>delete</button>
                            </td>
                        </tr>
                         <tr>
                            <td>HR</td>
                            <td>13-05-2026</td>
                            <td>
                                <button>edit</button>
                                <button>delete</button>
                            </td>
                        </tr>
                    </tbody>
            </table>
        </div>
    )
}

export default Department;