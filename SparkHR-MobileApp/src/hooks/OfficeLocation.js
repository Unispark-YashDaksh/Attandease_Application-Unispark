import { useState } from "react";
import api from "../services/api";

export default function OfficeLocations(){
    const [officeLocations, setOfficeLocations]= useState([]);

    const fetchOfficeLocations= async()=>{
        const response= await api.post("/fetchOfficeLocations")
    }
}