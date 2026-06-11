import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import styles from "../../../styles/ProfileScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";
import {
  VITE_API
} from "@env";

export default function Profile() {
  const [loggedInEmployee, setLoggedInEmployee]= useState(null);
  const [profileData, setProfileData]= useState(null)

  useEffect(()=>{
   const getEmployeeId= async()=>{
     const Id=  await AsyncStorage.getItem("employee_id");
     console.log("Stored Employee Id:-->", Id );

     setLoggedInEmployee(Id)

     if(Id){
      handleFetchProfile(Id)
     }
   }
   getEmployeeId()
  },[])

  const handleFetchProfile= async(employeeId)=>{
    const response= await axios.get(`${VITE_API}/profile/${employeeId}`)

    setProfileData(response.data.data);
  }
  const handleLogout=  async()=>{
    console.log("Clicked Handle Logout Function")
   try{
     await AsyncStorage.removeItem("employee_id");

     router.replace("/auth/login")
   }catch(err){
    console.log("Logout Error:---> ", err)
   }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}

        <View style={styles.profileSection}>
          {/* <Image
            source={{
              uri: "https://i.pravatar.cc/500",
            }}
            style={styles.profileImage}
          /> */}

          <Text style={styles.employeeName}>
            {profileData?.employee_name}
          </Text>

          <Text style={styles.designation}>
            {profileData?.employee_designation}
          </Text>

          {/* <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.messageBtn}
            >
              <Text style={styles.messageText}>
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editBtn}
            >
              <Text style={styles.editText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Professional Info */}

        <Text style={styles.sectionTitle}>
          Professional Info
        </Text>

        <View style={styles.card}>
          <InfoRow
            label="Employee ID"
            value={profileData?.employee_code}
          />

          <InfoRow
            label="Department"
            value= {profileData?.employee_department}
          />

          <InfoRow
            label="Joining Date"
            value={profileData?.employee_joining_date}
          />
        </View>

        {/* Personal Info */}

        <Text style={styles.sectionTitle}>
          Personal Info
        </Text>

        <View style={styles.card}>
          <InfoRow
            label="Email"
            value={profileData?.employee_email_id}
          />

          <InfoRow
            label="Phone"
            value={profileData?.employee_mobile_no}
          />

          <InfoRow
            label="Location"
            value={profileData?.city}
          />
        </View>

        {/* Settings */}

        <Text style={styles.sectionTitle}>
          Settings
        </Text>

        <View style={styles.card}>
          <SettingRow title="Privacy & Security" />
          <SettingRow title="Notifications" />
          <SettingRow title="Language" />
          <SettingRow style={styles.logout} title="Logout" onPress={handleLogout}/>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

function SettingRow({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
    >
      <Text style={styles.settingText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}