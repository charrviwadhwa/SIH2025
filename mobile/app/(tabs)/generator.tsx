import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Platform,
  Image
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {colors} from "../../utils/colors"

const { width, height } = Dimensions.get('window');

export default function BeautifulSecureGeneratorScreen() {
  const [classId, setClassId] = useState("");
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Add this to the beginning of your generateSecureQR function
const generateSecureQR = async () => {
  if (!classId.trim()) {
    Alert.alert("⚠️ Missing Information", "Please enter a Class ID to continue");
    return;
  }

  setLoading(true);
  
  // Start loading animation
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start();

  try {
    // ✅ DETAILED DEBUGGING
    console.log("=== QR GENERATION DEBUG ===");
    
    // Check ALL AsyncStorage keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log("All AsyncStorage keys:", allKeys);
    
    const stored = await AsyncStorage.getItem("user");
    const userEmail = await AsyncStorage.getItem("userEmail");
    const userRole = await AsyncStorage.getItem("userRole");
    
    console.log("Raw 'user' data:", stored);
    console.log("User email:", userEmail);
    console.log("User role:", userRole);
    
    const user = stored ? JSON.parse(stored) : null;
    
    console.log("Parsed user object:", user);
    console.log("User ID type:", typeof user?.id, "Value:", user?.id);
    console.log("User name:", user?.name);
    console.log("User email from object:", user?.email);
    
    // Check if user is null or missing ID
    if (!user) {
      console.error("❌ NO USER DATA FOUND IN STORAGE");
      Alert.alert("❌ Authentication Error", "No user data found! Please log in again.");
      return;
    }
    
    if (!user.id) {
      console.error("❌ USER ID IS MISSING");
      Alert.alert("❌ Authentication Error", "User ID is missing! Please log in again.");
      return;
    }
    
    console.log("✅ About to send teacherId:", user.id);
    console.log("===========================");

    const response = await fetch("http://192.168.1.9:5000/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        course: classId.trim(),
        teacherId: user.id,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.error || "Failed to create session on server");
    }

    const sessionData = await response.json();
    console.log("Session created successfully:", sessionData);

    const qrData = {
      sessionId: sessionData.session.id,
      qrCode: sessionData.session.qrCode,
      classId: sessionData.session.course,
      teacherId: sessionData.session.facultyId,
      date: sessionData.session.createdAt,
      expiresAt: sessionData.session.expiresAt,
      hash: generateSimpleHash(sessionData.session.id, sessionData.session.qrCode, user.id)
    };

    setQrValue(JSON.stringify(qrData));
    setSessionInfo(sessionData.session);

    // Success animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Alert.alert("✨ Success!", "Secure QR Code generated successfully!");

  } catch (error) {
    console.error("Secure QR generation error:", error);
    Alert.alert("❌ Generation Failed", "Unable to generate QR code. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const clearQR = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setQrValue(null);
      setSessionInfo(null);
      setClassId("");
      slideAnim.setValue(50);
      scaleAnim.setValue(0.9);
    });
    
    Alert.alert("🗑️ Cleared", "QR code session cleared successfully");
  };

  const generateSimpleHash = (sessionId: number, qrCode: string, teacherId: number) => {
    const data = `${sessionId}-${qrCode}-${teacherId}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  
return (

  <View style={styles.container}>
 

    {/* Header Bar */}
   {/* Header Bar */}
<View style={styles.header}>
  <View style={styles.leftHeader}>
    <TouchableOpacity onPress={() => router.push("/(tabs)/QR")}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <Image
      source={require("../../assets/images/QRIOUS.png")}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
</View>


    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/* Input Card */}
      <View style={styles.card}>
        <Text style={styles.inputLabel}>Class Identifier</Text>
        <TextInput
          placeholder="Enter Class ID..."
          placeholderTextColor="#777"
          style={styles.input}
          value={classId}
          onChangeText={setClassId}
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.generateBtn, loading && styles.disabledBtn]}
          onPress={generateSecureQR}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Creating Session..." : "Generate QR"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* QR Card */}
      {qrValue && sessionInfo && (
        <Animated.View 
          style={[
            styles.card,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionTitle}>Active Session</Text>
            <TouchableOpacity onPress={clearQR}>
              <Ionicons name="close-circle" size={22} color="#e74c3c" />
            </TouchableOpacity>
          </View>

          <View style={styles.sessionInfo}>
            <Text style={styles.infoText}>Class: {sessionInfo.course}</Text>
            <Text style={styles.infoText}>
              Expires: {new Date(sessionInfo.expiresAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
            </Text>
          </View>

          <View style={styles.qrBox}>
            <QRCode 
              value={qrValue}
              size={200}
              backgroundColor="white"
              color="#002147"
            />
          </View>
          <Text style={styles.securityNote}>🛡️ Secure • Verified • Time-limited</Text>
        </Animated.View>
      )}
    </ScrollView>
  </View>
);

  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  header: {
    height: 120,
    backgroundColor: colors.secondary, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",  
    paddingHorizontal: 15,
    paddingTop: 40,        
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    
  },

  scrollContainer: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  inputLabel: { fontSize: 16, fontWeight: "600", color: "#002147", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },

  generateBtn: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#87cefa" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  sessionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sessionTitle: { fontSize: 16, fontWeight: "bold", color: "#002147" },
  sessionInfo: { marginVertical: 10 },
  infoText: { fontSize: 14, color: "#444", marginBottom: 4 },

  qrBox: { alignItems: "center", marginVertical: 14 },
  securityNote: { textAlign: "center", fontSize: 12, color: "#666" },
    notificationWrapper: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  leftHeader: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10, // space between arrow and logo (works RN 0.71+)
},
logo: {
  height: 150,  // smaller to fit header
  width: 150,
  marginLeft: 8,
},


});
