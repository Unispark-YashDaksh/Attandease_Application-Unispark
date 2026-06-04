import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  header: {
    height: 70,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003D9B",
  },

  notification: {
    fontSize: 22,
  },

  profileSection: {
    alignItems: "center",
    padding: 25,
  },

  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },

  employeeName: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 15,
  },

  designation: {
    color: "#666",
    marginTop: 5,
  },

  actionContainer: {
    flexDirection: "row",
    marginTop: 20,
  },

  messageBtn: {
    backgroundColor: "#DDE7FF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
  },

  editBtn: {
    backgroundColor: "#003D9B",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
  },

  messageText: {
    color: "#003D9B",
    fontWeight: "600",
  },

  editText: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },

  infoRow: {
    marginBottom: 18,
  },

  infoLabel: {
    color: "#666",
    fontSize: 12,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 3,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },

  settingText: {
    fontSize: 15,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    elevation: 10,
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 20,
  },

  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  activeNav: {
    color: "#003D9B",
    fontWeight: "700",
  },
});