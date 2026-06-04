import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  header: {
    marginTop: 60,
    marginBottom: 10,
  },

  logo: {
    width: 230,
    height: 70,
    alignSelf: "center",
    borderRadius: 10
  },


  title: {
    fontSize: 25,
    fontWeight: "700",
    marginTop: 10,
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#6B7280",
  },

//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 20,

//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
    color: "#374151",
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
  },

  signupBtn: {
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  signupText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  loginLink: {
    textAlign: "center",
    marginTop: 18,
    color: "#2563EB",
    fontWeight: "600",
  },

});

export default styles;