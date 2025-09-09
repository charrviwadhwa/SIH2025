import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Vibration,
} from "react-native";
import { Camera } from "expo-camera";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function BeautifulScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Pulse animation for scan area
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();

      // Scanning line animation
      const scanAnimation = () => {
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => scanAnimation());
      };
      scanAnimation();
    }
  }, [hasPermission]);

  if (hasPermission === null) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={styles.centerContent}>
          <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <View style={styles.loadingIcon}>
              <Ionicons name="camera-outline" size={60} color="#667eea" />
            </View>
            <Text style={styles.loadingText}>Requesting camera permission...</Text>
            <Text style={styles.loadingSubtext}>We need access to scan QR codes</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  if (hasPermission === false) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={styles.centerContent}>
          <BlurView intensity={20} tint="dark" style={styles.errorContainer}>
            <Ionicons name="camera-outline" size={80} color="#ff6b6b" />
            <Text style={styles.errorTitle}>Camera Access Denied</Text>
            <Text style={styles.errorText}>
              We need camera permission to scan QR codes for attendance
            </Text>
            
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === "granted");
              }}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Grant Permission</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
      </LinearGradient>
    );
  }

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (scanned || processing) return;

    // Vibrate on successful scan
    Vibration.vibrate(100);
    
    setScanned(true);
    setProcessing(true);
    
    const data = scanningResult.data;
    console.log("Scanned QR data:", data);

    try {
      let qrData;
      try {
        qrData = JSON.parse(data);
        console.log("Parsed QR data:", qrData);
      } catch (parseError) {
        console.error("QR parsing error:", parseError);
        Alert.alert(
          "❌ Invalid QR Code", 
          "The QR code format is not valid",
          [{ text: "Try Again", onPress: resetScanner }]
        );
        return;
      }

      if (!qrData.sessionId || !qrData.qrCode) {
        console.error("Missing fields in QR:", qrData);
        Alert.alert(
          "❌ Invalid QR Code", 
          `Missing required fields. Found: ${Object.keys(qrData).join(', ')}`,
          [{ text: "Try Again", onPress: resetScanner }]
        );
        return;
      }

      const stored = await AsyncStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      
      if (!user || !user.id) {
        Alert.alert(
          "❌ Authentication Error", 
          "No user logged in or user ID missing",
          [{ text: "OK", onPress: resetScanner }]
        );
        return;
      }

      // Check expiry (30 seconds)
      if (qrData.expiresAt) {
        const expiryTime = new Date(qrData.expiresAt);
        const currentTime = new Date();
        if (currentTime > expiryTime) {
          Alert.alert(
            "⏰ Session Expired", 
            "This QR code has expired. Please ask your teacher to generate a new one.",
            [{ text: "OK", onPress: resetScanner }]
          );
          return;
        }
      }

      console.log("Sending attendance request...");
      
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

      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
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
          [{ text: "Try Again", onPress: resetScanner }]
        );
      }

    } catch (networkError) {
      console.error("Network error:", networkError);
      Alert.alert(
        "❌ Network Error", 
        "Could not connect to server. Please check your internet connection.",
        [{ text: "Try Again", onPress: resetScanner }]
      );
    }
  };

  const resetScanner = () => {
    setProcessing(false);
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      {/* Dark overlay */}
      <View style={styles.overlay} />
      
      {/* Header */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push("/home")}
      >
        <BlurView intensity={20} tint="dark" style={styles.backButtonBlur}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </BlurView>
      </TouchableOpacity>

        
        <BlurView intensity={20} tint="dark" style={styles.headerContent}>
          <Text style={styles.headerTitle}>📱 Scan QR Code</Text>
          <Text style={styles.headerSubtitle}>Mark Your Attendance</Text>
        </BlurView>
      </Animated.View>

      {/* Scan Area */}
      <Animated.View 
        style={[
          styles.scanContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <View style={styles.scanArea}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Animated scan line */}
          <Animated.View 
            style={[
              styles.scanLine,
              {
                transform: [{
                  translateY: scanLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200]
                  })
                }]
              }
            ]} 
          />
        </View>
      </Animated.View>

      {/* Instruction Text */}
      <Animated.View style={[styles.instructionContainer, { opacity: fadeAnim }]}>
        <BlurView intensity={30} tint="dark" style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            {processing ? "🔄 Processing..." : "📱 Point your camera at the QR code"}
          </Text>
          <Text style={styles.instructionSubtext}>
            {processing ? "Marking your attendance..." : "Make sure the QR code is clearly visible"}
          </Text>
        </BlurView>
      </Animated.View>

      {/* Bottom Actions */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        {scanned && !processing && (
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={resetScanner}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.buttonGradient}
            >
              <Ionicons name="refresh-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Scan Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        {/* Warning about expiry */}
        <BlurView intensity={20} tint="dark" style={styles.warningBox}>
          <Ionicons name="time-outline" size={16} color="#ffd93d" />
          <Text style={styles.warningText}>QR codes expire in 30 seconds</Text>
        </BlurView>
      </Animated.View>

      {/* Processing Overlay */}
      {processing && (
        <Animated.View style={[styles.processingOverlay, { opacity: fadeAnim }]}>
          <BlurView intensity={50} tint="dark" style={styles.processingContainer}>
            <View style={styles.processingContent}>
              <Animated.View
                style={[
                  styles.processingIcon,
                  {
                    transform: [{
                      rotate: pulseAnim.interpolate({
                        inputRange: [1, 1.05],
                        outputRange: ['0deg', '360deg']
                      })
                    }]
                  }
                ]}
              >
                <Ionicons name="sync-outline" size={40} color="#667eea" />
              </Animated.View>
              <Text style={styles.processingText}>Processing QR Code</Text>
              <Text style={styles.processingSubtext}>Please wait...</Text>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  errorTitle: {
    fontSize: 22,
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    position: 'absolute',
    top: StatusBar.currentHeight || 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: {
    marginRight: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 2,
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff88',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
  },
  instructionBox: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionSubtext: {
    color: '#8892b0',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 15,
  },
  scanAgainButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.3)',
    gap: 8,
  },
  warningText: {
    color: '#ffd93d',
    fontSize: 12,
    fontWeight: '500',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  processingContainer: {
    width: width * 0.8,
    paddingVertical: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  processingContent: {
    alignItems: 'center',
  },
  processingIcon: {
    marginBottom: 20,
  },
  processingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#8892b0',
  },
});