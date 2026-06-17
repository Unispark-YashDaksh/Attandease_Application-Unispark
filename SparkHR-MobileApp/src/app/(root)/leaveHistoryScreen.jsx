import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Header";
import AnimatedScreen from "../../components/AnimatedScreen";
import { fetchLeaveHistory } from "../../services/leaveApi";
import styles from "../../styles/leaveHistoryStyles";

const STATUS_FILTERS = ["All", "PENDING", "APPROVED", "REJECTED"];

const STATUS_COLORS = {
  PENDING: { bg: "#FFF3E0", text: "#E65100" },
  APPROVED: { bg: "#E8F5E9", text: "#2E7D32" },
  REJECTED: { bg: "#FFEBEE", text: "#C62828" },
};

const LEAVE_ICONS = {
  SL: { icon: "hotel", bg: "#E8F5E9", color: "#2E7D32" },
  CL: { icon: "wb-sunny", bg: "#FFF3E0", color: "#E65100" },
  EL: { icon: "card-giftcard", bg: "#E3F2FD", color: "#1565C0" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const hours = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hours}:${mins}`;
};

export default function LeaveHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const loadHistory = useCallback(async (empId, status) => {
    try {
      const filter = status === "All" ? undefined : status;
      const res = await fetchLeaveHistory(empId, filter);
      setHistory(res.data || []);
    } catch (_) {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("employee_id").then((id) => {
      if (id) {
        setEmployeeId(id);
        setLoading(true);
        loadHistory(id, "All").finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (employeeId) {
      loadHistory(employeeId, filter);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (employeeId) {
      loadHistory(employeeId, activeFilter).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [employeeId, activeFilter]);

  const renderItem = ({ item }) => {
    const icon = LEAVE_ICONS[item.code] || { icon: "event", bg: "#f0f0f5", color: "#999" };
    const statusColor = STATUS_COLORS[item.status] || { bg: "#f0f0f5", text: "#666" };

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.leaveTypeBadge}>
            <View style={[styles.badgeIcon, { backgroundColor: icon.bg }]}>
              <MaterialIcons name={icon.icon} size={18} color={icon.color} />
            </View>
            <Text style={styles.badgeText}>{item.leave_name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <MaterialIcons name="calendar-today" size={14} color="#999" />
            <Text style={styles.dateLabel}>From: </Text>
            <Text style={styles.dateValue}>{formatDate(item.from_date)}</Text>
          </View>
          <View style={styles.dateItem}>
            <MaterialIcons name="calendar-today" size={14} color="#999" />
            <Text style={styles.dateLabel}>To: </Text>
            <Text style={styles.dateValue}>{formatDate(item.to_date)}</Text>
          </View>
          <View style={styles.dateItem}>
            <MaterialIcons name="looks-one" size={14} color="#999" />
            <Text style={styles.dateValue}>{item.total_days} day{item.total_days > 1 ? "s" : ""}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Text style={styles.reasonText} numberOfLines={1}>
            {item.reason || "No reason provided"}
          </Text>
          <Text style={styles.approvedByText}>
            Applied: {formatDateTime(item.applied_on)}
          </Text>
        </View>

        {item.approved_by_name && (
          <View style={[styles.footerRow, { marginTop: 6 }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MaterialIcons name="check-circle" size={14} color="#2E7D32" />
              <Text style={[styles.approvedByText, { color: "#2E7D32" }]}>
                Approved by: {item.approved_by_name}
              </Text>
            </View>
            {item.approved_on && (
              <Text style={styles.approvedByText}>
                {formatDateTime(item.approved_on)}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="history" size={64} color="#ddd" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>No leave history found</Text>
        <Text style={styles.emptySubtext}>Pull down to refresh</Text>
      </View>
    );
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header
          title="Leave History"
          showBack
          onBackPress={() => router.back()}
        />

        <View style={styles.filterRow}>
          {STATUS_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter === "All" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0052cc" style={styles.loader} />
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeAreaView>
    </AnimatedScreen>
  );
}
