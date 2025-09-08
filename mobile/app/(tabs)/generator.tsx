
// Option 1: Add a unique session ID and verify with backend

// Updated Generator (GeneratorScreen.tsx)
import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SecureGeneratorScreen() {
  const [classId, setClassId] = useState("");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  // Regular QR generation (your current method)
  const generateQR = async () => {
    if (!classId.trim()) {
      Alert.alert("Error", "Please enter a Class ID");
      return;
    }

    setLoading(true);
    
    try {
      const stored = await AsyncStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      if (!user) {
        Alert.alert("Error", "No teacher logged in!");
        return;
      }

      console.log("Generating QR for user:", user);

      // Create QR data with all necessary fields
      const currentDate = new Date();
      const expiryDate = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

      const qrData = {
        classId: classId.trim(),
        teacherId: user.id,
        date: currentDate.toISOString(),
        expiresAt: expiryDate.toISOString(),
        teacherName: user.name || "Unknown Teacher",
        generatedAt: currentDate.toISOString()
      };

      console.log("Generated QR data:", qrData);

      // Set QR value for display
      const qrString = JSON.stringify(qrData);
      setQrValue(qrString);
      
      // Store session info for display
      setSessionInfo({
        classId: qrData.classId,
        teacherId: qrData.teacherId,
        teacherName: qrData.teacherName,
        createdAt: currentDate.toLocaleString(),
        expiresAt: expiryDate.toLocaleString()
      });

      Alert.alert("✅ Success", "QR Code generated successfully!");

    } catch (error) {
      console.error("QR generation error:", error);
      Alert.alert("❌ Error", "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  // Clear QR and reset form
  const clearQR = () => {
    setQrValue(null);
    setSessionInfo(null);
    setClassId("");
    Alert.alert("Cleared", "QR code cleared successfully");
  };

  const generateSecureQR = async () => {
    if (!classId.trim()) {
      Alert.alert("Error", "Please enter a Class ID");
      return;
    }

    setLoading(true);
    
    try {
      const stored = await AsyncStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      if (!user) {
        Alert.alert("Error", "No teacher logged in!");
        return;
      }

      // 🔐 STEP 1: Create session on backend first
      const response = await fetch("http://192.168.1.9:5000/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          course: classId.trim(),
          facultyId: user.id,
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create session on server");
      }

      const sessionData = await response.json();
      console.log("Backend session created:", sessionData);

      // 🔐 STEP 2: Create QR with backend-generated sessionId and qrCode
      const qrData = {
        sessionId: sessionData.session.id,        // Unique session ID from backend
        qrCode: sessionData.session.qrCode,      // Unique QR code from backend
        classId: sessionData.session.course,     // Keep for compatibility
        teacherId: sessionData.session.facultyId,
        date: sessionData.session.createdAt,
        expiresAt: sessionData.session.expiresAt,
        // 🔐 Add a hash for extra security (optional)
        hash: generateSimpleHash(sessionData.session.id, sessionData.session.qrCode, user.id)
      };

      console.log("Secure QR data:", qrData);
      setQrValue(JSON.stringify(qrData));
      setSessionInfo(sessionData.session);

      Alert.alert("✅ Success", "Secure QR Code generated!");

    } catch (error) {
      console.error("Secure QR generation error:", error);
      Alert.alert("❌ Error", "Failed to generate secure QR code");
    } finally {
      setLoading(false);
    }
  };

  // Simple hash function for additional verification
  const generateSimpleHash = (sessionId: number, qrCode: string, teacherId: number) => {
    const data = `${sessionId}-${qrCode}-${teacherId}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Secure Class QR</Text>
      
      <TextInput
        placeholder="Enter Class ID"
        style={styles.input}
        value={classId}
        onChangeText={setClassId}
        editable={!loading}
      />
      
      <Button 
        title={loading ? "Creating Session..." : "Generate Secure QR"} 
        onPress={generateSecureQR}
        disabled={loading}
      />

      {qrValue && sessionInfo && (
        <View style={styles.qrContainer}>
          <Text style={styles.info}>Session ID: {sessionInfo.id}</Text>
          <Text style={styles.info}>Class: {sessionInfo.course}</Text>
          <Text style={styles.info}>Expires: {new Date(sessionInfo.expiresAt).toLocaleString()}</Text>
          
          <QRCode value={qrValue} size={200} />
          
          <Text style={styles.warning}>⚠️ This QR is verified with the server</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 10,
    width: "80%",
    borderRadius: 5,
  },
  qrContainer: { marginTop: 20, alignItems: "center" },
  info: { fontSize: 14, marginBottom: 5 },
  warning: { fontSize: 12, color: "orange", marginTop: 10, textAlign: "center" }
});