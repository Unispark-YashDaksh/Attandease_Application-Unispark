import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {VITE_API} from "@env";

const api= axios.create({
    baseURL: VITE_API
});

api.interceptors.request.use(async(config)=>{
    const employeeId= await AsyncStorage.getItem("employee_id");
    if(employeeId){
        config.headers["employee-id"]= employeeId;
    }
    return config;
});

export default api;