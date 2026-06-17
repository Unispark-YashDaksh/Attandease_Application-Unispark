import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";

export default function Header({
  title = "SparkHR",
  onProfilePress,
  showBack,
  onBackPress,
}) {
  return (
    <View style={styles.topBar}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#003d9b" />
        </TouchableOpacity>
      ) : null}
      <Text style={[styles.topBarTitle, showBack && styles.topBarTitleWithBack]}>
        {title}
      </Text>
      {!showBack ? (
        <TouchableOpacity style={styles.topBarProfile} onPress={onProfilePress}>
          <MaterialIcons name="person" size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitleWithBack: {
    flex: 1,
    marginLeft: 8,
  },
});