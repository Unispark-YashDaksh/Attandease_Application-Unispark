import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Header";
import AnimatedScreen from "../../components/AnimatedScreen";
import { applyWFH } from "../../services/wfhApi";
import styles from "../../styles/applyWFHStyles";

export default function ApplyWFHScreen() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleStartDateChange = (_event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(formatDate(selectedDate));
  };

  const handleEndDateChange = (_event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) setEndDate(formatDate(selectedDate));
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select both start and end date");
      return;
    }
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason");
      return;
    }

    setSubmitting(true);
    try {
      const employeeId = await AsyncStorage.getItem("employee_id");
      if (!employeeId) {
        Alert.alert("Error", "Employee not found. Please login again.");
        setSubmitting(false);
        return;
      }

      const res = await applyWFH({
        employee_id: parseInt(employeeId),
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
      });

      Alert.alert("Success", res.message || "WFH request submitted!");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <Header showBack onBackPress={() => router.back()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        >
          <View style={[styles.formCard, { marginTop: 16 }]}>
            <View style={styles.infoCard}>
              <MaterialIcons name="info" size={18} color="#1565C0" />
              <Text style={styles.infoText}>
                Submit a Work From Home request. Your manager will review and
                approve or reject it.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>WFH Dates</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateBox}>
                <Text style={styles.label}>From Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text
                    style={
                      startDate
                        ? styles.dateInputTextFilled
                        : styles.dateInputText
                    }
                  >
                    {startDate || "Select date"}
                  </Text>
                  <MaterialIcons name="calendar-month" size={20} color="#888" />
                </TouchableOpacity>
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.label}>To Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text
                    style={
                      endDate
                        ? styles.dateInputTextFilled
                        : styles.dateInputText
                    }
                  >
                    {endDate || "Select date"}
                  </Text>
                  <MaterialIcons name="calendar-month" size={20} color="#888" />
                </TouchableOpacity>
              </View>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={new Date()}
              />
            )}

            <Text style={[styles.label, { marginTop: 20 }]}>Reason</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Why are you working from home?"
              value={reason}
              onChangeText={setReason}
              style={styles.textArea}
            />

            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="home-work" size={20} color="#fff" />
              )}
              <Text style={styles.submitBtnText}>
                {submitting ? "Submitting..." : "Submit WFH Request"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}
