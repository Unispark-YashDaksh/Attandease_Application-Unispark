import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  VITE_API,
  GEO_FENCING_RADIUS,
  GPS_ACCURACY,
  SELFIE_QUALITY,
} from "@env";
import axios from "axios";

import styles from "../../.././styles/attendanceStyles";

// ---------------------------------------------------------------------------
// API_BASE — Backend server URL
// Source: .env variable VITE_API (set to your machine's LAN IP, e.g. http://192.168.0.147:7000)
// Why: Mobile app needs to know where to send API requests.
// ---------------------------------------------------------------------------
const API_BASE = VITE_API;

// ---------------------------------------------------------------------------
// GPS_ACCURACY_MAP — Maps string values from .env to expo-location Accuracy enum
// Source: .env variable GPS_ACCURACY (values: Balanced, High, Low)
// Why: expo-location's Accuracy enum can't be read from env directly,
//      so we map string config to the enum value.
// ---------------------------------------------------------------------------
const GPS_ACCURACY_MAP = {
  High: Location.Accuracy.High,
  Balanced: Location.Accuracy.Balanced,
  Low: Location.Accuracy.Low,
};

// ---------------------------------------------------------------------------
// HAVERSINE FORMULA
// Why: Calculates great-circle distance between two GPS coordinates.
// Used to validate if employee is within geo-fence radius of office.
// Formula: d = 2R * arcsin(√(sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlng/2)))
// ---------------------------------------------------------------------------
function haversineDistance(coords1, coords2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLng = toRad(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AttendanceScreen() {
  // ---------------------------------------------------------------------------
  // EMPLOYEE_ID — Currently logged-in user
  // Source: .env (EMPLOYEE_ID) — TEMPORARY. In production, this MUST come from
  //         authentication context (login state / JWT token / AsyncStorage).
  // ---------------------------------------------------------------------------
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState("15");

  // ---- Attendance State ----
  const [canPunchIn, setCanPunchIn] = useState(false);
  const [canPunchOut, setCanPunchOut] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");

  // ---- Today's Record (for log display) ----
  // Source: Backend /attendance API returns full record including times.
  const [todayRecord, setTodayRecord] = useState(null);
 

  // ---- GPS & Location State ----
  const [gpsLocation, setGpsLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [officeLocation, setOfficeLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isWFH, setIsWFH] = useState(false);

  // ---- Selfie State ----
  const [selfieUri, setSelfieUri] = useState(null);

  // ---- Loading States ----
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isProcessingPunch, setIsProcessingPunch] = useState(false);

  // ---- Clock Display ----
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatClockTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const formatClockDate = (date) =>
    date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // =========================================================================
  // SCREEN INITIALIZATION
  // Why: On mount, check attendance status + get location + office data.
  // =========================================================================
  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    setIsCheckingStatus(true);
    try {
      await Promise.all([checkAttendanceStatus(), fetchLocationAndOffice()]);
    } catch (err) {
      console.log("Initialize Error:", err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // =========================================================================
  // ATTENDANCE STATUS CHECK
  // Why: Calls backend to determine today's attendance state.
  // Backend returns: canPunchIn, canPunchOut, message, record (with times)
  // =========================================================================
  const checkAttendanceStatus = async () => {
    try {
      const response = await axios.post(`${API_BASE}/attendance`, {
        employee_id: loggedInEmployeeId,
      });

      console.log("Attendance Status:", JSON.stringify(response.data, null, 2));
      setCanPunchIn(response.data.canPunchIn);
      setCanPunchOut(response.data.canPunchOut);
      setAttendanceMessage(response.data.message);
      setTodayRecord(response.data.record); // Store full record for log display
    } catch (err) {
      console.log("Attendance API Error:", err);
      Alert.alert("Error", "Failed to check attendance status");
    }
  };

  // =========================================================================
  // FETCH LOCATION + OFFICE DATA
  // Why: Gets employee's GPS location, reverse geocodes it to readable address,
  //      and fetches office coordinates/WFH status from backend.
  // =========================================================================
  const fetchLocationAndOffice = async () => {
    try {
      const hasPermission = await askAllPermissions();
      if (!hasPermission) return;

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: GPS_ACCURACY_MAP[GPS_ACCURACY] || Location.Accuracy.Balanced,
      });

      const userCoords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setGpsLocation(userCoords);

      // Reverse geocode to get human-readable address
      const geoCode = await Location.reverseGeocodeAsync(userCoords);
      console.log("Reverse Geocode:", geoCode[0]);

      if (geoCode.length > 0) {
        // Use formattedAddress when available (contains full street, city, pincode)
        // Fall back to constructing from individual fields.
        const addr = geoCode[0];
        const fullAddress =
          addr.formattedAddress ||
          [addr.street, addr.district, addr.city, addr.region]
            .filter(Boolean)
            .join(", ");
        setCurrentAddress(fullAddress);
      }

      // Fetch office location from backend (for distance display)
      const officeRes = await axios.get(
        `${API_BASE}/office-location/${loggedInEmployeeId}`
      );
      if (officeRes.data.success) {
        setOfficeLocation(officeRes.data.officeLocation);
        const officeCoords = {
          latitude: parseFloat(officeRes.data.officeLocation.latitude),
          longitude: parseFloat(officeRes.data.officeLocation.longitude),
        };
        const dist = haversineDistance(userCoords, officeCoords);
        setDistance(Math.round(dist));
        console.log(`Distance from office: ${Math.round(dist)} meters`);
      }

      // Check WFH status
      const wfhRes = await axios.get(
        `${API_BASE}/wfh-status/${loggedInEmployeeId}`
      );
      if (wfhRes.data.success) {
        setIsWFH(wfhRes.data.isWFH);
        console.log(
          "WFH Status:",
          wfhRes.data.isWFH ? "WFH Approved" : "Office Mode"
        );
      }
    } catch (err) {
      console.log("Location/Office Fetch Error:", err);
    }
  };

  // =========================================================================
  // PERMISSION REQUEST
  // Why: Camera + Location permissions required for attendance.
  // Both requested together for better UX.
  // =========================================================================
  const askAllPermissions = async () => {
    const cameraReq = await ImagePicker.requestCameraPermissionsAsync();
    const locationReq = await Location.requestForegroundPermissionsAsync();

    if (cameraReq.status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in Settings to capture selfie"
      );
      return false;
    }
    if (locationReq.status !== "granted") {
      Alert.alert(
        "Location Permission Required",
        "Please enable location access in Settings for attendance"
      );
      return false;
    }
    return true;
  };

  // =========================================================================
  // PUNCH IN — Full 10-Step Enterprise Workflow
  // =========================================================================
  const handlePunchIn = async () => {
    if (isProcessingPunch) return;
    setIsProcessingPunch(true);

    try {
      // STEP 1: Ask Camera + Location permissions
      const hasPermission = await askAllPermissions();
      if (!hasPermission) {
        setIsProcessingPunch(false);
        return;
      }

      // STEP 2: Fetch GPS coordinates
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: GPS_ACCURACY_MAP[GPS_ACCURACY] || Location.Accuracy.Balanced,
      });
      const userCoords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setGpsLocation(userCoords);
      console.log("GPS Fetched:", userCoords);

      // STEP 3: Reverse geocode → human readable address
      let readableAddress = "";
      try {
        const geoCode = await Location.reverseGeocodeAsync(userCoords);
        if (geoCode.length > 0) {
          const addr = geoCode[0];
          // Use formattedAddress for complete location string
          readableAddress = addr.formattedAddress
          setCurrentAddress(readableAddress);
        }
      } catch (geoErr) {
        console.log("Reverse Geocode Error:", geoErr);
      }

      // STEP 4: Check WFH status FIRST
      const wfhRes = await axios.get(
        `${API_BASE}/wfh-status/${loggedInEmployeeId}`
      );
      const wfhApproved = wfhRes.data.success && wfhRes.data.isWFH;
      setIsWFH(wfhApproved);

      let officeLoc = null;
      let distInMeters = null;

      if (!wfhApproved) {
        // STEP 5: Fetch office coordinates (only for non-WFH)
        const officeRes = await axios.get(
          `${API_BASE}/office-location/${loggedInEmployeeId}`
        );
        if (!officeRes.data.success) {
          Alert.alert(
            "Error",
            "Office location not configured for your branch"
          );
          setIsProcessingPunch(false);
          return;
        }
        officeLoc = officeRes.data.officeLocation;
        setOfficeLocation(officeLoc);

        // STEP 6: Calculate distance using Haversine formula
        const officeCoords = {
          latitude: parseFloat(officeLoc.latitude),
          longitude: parseFloat(officeLoc.longitude),
        };
        distInMeters = haversineDistance(userCoords, officeCoords);
        setDistance(Math.round(distInMeters));
        console.log(`Distance: ${Math.round(distInMeters)}m`);

        // STEP 7: Geo-fencing validation
        const allowedRadius =
          officeLoc.allowed_radius || parseInt(GEO_FENCING_RADIUS, 10) || 500;
        if (distInMeters > allowedRadius) {
          Alert.alert(
            "Outside Office Location",
            `You are ${Math.round(distInMeters)}m away from office.\nPlease come within ${allowedRadius}m of the office to punch in.`
          );
          setIsProcessingPunch(false);
          return;
        }
      } else {
        console.log("WFH approved — skipping geo-fencing");
      }

      // STEP 8: Open front camera for selfie
      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: false,
        quality: parseFloat(SELFIE_QUALITY) || 0.7,
      });

      // STEP 9: Handle cancellation
      if (result.canceled) {
        setIsProcessingPunch(false);
        return;
      }

      const capturedUri = result.assets[0].uri;
      setSelfieUri(capturedUri);

      // STEP 10: Call Punch In API
      console.log("Calling Punch In API...");

      const formData = new FormData();
      formData.append("employee_id", loggedInEmployeeId);
      formData.append("latitude", userCoords.latitude.toString());
      formData.append("longitude", userCoords.longitude.toString());
      formData.append("readable_address", readableAddress);
      formData.append("attendance_mode", wfhApproved ? "WFH" : "OFFICE");
      formData.append(
        "office_location_id",
        officeLoc ? officeLoc.id.toString() : ""
      );
      formData.append("selfie", {
        uri: capturedUri,
        type: "image/jpeg",
        name: `selfie_${Date.now()}.jpg`,
      });

      const punchResponse = await axios.post(
        `${API_BASE}/punch-in`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Punch In Response:", punchResponse.data);

      if (punchResponse.data.success) {
        Alert.alert("Success", "Punch In Successful!");
        await checkAttendanceStatus();
      } else {
        Alert.alert("Error", punchResponse.data.message || "Punch In failed");
      }
    } catch (err) {
      console.log("Punch In Error:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong during Punch In"
      );
    } finally {
      setIsProcessingPunch(false);
    }
  };

  // =========================================================================
  // PUNCH OUT
  // =========================================================================
  const handlePunchOut = async () => {
    if (isProcessingPunch) return;
    setIsProcessingPunch(true);

    try {
      const hasPermission = await askAllPermissions();
      if (!hasPermission) {
        setIsProcessingPunch(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: GPS_ACCURACY_MAP[GPS_ACCURACY] || Location.Accuracy.Balanced,
      });
      const userCoords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: false,
        quality: parseFloat(SELFIE_QUALITY) || 0.7,
      });

      if (result.canceled) {
        setIsProcessingPunch(false);
        return;
      }

      const formData = new FormData();
      formData.append("employee_id", loggedInEmployeeId);
      formData.append("latitude", userCoords.latitude.toString());
      formData.append("longitude", userCoords.longitude.toString());
      formData.append("selfie", {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: `selfie_${Date.now()}.jpg`,
      });

      const response = await axios.post(`${API_BASE}/punch-out`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        Alert.alert("Success", "Punch Out Successful!");
        await checkAttendanceStatus();
      }
    } catch (err) {
      console.log("Punch Out Error:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Punch Out failed"
      );
    } finally {
      setIsProcessingPunch(false);
    }
  };

  // =========================================================================
  // RENDER UI
  // =========================================================================
  if (isCheckingStatus) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0052cc" />
          <Text style={{ marginTop: 12, color: "#666" }}>
            Loading Attendance...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ========== HEADER ========== */}
        <View style={styles.header}>
          <Text style={styles.logoText}>SparkHR</Text>
        </View>

        {/* ========== TITLE + CLOCK ========== */}
        <View className="mt-5">
          <Text style={styles.title}>Attendance</Text>
          <View style={styles.dateRow}>
            <MaterialIcons name="calendar-month" size={18} color="#666" />
            <Text style={styles.dateText}>{formatClockDate(currentTime)}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.dateText}>{formatClockTime(currentTime)}</Text>
          </View>
        </View>

        {/* ========== STATUS CARD ========== */}
        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View>
              <Text style={styles.checkInBadge}>
                {attendanceMessage || "Not Checked In"}
              </Text>
              <Text style={styles.shiftText}>
                Shift: 09:00 AM - 06:00 PM
              </Text>
            </View>
            <View>
              <Text style={styles.workingLabel}>Distance</Text>
              <Text style={styles.workingHours}>
                {distance !== null ? `${distance}m` : "---"}
              </Text>
            </View>
          </View>
        </View>

        {/* ========== PUNCH BUTTONS ========== */}
        <View style={styles.buttonGrid}>
          <TouchableOpacity
            onPress={handlePunchIn}
            disabled={!canPunchIn || isProcessingPunch}
            style={[
              canPunchIn ? styles.activeButton : styles.inactiveButton,
              isProcessingPunch && { opacity: 0.6 },
            ]}
          >
            {isProcessingPunch ? (
              <ActivityIndicator
                size="small"
                color={canPunchIn ? "#fff" : "#999"}
              />
            ) : (
              <MaterialIcons
                name="fingerprint"
                size={40}
                color={canPunchIn ? "#fff" : "#999"}
              />
            )}
            <Text
              style={canPunchIn ? styles.activeText : styles.inactiveText}
            >
              {isProcessingPunch ? "Processing..." : "Punch In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePunchOut}
            disabled={!canPunchOut || isProcessingPunch}
            style={[
              canPunchOut ? styles.activeButton : styles.inactiveButton,
              isProcessingPunch && { opacity: 0.6 },
            ]}
          >
            {isProcessingPunch ? (
              <ActivityIndicator
                size="small"
                color={canPunchOut ? "#fff" : "#999"}
              />
            ) : (
              <MaterialIcons
                name="logout"
                size={40}
                color={canPunchOut ? "#fff" : "#999"}
              />
            )}
            <Text
              style={canPunchOut ? styles.activeText : styles.inactiveText}
            >
              {isProcessingPunch ? "Processing..." : "Punch Out"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========== SELFIE PREVIEW ========== */}
        {selfieUri && (
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Image
              source={{ uri: selfieUri }}
              style={{ width: 100, height: 100, borderRadius: 12 }}
            />
            <Text style={{ color: "#666", marginTop: 4, fontSize: 12 }}>
              Selfie Captured
            </Text>
          </View>
        )}

        {/* ========== CURRENT LOCATION CARD ========== */}
        <View style={styles.verificationCard}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.officeRow}>
            <View style={styles.officeIcon}>
              <MaterialIcons name="business" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.officeTitle} numberOfLines={3}>
                {currentAddress || "Fetching Location..."}
              </Text>
              <Text style={styles.officeSub}>
                {isWFH
                  ? "WFH Mode (Geo-fencing bypassed)"
                  : distance !== null
                  ? distance <= 500
                    ? "Within office premises"
                    : `${distance}m from office`
                  : "Calculating distance..."}
              </Text>
            </View>
          </View>
        </View>

        {/* ========== TODAY'S LOG ========== */}
        <View className="mt-6 mb-10">
          <Text style={styles.sectionTitle}>Today's Log</Text>

          {todayRecord && todayRecord.punch_in ? (
            <>
              <View style={[styles.logCard, { flexDirection: "column" }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <View style={styles.logIcon}>
                      <MaterialIcons name="login" size={22} color="#0052cc" />
                    </View>
                    <Text style={styles.logTitle}>Punch In</Text>
                  </View>
                  <Text style={{ fontWeight: "700", color: "#0052cc", fontSize: 18 }}>
                    {todayRecord.punch_in || "N/A"}
                  </Text>
                </View>
                <Text style={{ color: "#666", marginTop: 4, marginLeft: 57, fontSize: 13 }} numberOfLines={2} ellipsizeMode="tail">
                  {todayRecord.readable_address || "Office"}
                </Text>
              </View>

              {todayRecord.punch_out ? (
                <View style={[styles.logCard, { flexDirection: "column", marginTop: 8 }]}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <View style={styles.logIcon}>
                        <MaterialIcons name="logout" size={22} color="#0052cc" />
                      </View>
                      <Text style={styles.logTitle}>Punch Out</Text>
                    </View>
                    <Text style={{ fontWeight: "700", color: "#0052cc", fontSize: 18 }}>
                      {todayRecord.punch_out || "N/A"}
                    </Text>
                  </View>
                  <Text style={{ color: "#666", marginTop: 4, marginLeft: 57, fontSize: 13 }} numberOfLines={2} ellipsizeMode="tail">
                    {todayRecord.readable_address || "Office"}
                  </Text>
                </View>
              ) : (
                <Text style={{ color: "#666", textAlign: "center", marginTop: 12 }}>
                  Not punched out yet
                </Text>
              )}
            </>
          ) : (
            <Text style={{ color: "#666", textAlign: "center", marginTop: 16 }}>
              No activity yet today
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
