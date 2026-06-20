import { Redirect } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLoading, setIsLoading]= useState(true);
  const [isLoggedIn, setIsLoggedIn]= useState(false);

  useEffect(()=>{

   checkLoginStatus()

  },[]);

  const checkLoginStatus= async()=>{
    try {
        const employeeId= await AsyncStorage.getItem("employee_id");
        console.log("Stored Employee Id:", employeeId);

        if(employeeId){
            setIsLoggedIn(true);
        }
    } catch (error) {
        console.error("Error checking login status:", error);
    } finally {
        setIsLoading(false)
    }
  }
   

  if(isLoading){
    return(
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>

            <Text>Loading...</Text>
        </View>
    )
  }

  if(isLoggedIn){
    return <Redirect href="/(root)/(tabs)"/>
  }
 return <Redirect href= "/auth/login"/>
}
