import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import styles from "../../.././styles/attendanceStyles";

export default function AttendanceScreen() {
    const [punchIn, setPunchIn]= useState("Clicked");
    const [punchPut, setPunchOut]= useState();
    const [gpsLocation, setGpsLocation]= useState();
    const [shiftTiming, setShiftTiming]= useState();
    const [currentDateTime, setCurrentDateTime]= useState();
    const [workingHour, setWorkingHour]= useState();

    const handlePunchIn=()=>{
      console.log(punchIn)
      
    }
  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>

            <Text style={styles.logoText}>
              SparkHR
            </Text>
          </View>

        {/* Title */}
        <View className="mt-5">
          <Text style={styles.title}>
            Attendance
          </Text>

          <View style={styles.dateRow}>
            <MaterialIcons
              name="calendar-month"
              size={18}
              color="#666"
            />

            <Text style={styles.dateText}>
              21 May 2026
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.dateText}>
              4:45 PM
            </Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          
          <View style={styles.statusTop}>
            <View>
              <Text style={styles.checkInBadge}>
                Checked In
              </Text>

              <Text style={styles.shiftText}>
                Shift: 09:00 AM - 06:00 PM
              </Text>
            </View>

            <View>
              <Text style={styles.workingLabel}>
                Working Hours
              </Text>

              <Text style={styles.workingHours}>
                4h 30m
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View className="mt-4">
            
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                Started at 09:15 AM
              </Text>

              <Text style={styles.progressText}>
                50% Complete
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>

          </View>
        </View>

        {/* Punch Buttons */}
        <View style={styles.buttonGrid}>

          {/* Punch In */}
          <TouchableOpacity onPress={handlePunchIn} style={styles.inactiveButton}>
            <MaterialIcons
              name="fingerprint"
              size={40}
              color="#999"
            />

            <Text style={styles.inactiveText}>
              Punch In
            </Text>
          </TouchableOpacity>

          {/* Punch Out */}
          <TouchableOpacity style={styles.activeButton}>
            <MaterialIcons
              name="logout"
              size={40}
              color="#fff"
            />

            <Text style={styles.activeText}>
              Punch Out
            </Text>
          </TouchableOpacity>

        </View>

        {/* Verification */}
        <View style={styles.verificationCard}>
          
          <Text style={styles.sectionTitle}>
            Verification
          </Text>

          <View style={styles.officeRow}>
            
            <View style={styles.officeIcon}>
              <MaterialIcons
                name="business"
                size={24}
                color="#fff"
              />
            </View>

            <View>
              <Text style={styles.officeTitle}>
                Head Office
              </Text>

              <Text style={styles.officeSub}>
                Mumbai, BKC
              </Text>
            </View>

          </View>

        </View>

        {/* Today's Log */}
        <View className="mt-6 mb-10">
          
          <Text style={styles.sectionTitle}>
            Today's Log
          </Text>

          <View style={styles.logCard}>
            
            <View style={styles.logLeft}>
              
              <View style={styles.logIcon}>
                <MaterialIcons
                  name="login"
                  size={22}
                  color="#0052cc"
                />
              </View>

              <View>
                <Text style={styles.logTitle}>
                  Punch In
                </Text>

                <Text style={styles.logSub}>
                  Office WiFi • Mumbai
                </Text>
              </View>

            </View>

            <View>
              <Text style={styles.logTime}>
                09:15 AM
              </Text>
            </View>

          </View>

          <View style={styles.logCard}>
            
            <View style={styles.logLeft}>
              
              <View style={styles.logIcon}>
                <MaterialIcons
                  name="logout"
                  size={22}
                  color="#0052cc"
                />
              </View>

              <View>
                <Text style={styles.logTitle}>
                  Punch Out
                </Text>

                <Text style={styles.logSub}>
                  Office WiFi • Mumbai
                </Text>
              </View>

            </View>

            <View>
              <Text style={styles.logTime}>
                06:15 AM
              </Text>
            </View>

          </View>

        </View>
        

      </ScrollView>

    </SafeAreaView>
  );
}