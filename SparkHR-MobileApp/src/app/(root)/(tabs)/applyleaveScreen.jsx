import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import fetchHolidays from "../../../api/holidayApi"
import Header from "../../../components/Header";
import AnimatedScreen from "../../../components/AnimatedScreen";
import { fetchLeaveBalance, applyLeave } from "../../../services/leaveApi";
import usePullToRefresh from "../../../hooks/usePullToRefresh";

import styles from "../../../styles/applyLeaveStyles";

const LEAVE_TYPE_MAP = {
  "Sick Leave": "SL",
  "Casual Leave": "CL",
  "Earn Leave": "EL",
};

export default function ApplyLeaveScreen() {

  const [upcomingHolidays, setUpcomingHolidays]= useState([])
  const [selectedType, setSelectedType] = useState("Sick Leave");
  const [showAllHolidays, setShowAllHolidays] = useState(false);
  const [balances, setBalances] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const loadHolidays = async () => {
    const holidays = await fetchHolidays();
    setUpcomingHolidays(holidays);
  };

  const loadBalances = useCallback(async (empId) => {
    try {
      const res = await fetchLeaveBalance(empId);
      setBalances(res.leaves || []);
    } catch (_) {}
  }, []);

  useEffect(() => {
    loadHolidays();
    AsyncStorage.getItem("employee_id").then((id) => {
      if (id) {
        setEmployeeId(id);
        loadBalances(id);
      }
    });
  }, []);

  // ---- Pull to Refresh ----
  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await loadHolidays();
    const id = await AsyncStorage.getItem("employee_id");
    if (id) loadBalances(id);
  });

  const getLeaveTypeId = (typeName) => {
    const code = LEAVE_TYPE_MAP[typeName];
    const match = balances.find((b) => b.code === code);
    return match ? match.leave_type_id : null;
  };

  const handleApplyLeave = async () => {
    if (!employeeId) {
      Alert.alert("Error", "Employee not found. Please login again.");
      return;
    }
    const leaveTypeId = getLeaveTypeId(selectedType);
    if (!leaveTypeId) {
      Alert.alert("Error", `Leave type "${selectedType}" not found in your balance. Contact admin.`);
      return;
    }
    if (!fromDate.trim() || !toDate.trim()) {
      Alert.alert("Error", "Please enter From Date and To Date");
      return;
    }
    setSubmitting(true);
    try {
      const res = await applyLeave({
        employee_id: parseInt(employeeId),
        leave_type_id: leaveTypeId,
        from_date: fromDate.trim(),
        to_date: toDate.trim(),
        reason: reason.trim() || undefined,
      });
      Alert.alert("Success", res.message);
      loadBalances(employeeId);
      setFromDate("");
      setToDate("");
      setReason("");
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleFromDateChange = (_event, selectedDate) => {
    setShowFromPicker(Platform.OS === "ios");
    if (selectedDate) {
      setFromDate(formatDate(selectedDate));
    }
  };

  const handleToDateChange = (_event, selectedDate) => {
    setShowToPicker(Platform.OS === "ios");
    if (selectedDate) {
      setToDate(formatDate(selectedDate));
    }
  };

  const leaveTypes = ["Sick Leave", "Casual Leave", "Earn Leave"];

  return (
    <AnimatedScreen>
    <SafeAreaView style={styles.container}>
      <Header onProfilePress={() => router.navigate("profile")} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >

        {/* Leave Balance Cards */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.sectionTitle}>Leave Balance</Text>
          <TouchableOpacity onPress={() => employeeId && loadBalances(employeeId)}>
            <MaterialIcons name="refresh" size={22} color="#0052cc" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.balanceScroll}>
          {balances.length > 0 ? balances.map((item, index) => {
            const colors = [
              { bg: "#E8F5E9", icon: "hotel", color: "#2E7D32" },
              { bg: "#FFF3E0", icon: "wb-sunny", color: "#E65100" },
              { bg: "#E3F2FD", icon: "card-giftcard", color: "#1565C0" },
            ];
            const c = colors[index % 3];
            const pct = item.total_days > 0 ? (item.remaining_days / item.total_days) * 100 : 0;
            return (
              <View key={item.id || index} style={styles.balanceCard}>
                <View style={[styles.balanceIcon, { backgroundColor: c.bg }]}>
                  <MaterialIcons name={c.icon} size={24} color={c.color} />
                </View>
                <Text style={styles.balanceCount}>{item.remaining_days}</Text>
                <Text style={styles.balanceLabel}>{item.leave_name || item.lave_name || item.code}</Text>
                <View style={styles.bar}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: c.color }]} />
                </View>
              </View>
            );
          }) : (
            <View style={styles.balanceCard}>
              <View style={[styles.balanceIcon, { backgroundColor: "#f0f0f5" }]}>
                <MaterialIcons name="hourglass-empty" size={24} color="#999" />
              </View>
              <Text style={[styles.balanceCount, { fontSize: 14 }]}>No data</Text>
              <Text style={styles.balanceLabel}>Pull to refresh</Text>
            </View>
          )}
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
        <Text style={styles.greetingSub}>Plan your time off</Text>
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
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromPicker(true)}>
                <Text style={[styles.dateInputText, fromDate && { color: "#333" }]}>
                  {fromDate || "Select Date"}
                </Text>
                <MaterialIcons name="calendar-today" size={18} color="#999" />
              </TouchableOpacity>
              {showFromPicker && (
                <DateTimePicker
                  value={fromDate ? new Date(fromDate) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleFromDateChange}
                />
              )}
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowToPicker(true)}>
                <Text style={[styles.dateInputText, toDate && { color: "#333" }]}>
                  {toDate || "Select Date"}
                </Text>
                <MaterialIcons name="calendar-today" size={18} color="#999" />
              </TouchableOpacity>
              {showToPicker && (
                <DateTimePicker
                  value={toDate ? new Date(toDate) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleToDateChange}
                />
              )}
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Reason</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Write your reason for leave..."
            value={reason}
            onChangeText={setReason}
            style={styles.textArea}
          />

          <TouchableOpacity
            style={[styles.applyBtn, submitting && { opacity: 0.6 }]}
            onPress={handleApplyLeave}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="send" size={20} color="#fff" />
            )}
            <Text style={styles.applyBtnText}>
              {submitting ? "Submitting..." : "Submit Leave Request"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
    </AnimatedScreen>
  );
}
