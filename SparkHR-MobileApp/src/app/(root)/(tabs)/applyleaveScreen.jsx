import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import fetchHolidays from "../../../api/holidayApi"

import styles from "../../../styles/applyLeaveStyles";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ApplyLeaveScreen() {

  const [upcomingHolidays, setUpcomingHolidays]= useState([])
  const [selectedType, setSelectedType] = useState("Sick Leave");
  const [showAllHolidays, setShowAllHolidays] = useState(false);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const todayDate = today.getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const loadHolidays= async()=>{
    const holidays= await fetchHolidays();
    setUpcomingHolidays(holidays);

    console.log(holidays)
  }

  const leaveTypes = ["Sick Leave", "Casual Leave", "Earn Leave"];
   useEffect(()=>{
    loadHolidays()
  },[])


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Leave Management</Text>
            <Text style={styles.greetingSub}>Plan your time off</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <MaterialIcons name="person" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Leave Balance Cards */}
        <Text style={styles.sectionTitle}>Leave Balance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.balanceScroll}>
          <View style={styles.balanceCard}>
            <View style={[styles.balanceIcon, { backgroundColor: "#E8F5E9" }]}>
              <MaterialIcons name="hotel" size={24} color="#2E7D32" />
            </View>
            <Text style={styles.balanceCount}>12</Text>
            <Text style={styles.balanceLabel}>Sick Leave</Text>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: "60%", backgroundColor: "#2E7D32" }]} />
            </View>
          </View>
          <View style={styles.balanceCard}>
            <View style={[styles.balanceIcon, { backgroundColor: "#FFF3E0" }]}>
              <MaterialIcons name="wb-sunny" size={24} color="#E65100" />
            </View>
            <Text style={styles.balanceCount}>8</Text>
            <Text style={styles.balanceLabel}>Casual Leave</Text>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: "40%", backgroundColor: "#E65100" }]} />
            </View>
          </View>
          <View style={styles.balanceCard}>
            <View style={[styles.balanceIcon, { backgroundColor: "#E3F2FD" }]}>
              <MaterialIcons name="card-giftcard" size={24} color="#1565C0" />
            </View>
            <Text style={styles.balanceCount}>18</Text>
            <Text style={styles.balanceLabel}>Earn Leave</Text>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: "90%", backgroundColor: "#1565C0" }]} />
            </View>
          </View>
        </ScrollView>

       

        {/* Upcoming Holidays */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Holidays</Text>
          <TouchableOpacity onPress={() => setShowAllHolidays(!showAllHolidays)}>
            <Text style={styles.viewAllText}>
              {showAllHolidays ? "Show Less" : `View All (${upcomingHolidays.length})`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={showAllHolidays ? styles.holidayListContainer : null}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            style={showAllHolidays ? styles.holidayScrollView : null}
          >

            {upcomingHolidays.slice(0, showAllHolidays ? upcomingHolidays.length : 3).map((item, index) => (
              <View key={index} style={styles.holidayCard}>
                <View style={styles.holidayDateBox}>
                  <Text style={styles.holidayDateText}>{item.date}</Text>
                </View>
                <View style={styles.holidayInfo}>
                  <Text style={styles.holidayName}>{item.name}</Text>
                </View>
                <MaterialIcons name="celebration" size={22} color="#FF6F00" />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Apply Leave Section */}
        <Text style={styles.sectionTitle}>Apply Leave</Text>
        <View style={styles.formCard}>
          <Text style={styles.label}>Leave Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {leaveTypes.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedType(item)}
                style={[
                  styles.leaveChip,
                  selectedType === item && styles.activeChip,
                ]}
              >
                <Text style={[
                  styles.leaveChipText,
                  selectedType === item && styles.activeChipText,
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.dateRow}>
            <View style={styles.dateBox}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateInputText}>Select Date</Text>
                <MaterialIcons name="calendar-today" size={18} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateInputText}>Select Date</Text>
                <MaterialIcons name="calendar-today" size={18} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.halfDayRow}>
            <TouchableOpacity style={styles.halfDayBtn}>
              <MaterialIcons name="check-box-outline-blank" size={20} color="#777" />
              <Text style={styles.halfDayText}>Half Day</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Reason</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Write your reason for leave..."
            style={styles.textArea}
          />

          <TouchableOpacity style={styles.uploadBox}>
            <MaterialIcons name="cloud-upload" size={28} color="#0052cc" />
            <Text style={styles.uploadText}>Upload supporting document</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyBtn}>
            <MaterialIcons name="send" size={20} color="#fff" />
            <Text style={styles.applyBtnText}>Submit Leave Request</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
