import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import styles from "../../../styles/applyLeaveStyles";

export default function ApplyLeaveScreen() {
  const [selectedType, setSelectedType] = useState("Annual");

  const leaveTypes = ["Sick", "Casual", "Earn Leave"];

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color="#0052cc"
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Apply Leave
            </Text>
          </View>

          <View style={styles.headerRight}>
            <MaterialIcons
              name="notifications"
              size={24}
              color="#0052cc"
            />
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.totalCard}>
          
          <View>
            <Text style={styles.totalLabel}>
              Total Available
            </Text>

            <Text style={styles.totalDays}>
              24 Days
            </Text>
          </View>

          <View style={styles.totalIcon}>
            <MaterialIcons
              name="event-available"
              size={32}
              color="#0052cc"
            />
          </View>

        </View>

        {/* Small Cards */}
        <View style={styles.smallCardsRow}>
          
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>
              Casual Leave
            </Text>

            <Text style={styles.smallCardNumber}>
              12
            </Text>

            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>
              Sick
            </Text>

            <Text style={styles.smallCardNumber}>
              08
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: "40%" },
                ]}
              />
            </View>
          </View>

        </View>

        {/* Form */}
        <View style={styles.formCard}>
          
          <Text style={styles.label}>
            Select Leave Type
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            {leaveTypes.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedType(item)}
                style={[
                  styles.leaveChip,
                  selectedType === item &&
                    styles.activeChip,
                ]}
              >
                <Text
                  style={[
                    styles.leaveChipText,
                    selectedType === item &&
                      styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Date Inputs */}
          <View style={styles.dateRow}>
            
            <View style={styles.dateBox}>
              <Text style={styles.label}>
                From
              </Text>

              <TextInput
                placeholder="DD/MM/YYYY"
                style={styles.input}
              />
            </View>

            <View style={styles.dateBox}>
              <Text style={styles.label}>
                To
              </Text>

              <TextInput
                placeholder="DD/MM/YYYY"
                style={styles.input}
              />
            </View>

          </View>

          {/* Reason */}
          <View className="mt-5">
            
            <Text style={styles.label}>
              Reason for Leave
            </Text>

            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Briefly describe your reason..."
              style={styles.textArea}
            />

          </View>

          {/* Upload */}
          <TouchableOpacity style={styles.uploadBox}>
            
            <MaterialIcons
              name="upload-file"
              size={28}
              color="#777"
            />

            <Text style={styles.uploadText}>
              Attach document
            </Text>

          </TouchableOpacity>

        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyBtn}>
          
          <Text style={styles.applyBtnText}>
            Apply Leave Request
          </Text>

          <MaterialIcons
            name="send"
            size={20}
            color="#fff"
          />

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}