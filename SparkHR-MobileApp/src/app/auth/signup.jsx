import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable
} from "react-native";
import {
  VITE_API
} from "@env";
import axios from "axios";

import { router } from "expo-router";
import styles from "../../styles/signupStyles";

export default function Signup() {

  const [fullName, setFullName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleSignup = async() => {
    try{
        if(!employeeCode||!email || !password || !confirmPassword){
            alert("All Fields are required")
            return
        }

        if(password!== confirmPassword){
            alert("Password do not match")
            return
        }

        const response = await axios.post(
      `${VITE_API}/register`,
      {
        employeeCode,
        email,
        password
      }
    );
    console.log(response.data);
    alert(response.data.message)
    }catch(error){
        console.log(error.response?.data);
        console.log(error.message)
    }
   
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Image
                  source={require("../../../assets/CompanyLogo/logo.jpg")}
                  style={styles.logo}
                />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Create your employee account
        </Text>
      </View>

      <View>

        {/* <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
        /> */}

        <Text style={styles.label}>Employee Code</Text>
        <TextInput
          style={styles.input}
          placeholder="UNI1234"
          value={employeeCode}
          onChangeText={setEmployeeCode}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@unisparkinnovation.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.signupBtn}
          onPress={handleSignup}
        >
          <Text style={styles.signupText}>
            Create Account
          </Text>
        </TouchableOpacity>

        <Pressable
          onPress={() => router.push("/auth/login")}
          style={({pressed})=>({
        opacity: pressed ? 0.5: 1,
        transform:[
            {
                scale: pressed ? 0.95 : 1,
            },
        ],
    })}
        >
          <Text style={styles.loginLink}>
            Already have an account? Login
          </Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}