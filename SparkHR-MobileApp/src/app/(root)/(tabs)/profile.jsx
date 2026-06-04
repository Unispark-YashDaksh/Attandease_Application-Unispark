import React from "react";
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

export default function Profile() {
  const handleLogout=  async()=>{
    console.log("Clicked Handle Logout Function")
   try{
     await AsyncStorage.removeItem("employee-id");

     router.push("/auth/login")

  router.push("/auth/login")
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
          <Image
            source={{
              uri: "https://i.pravatar.cc/500",
            }}
            style={styles.profileImage}
          />

          <Text style={styles.employeeName}>
            Yash Kumar Daksh
          </Text>

          <Text style={styles.designation}>
            Senior HR Specialist
          </Text>

          <View style={styles.actionContainer}>
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
          </View>
        </View>

        {/* Professional Info */}

        <Text style={styles.sectionTitle}>
          Professional Info
        </Text>

        <View style={styles.card}>
          <InfoRow
            label="Employee ID"
            value="EMP-82910"
          />

          <InfoRow
            label="Department"
            value="Human Resources"
          />

          <InfoRow
            label="Joining Date"
            value="12 March 2021"
          />
        </View>

        {/* Personal Info */}

        <Text style={styles.sectionTitle}>
          Personal Info
        </Text>

        <View style={styles.card}>
          <InfoRow
            label="Email"
            value="yash@sparkhr.com"
          />

          <InfoRow
            label="Phone"
            value="+91 9876543210"
          />

          <InfoRow
            label="Location"
            value="Bangalore, India"
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
          <SettingRow title="Logout"  onPress={handleLogout}/>
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

      <Text>{">"}</Text>
    </TouchableOpacity>
  );
}