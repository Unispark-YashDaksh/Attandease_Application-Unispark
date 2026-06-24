import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { VITE_API } from "@env";
import Header from "../../../components/Header";
import AnimatedScreen from "../../../components/AnimatedScreen";
import usePullToRefresh from "../../../hooks/usePullToRefresh";
import styles from "../../../styles/ProfileScreenStyles";

// Icon and color config for info rows
const PROFILE_FIELDS = {
  employee_code: { icon: "badge", label: "Employee ID", bg: "#E3F2FD", color: "#1565C0" },
  employee_department: { icon: "business", label: "Department", bg: "#E8F5E9", color: "#2E7D32" },
  employee_joining_date: { icon: "calendar-month", label: "Joining Date", bg: "#FFF3E0", color: "#E65100" },
};

const PERSONAL_FIELDS = {
  employee_email_id: { icon: "email", label: "Email", bg: "#F3E5F5", color: "#7B1FA2" },
  employee_mobile_no: { icon: "phone", label: "Phone", bg: "#E0F7FA", color: "#00695C" },
  city: { icon: "location-on", label: "Location", bg: "#FFEBEE", color: "#C62828" },
};

const SETTINGS_ITEMS = [
  { icon: "lock", label: "Privacy & Security", bg: "#E3F2FD", color: "#1565C0" },
  { icon: "notifications", label: "Notifications", bg: "#FFF3E0", color: "#E65100" },
  { icon: "language", label: "Language", bg: "#F3E5F5", color: "#7B1FA2" },
];

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleFetchProfile = async (employeeId) => {
    try {
      const response = await axios.get(`${VITE_API}/profile/${employeeId}`);
      setProfileData(response.data.data);
    } catch (err) {
      console.log("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getEmployeeId = async () => {
      const id = await AsyncStorage.getItem("employee_id");
      if (id) handleFetchProfile(id);
    };
    getEmployeeId();
  }, []);

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    const id = await AsyncStorage.getItem("employee_id");
    if (id) await handleFetchProfile(id);
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("employee_id");
          router.replace("/auth/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <AnimatedScreen>
        <SafeAreaView style={styles.container}>
          <Header showBack onBackPress={() => router.back()} />
          <ActivityIndicator size="large" color="#1565C0" style={styles.loader} />
        </SafeAreaView>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <Header showBack onBackPress={() => router.back()} />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Profile Header Gradient Area ─── */}
          <LinearGradient
            colors={["#E8F0FE", "#F5F7FA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerBg}
          >
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              {profileData?.photo_url ? (
                <Image
                  source={{
                    uri: profileData.photo_url.startsWith("http")
                      ? profileData.photo_url
                      : `${VITE_API}${profileData.photo_url}`,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={{ alignItems: "center" }}>
                  <MaterialIcons name="person" size={40} color="#1565C0" />
                  <Text style={{ fontSize: 10, color: "#1565C0", fontWeight: "600", marginTop: 2 }}>
                    No Profile Photo
                  </Text>
                </View>
              )}
            </View>

            {/* Name & Designation */}
            <Text style={styles.employeeName}>
              {profileData?.employee_name}
            </Text>
            <Text style={styles.designation}>
              {profileData?.employee_designation}
            </Text>

            {/* Employee Code Badge */}
            <View style={styles.codeBadge}>
              <MaterialIcons name="badge" size={14} color="#1565C0" />
              <Text style={styles.codeBadgeText}>
                {profileData?.employee_code}
              </Text>
            </View>
          </LinearGradient>

          {/* ─── Professional Info ─── */}
          <Text style={styles.sectionTitle}>Professional Info</Text>
          <View style={styles.card}>
            {Object.entries(PROFILE_FIELDS).map(([key, cfg], index, arr) => {
              const value = profileData?.[key];
              const isLast = index === arr.length - 1;
              return (
                <View
                  key={key}
                  style={[styles.infoRow, isLast && styles.infoRowLast]}
                >
                  <View style={[styles.infoIcon, { backgroundColor: cfg.bg }]}>
                    <MaterialIcons name={cfg.icon} size={18} color={cfg.color} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{cfg.label}</Text>
                    <Text style={styles.infoValue}>{value || "—"}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ─── Personal Info ─── */}
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.card}>
            {Object.entries(PERSONAL_FIELDS).map(([key, cfg], index, arr) => {
              const value = profileData?.[key];
              const isLast = index === arr.length - 1;
              return (
                <View
                  key={key}
                  style={[styles.infoRow, isLast && styles.infoRowLast]}
                >
                  <View style={[styles.infoIcon, { backgroundColor: cfg.bg }]}>
                    <MaterialIcons name={cfg.icon} size={18} color={cfg.color} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{cfg.label}</Text>
                    <Text style={styles.infoValue}>{value || "—"}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ─── Settings ─── */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={[styles.card, styles.lastCard]}>
            {SETTINGS_ITEMS.map((item, index, arr) => {
              const isLast = index === arr.length - 1;
              return (
                <View
                  key={item.label}
                  style={[styles.settingRow, isLast && styles.settingRowLast]}
                >
                  <View
                    style={[styles.settingIcon, { backgroundColor: item.bg }]}
                  >
                    <MaterialIcons
                      name={item.icon}
                      size={18}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingText}>{item.label}</Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      style={styles.settingArrow}
                    />
                  </View>
                </View>
              );
            })}

            {/* Logout */}
            <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
              <View style={styles.logoutRow}>
                <View style={styles.logoutIconWrap}>
                  <MaterialIcons name="logout" size={18} color="#C62828" />
                </View>
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}
