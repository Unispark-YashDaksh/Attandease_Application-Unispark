import React, { useRef } from "react";
import { View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function SelfieCameraModal({ visible, onCapture, onCancel }) {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      onCapture(photo.uri);
    } catch (err) {
      console.log("Selfie capture error:", err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />
        <View style={[StyleSheet.absoluteFillObject, styles.overlay]}>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.captureArea}>
            <TouchableOpacity style={styles.captureOuter} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginRight: 20,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 24,
  },
  captureArea: {
    alignItems: "center",
  },
  captureOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
});
