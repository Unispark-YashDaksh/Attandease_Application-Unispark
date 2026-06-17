import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a2e",
  },

  greetingSub: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },

  profileCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0052cc",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
  },

  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0052cc",
  },

  balanceScroll: {
    marginLeft: -16,
    paddingLeft: 16,
  },

  balanceCard: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    elevation: 2,
  },

  balanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  balanceCount: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
  },

  balanceLabel: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  bar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 3,
  },

  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  calendarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },

  calendarNav: {
    flexDirection: "row",
    gap: 8,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },

  weekDay: {
    width: 36,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
  },

  dayBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  todayBox: {
    backgroundColor: "#0052cc",
  },

  dayText: {
    fontSize: 13,
    color: "#444",
  },

  todayText: {
    color: "#fff",
    fontWeight: "700",
  },

  holidayCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },

  holidayDateBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },

  holidayDateText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#E65100",
  },

  holidayInfo: {
    flex: 1,
    marginLeft: 14,
  },

  holidayName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
  },

  holidayDay: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  holidayListContainer: {
    maxHeight: 340,
    borderRadius: 16,
    overflow: "hidden",
  },

  holidayScrollView: {
    flexGrow: 0,
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },

  chipScroll: {
    marginBottom: 16,
  },

  leaveChip: {
    backgroundColor: "#f0f0f5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  activeChip: {
    backgroundColor: "#0052cc",
    borderColor: "#0052cc",
  },

  leaveChipText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 13,
  },

  activeChipText: {
    color: "#fff",
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  dateBox: {
    flex: 1,
  },

  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 4,
  },

  dateInputText: {
    color: "#aaa",
    fontSize: 13,
  },

  halfDayRow: {
    flexDirection: "row",
    marginTop: 14,
  },

  halfDayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  halfDayText: {
    color: "#777",
    fontSize: 14,
  },

  textArea: {
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    padding: 14,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#333",
    minHeight: 100,
  },

  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#0052cc",
    borderRadius: 14,
    padding: 18,
    marginTop: 18,
    backgroundColor: "#F0F4FF",
  },

  uploadText: {
    color: "#0052cc",
    fontWeight: "600",
    fontSize: 14,
  },

  applyBtn: {
    backgroundColor: "#0052cc",
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  applyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default styles;
