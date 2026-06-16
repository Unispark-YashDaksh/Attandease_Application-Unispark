import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useState } from "react";
import api from "../services/api";

export default function useTodayLogs(){
    const [todayRecords, setTodayRecords]= useState(null);
    const [loading, setLoading]= useState(false);

    useEffect(()=>{
        const fetch= async()=>{
           try{
             const employeeId= await AsyncStorage.getItem("employee_id");
            if(!employeeId){
                return
            }
            const res= await api.post("/attendance", {employee_id: employeeId});
            setTodayRecords(res.data.record);
           }catch(err){
                console.log("useTodayLogs error", err)
           } finally{
            setLoading(false) // last work is loading false
           }
        }
        fetch();
    }, []);

    return {todayRecords, loading}
}