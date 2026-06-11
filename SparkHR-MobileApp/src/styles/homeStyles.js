import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  scrollContent: {
    paddingBottom: 24,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f4",
  },

  topBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003d9b",
  },

  topBarProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0052cc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d8e2ff",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  welcomeSection: {
    marginBottom: 20,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#051a3e",
  },

  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },

  dateTimeText: {
    fontSize: 14,
    color: "#434654",
  },

  bentoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  attendanceCard: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0052cc",
    shadowColor: "#091e42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  checkedInBadge: {
    backgroundColor: "#e8f0ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  checkedInBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0052cc",
  },

  shiftText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#051a3e",
  },

  attendanceTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  workingHoursLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#434654",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "right",
  },

  workingHoursValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0052cc",
    textAlign: "right",
  },

  progressSection: {
    marginTop: 12,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  progressLabel: {
    fontSize: 11,
    color: "#434654",
  },

  progressBar: {
    height: 10,
    backgroundColor: "#d8e2ff",
    borderRadius: 5,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#0052cc",
    borderRadius: 5,
  },

  attendanceFooter: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eef0f4",
  },

  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  footerText: {
    fontSize: 12,
    color: "#051a3e",
  },

  verificationCard: {
    flex: 1,
    backgroundColor: "#d8e2ff",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#091e42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  verificationTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#434654",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  officeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  officeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#0052cc",
    justifyContent: "center",
    alignItems: "center",
  },

  officeName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#051a3e",
  },

  officeSub: {
    fontSize: 11,
    color: "#434654",
  },

  gpsBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 10,
    padding: 10,
  },

  gpsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  gpsText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#006477",
  },

  actionCenter: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  punchInBtn: {
    flex: 1,
    backgroundColor: "#f1f3ff",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#c3c6d6",
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },

  punchOutBtn: {
    flex: 1,
    backgroundColor: "#0052cc",
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0052cc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  punchBtnIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  punchBtnText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#051a3e",
    marginBottom: 14,
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },

  quickActionItem: {
    width: "30.5%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    gap: 8,
    shadowColor: "#091e42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  quickActionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#434654",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#091e42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#434654",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  metricItem: {
    alignItems: "center",
  },

  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#051a3e",
  },

  metricValuePrimary: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0052cc",
  },

  metricLabel: {
    fontSize: 11,
    color: "#434654",
    marginTop: 2,
  },

  aiCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    overflow: "hidden",
    position: "relative",
  },

  aiCardGradient: {
    backgroundColor: "#0052cc",
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  aiTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  aiMessage: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    marginBottom: 12,
  },

  aiButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  aiButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  holidaySection: {
    marginBottom: 24,
  },

  holidayCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3ff",
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },

  holidayDateBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#006477",
    justifyContent: "center",
    alignItems: "center",
  },

  holidayDateMonth: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },

  holidayDateDay: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  holidayInfo: {
    flex: 1,
  },

  holidayName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#051a3e",
  },

  holidaySub: {
    fontSize: 11,
    color: "#434654",
    marginTop: 2,
  },

  announcementCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eef0f4",
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },

  announcementTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#051a3e",
  },

  announcementSub: {
    fontSize: 11,
    color: "#434654",
    marginTop: 2,
  },
});

export default styles;
