import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ScannerScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ScannerScreen({ navigation }: ScannerScreenProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false); // Prevent multiple requests

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

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    // Prevent multiple scans
    if (scanned || processing) {
      return;
    }

    setScanned(true);
    setProcessing(true);
    
    // Extract data from scanning result
    const data = scanningResult.data;
    console.log("Scanned QR data:", data);
    console.log("Full scanning result:", scanningResult);

    try {
      // Parse the QR code data
      let qrData;
      try {
        qrData = JSON.parse(data);
        console.log("Parsed QR data:", qrData);
      } catch (parseError) {
        console.error("QR parsing error:", parseError);
        Alert.alert("❌ Invalid QR Code", "The QR code format is not valid");
        setProcessing(false);
        setScanned(false);
        return;
      }

      // Validate QR data structure
      if (!qrData.sessionId || !qrData.qrCode) {
        console.error("Missing fields in QR:", qrData);
        Alert.alert(
          "❌ Invalid QR Code", 
          `Missing required fields. Found: ${Object.keys(qrData).join(', ')}`
        );
        setProcessing(false);
        setScanned(false);
        return;
      }

      // Get stored user data
      const stored = await AsyncStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      
      console.log("User data:", user);

      if (!user || !user.id) {
        Alert.alert("❌ Error", "No user logged in or user ID missing");
        setProcessing(false);
        setScanned(false);
        return;
      }

      // Check if session is expired (if expiry info is in QR)
      if (qrData.expiresAt) {
        const expiryTime = new Date(qrData.expiresAt);
        const currentTime = new Date();
        if (currentTime > expiryTime) {
          Alert.alert("❌ Session Expired", "This QR code has expired");
          setProcessing(false);
          setScanned(false);
          return;
        }
      }

      console.log("Sending attendance request with:", {
        sessionId: qrData.sessionId,
        qrCode: qrData.qrCode,
        studentId: user.id,
      });

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

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        console.log("Attendance marked successfully, navigating to success screen");
        
        // Navigate to success screen with attendance data using Expo Router
        const attendanceData = {
          course: result.session?.course || 'Unknown Course',
          sessionId: result.attendance.sessionId,
          markedAt: result.attendance.markedAt,
          studentId: user.id,
          studentEmail: user.email
        };

        router.push({
          pathname: '/AttendanceSuccessScreen',
          params: {
            attendanceData: JSON.stringify(attendanceData)
          }
        });
      } else {
        Alert.alert(
          "❌ Attendance Failed", 
          result.error || result.message || "Failed to mark attendance",
          [
            {
              text: "OK",
              onPress: () => {
                setProcessing(false);
                setScanned(false);
              }
            }
          ]
        );
      }

    } catch (networkError) {
      console.error("Network error:", networkError);
      Alert.alert(
        "❌ Network Error", 
        "Could not connect to server. Please check your internet connection.",
        [
          {
            text: "OK",
            onPress: () => {
              setProcessing(false);
              setScanned(false);
            }
          }
        ]
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
          {processing ? "Processing..." : "Point your camera at the QR code"}
        </Text>
      </View>

      {scanned && !processing && (
        <View style={styles.buttonContainer}>
          <Button 
            title="Scan Again" 
            onPress={() => {
              setScanned(false);
              setProcessing(false);
            }}
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