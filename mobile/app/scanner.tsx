import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CameraView} from "expo-camera"

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No access to camera</Text>
        <Button
          title="Request Permission Again"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    
    console.log("Scanned QR data:", data); // Debug log

    try {
      // Parse the QR code data
      let qrData;
      try {
        qrData = JSON.parse(data);
        console.log("Parsed QR data:", qrData); // Debug log
      } catch (parseError) {
        console.error("QR parsing error:", parseError);
        Alert.alert("❌ Invalid QR Code", "The QR code format is not valid");
        return;
      }

      // Validate QR data structure
      if (!qrData.sessionId || !qrData.qrCode) {
        console.error("Missing fields in QR:", qrData);
        Alert.alert(
          "❌ Invalid QR Code", 
          `Missing required fields. Found: ${Object.keys(qrData).join(', ')}`
        );
        return;
      }

      // Get stored user data
      const stored = await AsyncStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      
      console.log("User data:", user); // Debug log

      if (!user || !user.id) {
        Alert.alert("❌ Error", "No user logged in or user ID missing");
        return;
      }

      // Check if session is expired (if expiry info is in QR)
      if (qrData.expiresAt) {
        const expiryTime = new Date(qrData.expiresAt);
        const currentTime = new Date();
        if (currentTime > expiryTime) {
          Alert.alert("❌ Session Expired", "This QR code has expired");
          return;
        }
      }

      console.log("Sending attendance request with:", {
        sessionId: qrData.sessionId,
        qrCode: qrData.qrCode,
        studentId: user.id,
      }); // Debug log

      // Make API request to mark attendance
      const response = await fetch("http://192.168.1.9:5000/attendance/mark", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          sessionId: qrData.sessionId,
          qrCode: qrData.qrCode,
          studentId: user.id,
        }),
      });

      console.log("Response status:", response.status); // Debug log

      const result = await response.json();
      console.log("Response data:", result); // Debug log

      if (response.ok) {
        Alert.alert(
          "✅ Attendance Marked Successfully!", 
          `Class: ${qrData.classId}\nTime: ${new Date().toLocaleTimeString()}`
        );
      } else {
        Alert.alert(
          "❌ Attendance Failed", 
          result.error || result.message || "Failed to mark attendance"
        );
      }

    } catch (networkError) {
      console.error("Network error:", networkError);
      Alert.alert(
        "❌ Network Error", 
        "Could not connect to server. Please check your internet connection."
      );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      {/* Scan overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructionText}>
          Point your camera at the QR code
        </Text>
      </View>

      {scanned && (
        <View style={styles.buttonContainer}>
          <Button 
            title="Scan Again" 
            onPress={() => setScanned(false)}
            color="#007AFF"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#ff0000"
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00ff00',
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
});