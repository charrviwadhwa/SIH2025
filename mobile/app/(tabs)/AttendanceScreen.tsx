import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function AttendanceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const response = await fetch("http://192.168.1.9:5000/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: 13,   // replace with dynamic session
          studentId: 101,  // replace with logged-in student
          qrCode: data     // scanned QR code
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("✅ Success", result.message);
      } else {
        Alert.alert("❌ Error", result.error);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Error", "Could not connect to server");
    }
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!permission.granted) {
    return (
      <View>
        <Text>We need camera permission to scan QR codes</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], // only scan QR codes
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      {scanned && (
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", justifyContent: "center" },
});
