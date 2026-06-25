import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  // ============================================================
  // PROFILE HEADER GRADIENT AREA
  // ============================================================
  headerBg: {
    paddingTop: 16,
    paddingBottom: 36,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#E3F2FD",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#8e9bb3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarImage: {
    width: 102,
    height: 102,
    borderRadius: 51,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1565C0",
  },
  employeeName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a2e",
    marginTop: 14,
  },
  designation: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  codeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    gap: 5,
  },
  codeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1565C0",
  },
  // ============================================================
  // SECTION TITLES
  // ============================================================
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  // ============================================================
  // CARDS
  // ============================================================
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 4,
    elevation: 2,
    shadowColor: "#091e42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f4",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  // ============================================================
  // SETTINGS ROW
  // ============================================================
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f4",
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingText: {
    fontSize: 15,
    color: "#1a1a2e",
    fontWeight: "500",
  },
  settingArrow: {
    color: "#ccc",
  },
  // ============================================================
  // LOGOUT
  // ============================================================
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#C62828",
  },
  // ============================================================
  // EMPTY / LOADING
  // ============================================================
  loader: {
    paddingTop: 60,
  },
  // ============================================================
  // LAST CARD WRAPPER (groups the settings card)
  // ============================================================
  lastCard: {
    marginBottom: 20,
  },
});

export default styles;
