import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 250,
    height: 75,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 10
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 5,
    marginBottom: 25,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    width: 300
  },

  loginButton: {
    backgroundColor: "#2563EB",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  forgotText: {
    marginTop: 18,
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "600",
  },

  registerContainer: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 20,
},

registerText: {
  color: "#6B7280",
  fontSize: 14,
},

registerLink: {
  color: "#2563EB",
  fontWeight: "700",
  marginLeft: 5,
},
});

