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

  backBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 100,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0052cc",
    marginLeft: 10,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  profileCircle: {
    width: 35,
    height: 35,
    borderRadius: 100,
    backgroundColor: "#0052cc",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#fff",
    fontWeight: "700",
  },

  totalCard: {
    marginTop: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  totalLabel: {
    color: "#666",
    marginBottom: 5,
  },

  totalDays: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0052cc",
  },

  totalIcon: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "#e8f0ff",
    justifyContent: "center",
    alignItems: "center",
  },

  smallCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  smallCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 3,
  },

  smallCardLabel: {
    color: "#777",
    fontSize: 12,
  },

  smallCardNumber: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginTop: 14,
  },

  progressFill: {
    width: "65%",
    height: "100%",
    backgroundColor: "#0052cc",
    borderRadius: 20,
  },

  formCard: {
    backgroundColor: "#fff",
    marginTop: 25,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },

  leaveChip: {
    backgroundColor: "#eee",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: "#0052cc",
  },

  leaveChipText: {
    color: "#555",
    fontWeight: "600",
  },

  activeChipText: {
    color: "#fff",
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  dateBox: {
    width: "48%",
  },

  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 8,
  },

  textArea: {
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    padding: 15,
    marginTop: 10,
    textAlignVertical: "top",
  },

  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  uploadText: {
    marginTop: 8,
    color: "#666",
  },

  applyBtn: {
    backgroundColor: "#0052cc",
    marginTop: 30,
    marginBottom: 40,
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  applyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

});

export default styles;