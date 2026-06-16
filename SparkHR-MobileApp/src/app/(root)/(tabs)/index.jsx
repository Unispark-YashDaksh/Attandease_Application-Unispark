import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "../../../styles/homeStyles";
import Header from "../../../components/Header";
import AnimatedScreen from "../../../components/AnimatedScreen";
import useTodayLogs from "../../../hooks/useTodayLogs"; // Today logs fuctionality main file
import { useState } from "react";

const QUICK_ACTIONS = [
  { icon: "event-busy", label: "Leaves" },
  { icon: "history", label: "History" },
  { icon: "calendar-month", label: "Calendar" },
  { icon: "payments", label: "Salary" },
  { icon: "groups", label: "Team" },
  { icon: "work", label: "Apply WFH" },
];

export default function Home() {
  const { todayRecords, loading } = useTodayLogs();
  return (
    <AnimatedScreen>
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onProfilePress={() => router.navigate("profile")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Good Morning, Yash</Text>
            <View style={styles.dateTimeRow}>
            </View>
          </View>

          {/* Bento Grid: Attendance + Verification */}
          <View style={styles.bentoGrid}>
            {/* Attendance Status Card */}
            <View style={styles.attendanceCard}>
              <View style={styles.attendanceTopRow}>
                <View>
                  <View style={styles.checkedInBadge}>
                    <Text style={styles.checkedInBadgeText}>Checked In</Text>
                  </View>
                  <Text style={styles.shiftText}>Shift: 09:00 AM - 06:00 PM</Text>
                </View>
                <View>
                  <Text style={styles.workingHoursLabel}>Working Hours</Text>
                  <Text style={styles.workingHoursValue}>4h 30m</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Started at 09:15 AM</Text>
                  <Text style={styles.progressLabel}>50% Complete</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "50%" }]} />
                </View>
              </View>

              {/* Footer */}
              <View style={styles.attendanceFooter}>
                <View style={styles.footerItem}>
                  <MaterialIcons name="schedule" size={18} color="#0052cc" />
                  <Text style={styles.footerText}>Punch In: {todayRecords?.punch_in || "--:--"}</Text>
                </View>
                <View style={styles.footerItem}>
                  <MaterialIcons name="location-on" size={18} color={todayRecords?.punch_in ? "#0052cc": "#737685"} />
                  <Text style={styles.footerText}>
                    {todayRecords?.punch_in ? "Verified": "Not Checked In"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Verification Card */}
            {/* <View style={styles.verificationCard}>
              <Text style={styles.verificationTitle}>Verification</Text>
              <View style={styles.officeRow}>
                <View style={styles.officeIconBox}>
                  <MaterialIcons name="business" size={20} color="#fff" />
                </View>
                <View>
                  <Text style={styles.officeName}>Head Office</Text>
                  <Text style={styles.officeSub}>Mumbai, BKC</Text>
                </View>
              </View>
              <View style={styles.gpsBadge}>
                <View style={styles.gpsLeft}>
                  <MaterialIcons name="gps-fixed" size={16} color="#006477" />
                  <Text style={styles.gpsText}>GPS Verified</Text>
                </View>
                <MaterialIcons name="check-circle" size={18} color="#006477" />
              </View>
            </View> */}
          </View>

          {/* Action Center */}
          {/* <View style={styles.actionCenter}>
            <TouchableOpacity style={styles.punchInBtn} disabled>
              <MaterialIcons name="fingerprint" size={32} color="#c3c6d6" />
              <Text style={[styles.punchBtnText, { color: "#c3c6d6" }]}>Punch In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.punchOutBtn}>
              <View style={styles.punchBtnIconWrap}>
                <MaterialIcons name="logout" size={28} color="#fff" />
              </View>
              <Text style={[styles.punchBtnText, { color: "#fff" }]}>Punch Out</Text>
            </TouchableOpacity>
          </View> */}

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((item) => (
              <TouchableOpacity key={item.label} style={styles.quickActionItem}>
                <MaterialIcons name={item.icon} size={24} color="#0052cc" />
                <Text style={styles.quickActionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's Summary + AI */}
          <View style={styles.summaryRow}>
            {/* Metrics */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Today's Metrics</Text>
              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>45m</Text>
                  <Text style={styles.metricLabel}>Breaks</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>1h 12m</Text>
                  <Text style={styles.metricLabel}>Overtime</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValuePrimary}>4h 30m</Text>
                  <Text style={styles.metricLabel}>Remains</Text>
                </View>
              </View>
            </View>

            {/* AI Assistant */}
            <View style={[styles.aiCard, styles.aiCardGradient]}>
              <View style={styles.aiHeader}>
                <MaterialIcons name="smart-toy" size={18} color="#fff" />
                <Text style={styles.aiTitle}>Spark AI Assistant</Text>
              </View>
              <Text style={styles.aiMessage}>
                You're on track! Your performance is 12% higher than last week.
              </Text>
              <TouchableOpacity style={styles.aiButton}>
                <Text style={styles.aiButtonText}>View Insights</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Upcoming Holidays + Announcements */}
          <View style={styles.holidaySection}>
            <Text style={styles.sectionTitle}>Next Holiday</Text>
            <View style={styles.holidayCard}>
              <View style={styles.holidayDateBox}>
                <Text style={styles.holidayDateMonth}>Nov</Text>
                <Text style={styles.holidayDateDay}>12</Text>
              </View>
              <View style={styles.holidayInfo}>
                <Text style={styles.holidayName}>Diwali Festival</Text>
                <Text style={styles.holidaySub}>Public Holiday • Monday</Text>
              </View>
              <MaterialIcons name="celebration" size={24} color="#006477" />
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Announcements</Text>
            <TouchableOpacity style={styles.announcementCard}>
              <MaterialIcons name="campaign" size={22} color="#ba1a1a" />
              <View>
                <Text style={styles.announcementTitle}>New Policy Update</Text>
                <Text style={styles.announcementSub}>
                  Regarding flexible work hours starting Nov 1st.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  </AnimatedScreen>
  );
}
