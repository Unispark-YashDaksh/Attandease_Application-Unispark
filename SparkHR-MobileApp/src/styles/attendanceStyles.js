import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#faf9ff",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0052cc",
    marginLeft: 10,
    marginTop: 30
  },

  settingBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 100,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  dateText: {
    color: "#666",
    marginLeft: 5,
  },

  dot: {
    marginHorizontal: 8,
    color: "#666",
  },

  statusCard: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  checkInBadge: {
    backgroundColor: "#dbe7ff",
    color: "#0052cc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "600",
    alignSelf: "flex-start",
  },

  shiftText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  workingLabel: {
    color: "#666",
    fontSize: 12,
  },

  workingHours: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0052cc",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressText: {
    color: "#666",
    fontSize: 13,
  },

  progressBar: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginTop: 10,
  },

  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#0052cc",
    borderRadius: 20,
  },

  buttonGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  inactiveButton: {
    width: "48%",
    backgroundColor: "#eee",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  activeButton: {
    width: "48%",
    backgroundColor: "#0052cc",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  inactiveText: {
    marginTop: 10,
    fontWeight: "600",
    color: "#666",
  },

  activeText: {
    marginTop: 10,
    fontWeight: "600",
    color: "#fff",
  },

  verificationCard: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  officeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  officeIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#0052cc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  officeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  officeSub: {
    color: "#666",
    marginTop: 2,
  },

  logCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logIcon: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#e7f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  logTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  logSub: {
    color: "#666",
    marginTop: 2,
  },

  logTime: {
    fontWeight: "700",
    color: "#0052cc",
  },

});

export default styles;