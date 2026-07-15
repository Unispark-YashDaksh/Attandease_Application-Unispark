import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#091e42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  employeeCode: {
    fontSize: 11,
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#E65100",
  },
  dateRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateLabel: {
    fontSize: 11,
    color: "#999",
  },
  dateValue: {
    fontSize: 12,
    color: "#434654",
    fontWeight: "500",
  },
  reasonText: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#eef0f4",
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
  },
  rejectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C62828",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#434654",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#999",
  },
  loader: {
    paddingTop: 40,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  infoText: {
    color: "#1565C0",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});

export default styles;
