/**
 * Approvals Screen
 *
 * Purpose:
 *   Shows all pending WFH + Leave requests from direct subordinates
 *   (employees whose reporting_manager_id = logged-in employee).
 *   Manager can Approve or Reject each request.
 *
 * Flow:
 *   1. On mount → read employee_id from AsyncStorage
 *   2. Call GET /pending-approvals/{employeeId}
 *   3. Display combined list of WFH and Leave requests
 *   4. Manager taps Approve/Reject → calls respective API
 *   5. On success → refresh the list
 *
 * Hierarchy check (backend):
 *   - Backend verifies the approver's ID matches the requester's
 *     reporting_manager_id before allowing the action.
 *   - A regular employee will see 0 pending items (no subordinates).
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { VITE_API } from "@env";
import Header from "../../components/Header";
import AnimatedScreen from "../../components/AnimatedScreen";
import usePullToRefresh from "../../hooks/usePullToRefresh";
import styles from "../../styles/approvalsStyles";

// Icon config for request types
const TYPE_CONFIG = {
  WFH: { icon: "home-work", bg: "#E3F2FD", color: "#1565C0" },
  LEAVE: { icon: "event-busy", bg: "#FFF3E0", color: "#E65100" },
};

// Helper: format date string to readable format
const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function ApprovalsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]); // IDs being approved/rejected

  // Fetch pending approvals from backend
  const fetchPendingApprovals = useCallback(async () => {
    try {
      const employeeId = await AsyncStorage.getItem("employee_id");
      if (!employeeId) return;
      const res = await axios.get(
        `${VITE_API}/pending-approvals/${employeeId}`,
      );
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.log("Fetch Approvals Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Pull-to-refresh using the central hook
  const { refreshing, onRefresh } = usePullToRefresh(fetchPendingApprovals);

  // Fetch on mount
  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  /**
   * Handle Approve/Reject action
   *
   * @param {Object} item - The request object from the list
   * @param {"APPROVED" | "REJECTED"} newStatus - Target status
   *
   * Flow:
   *   1. Confirm with manager via Alert
   *   2. Mark this item as "processing" (shows spinner on its button)
   *   3. Call the appropriate endpoint:
   *      - WFH:  PUT /wfh-request/{id}/approve
   *      - LEAVE: PUT /leave-applications/{id}/status
   *   4. On success → remove item from list or update its status
   *   5. On error → show error message
   */
  const handleAction = async (item, newStatus) => {
    const actionLabel = newStatus === "APPROVED" ? "approve" : "reject";
    const confirmMsg = `Are you sure you want to ${actionLabel} the ${
      item.requestType
    } request from ${item.employee_name}?`;

    Alert.alert("Confirm", confirmMsg, [
      { text: "Cancel", style: "cancel" },
      {
        text: newStatus === "APPROVED" ? "Approve" : "Reject",
        style: newStatus === "REJECTED" ? "destructive" : "default",
        onPress: async () => {
          try {
            // Add this item's ID to processing list (disables its buttons)
            setProcessingIds((prev) => [...prev, item.id]);

            const employeeId = await AsyncStorage.getItem("employee_id");
            if (!employeeId) return;

            let res;

            // Route to the correct endpoint based on request type
            if (item.requestType === "WFH") {
              // WFH uses the dedicated approve endpoint
              res = await axios.put(
                `${VITE_API}/wfh-request/${item.id}/approve`,
                {
                  status: newStatus,
                  approved_by: parseInt(employeeId),
                },
              );
            } else {
              // Leave uses the existing leave status endpoint
              res = await axios.put(
                `${VITE_API}/leave-applications/${item.id}/status`,
                {
                  status: newStatus,
                  approved_by: parseInt(employeeId),
                },
              );
            }

            if (res.data.success || res.data.message) {
              // Remove the processed item from the list
              setRequests((prev) =>
                prev.filter((r) => r.id !== item.id),
              );
              Alert.alert(
                "Success",
                `${item.requestType} request ${newStatus.toLowerCase()} successfully`,
              );
            }
          } catch (err) {
            const msg =
              err.response?.data?.error ||
              err.response?.data?.message ||
              err.message;
            Alert.alert("Error", msg);
          } finally {
            // Remove this item's ID from processing list
            setProcessingIds((prev) => prev.filter((id) => id !== item.id));
          }
        },
      },
    ]);
  };

  /**
   * Render each request card
   */
  const renderItem = ({ item }) => {
    const typeCfg = TYPE_CONFIG[item.requestType] || TYPE_CONFIG.WFH;
    const isProcessing = processingIds.includes(item.id);

    return (
      <View style={styles.card}>
        {/* Top row: employee info + status badge */}
        <View style={styles.cardTop}>
          <View style={styles.typeBadge}>
            <View style={[styles.badgeIcon, { backgroundColor: typeCfg.bg }]}>
              <MaterialIcons
                name={typeCfg.icon}
                size={16}
                color={typeCfg.color}
              />
            </View>
            <View>
              <Text style={styles.employeeName}>{item.employee_name}</Text>
              <Text style={styles.employeeCode}>{item.employee_code}</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {item.requestType} • PENDING
            </Text>
          </View>
        </View>

        {/* Date range */}
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <MaterialIcons name="calendar-month" size={14} color="#999" />
            <Text style={styles.dateLabel}>From: </Text>
            <Text style={styles.dateValue}>{formatDate(item.start_date)}</Text>
          </View>
          <View style={styles.dateItem}>
            <MaterialIcons name="calendar-month" size={14} color="#999" />
            <Text style={styles.dateLabel}>To: </Text>
            <Text style={styles.dateValue}>{formatDate(item.end_date)}</Text>
          </View>
        </View>

        {/* Leave type name (only for LEAVE) */}
        {item.requestType === "LEAVE" && item.leave_type_name && (
          <Text style={styles.reasonText}>Type: {item.leave_type_name}</Text>
        )}

        {/* Reason */}
        {item.reason ? (
          <Text style={styles.reasonText}>Reason: {item.reason}</Text>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Action buttons */}
        <View style={styles.actionRow}>
          {/* Reject Button */}
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleAction(item, "REJECTED")}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#C62828" />
            ) : (
              <MaterialIcons name="close" size={16} color="#C62828" />
            )}
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>

          {/* Approve Button */}
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleAction(item, "APPROVED")}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#2E7D32" />
            ) : (
              <MaterialIcons name="check" size={16} color="#2E7D32" />
            )}
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Empty state component
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="check-circle"
          size={64}
          color="#ddd"
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>No pending approvals</Text>
        <Text style={styles.emptySubtext}>
          All requests have been reviewed
        </Text>
      </View>
    );
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header
          title="Approvals"
          showBack
          onBackPress={() => router.back()}
        />

        {/* Info banner */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={18} color="#1565C0" />
          <Text style={styles.infoText}>
            Pending requests from your team members. Approve or reject
            each request.
          </Text>
        </View>

        {/* Loading state */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0052cc"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={requests}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.requestType}-${item.id}`}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )}
      </SafeAreaView>
    </AnimatedScreen>
  );
}
