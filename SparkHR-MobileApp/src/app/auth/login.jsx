import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Pressable
} from "react-native";
import axios from "axios";
import styles from "../../styles/loginStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  VITE_API
} from "@env";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true)
  try {

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    console.log("Sending Login Request");

    const response = await axios.post(
      `${VITE_API}/login`,
      {
        email,
        password
      }
    );

    console.log("Response:", response.data);

    if (response.data.success) {

      await AsyncStorage.setItem(
        "employee_id",
        String(response.data.user.employee_id)
      );

      await AsyncStorage.setItem(
        "employee_email",
        response.data.user.employee_email
      );

      alert(response.data.message);

      router.replace("/(root)/(tabs)");
    }

  } catch (error) {

    console.log("Full Error:", error);

    console.log(
      "Response Data:",
      error.response?.data
    );

    console.log(
      "Message:",
      error.message
    );

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }finally
  {
    setLoading(false)
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View>
        <Image
          source={require("../../../assets/CompanyLogo/logo.jpg")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Sign in to continue
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>

          <TextInput
            placeholder="Enter Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.loginButton}
        onPress={handleLogin}>
        <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
<TouchableOpacity>
  <Text style={styles.forgotText}>
    Forgot Password?
  </Text>
</TouchableOpacity>
<View style={styles.registerContainer}>
  <Text style={styles.registerText}>
    Don't have a SparkHR account?
  </Text>

  <Pressable
    onPress={() => router.push("/auth/signup")}
    style={({ pressed }) => ({
      opacity: pressed ? 0.6 : 1,
      transform: [{ scale: pressed ? 0.95 : 1 }],
    })}
  >
    <Text style={styles.registerLink}>
      Create Account
    </Text>
  </Pressable>
</View>
      </View>
 
    </SafeAreaView>
  );
}