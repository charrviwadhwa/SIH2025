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
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
      const stored = await AsyncStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      if (!user) {
        Alert.alert("❌ Authentication Error", "No teacher logged in! Please log in first.");
        return;
      }

      const response = await fetch("http://192.168.1.9:5000/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          course: classId.trim(),
          facultyId: user.id,
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create session on server");
      }

      const sessionData = await response.json();

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
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Animated Background Gradient */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Background Elements */}
      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
    
            <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push("/teacher_home")}
      >
        <BlurView intensity={20} tint="dark" style={styles.backButtonBlur}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </BlurView>
      </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>🎯 Class QR Generator</Text>
          <Text style={styles.subtitle}>Generate secure attendance codes</Text>
        </View>

        {/* Input Section */}
        <BlurView intensity={20} tint="dark" style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Class Identifier</Text>
          <TextInput
            placeholder="Enter your class ID..."
            placeholderTextColor="#8892b0"
            style={styles.input}
            value={classId}
            onChangeText={setClassId}
            editable={!loading}
            autoCapitalize="characters"
          />
          
          <TouchableOpacity 
            style={[styles.generateButton, loading && styles.loadingButton]}
            onPress={generateSecureQR}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={loading ? ['#4a5568', '#2d3748'] : ['#667eea', '#764ba2']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {loading ? "🔄 Creating Session..." : "✨ Generate Secure QR"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>

        {/* QR Code Display Section */}
        {qrValue && sessionInfo && (
          <Animated.View 
            style={[
              styles.qrSection,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            <BlurView intensity={30} tint="dark" style={styles.qrContainer}>
              {/* Session Info */}
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>🔐 Active Session</Text>
                <TouchableOpacity onPress={clearQR} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sessionInfoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Session ID:</Text>
                  <Text style={styles.infoValue}>#{sessionInfo.id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Class:</Text>
                  <Text style={styles.infoValue}>{sessionInfo.course}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Expires:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(sessionInfo.expiresAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>

              {/* QR Code */}
              <View style={styles.qrCodeContainer}>
                <View style={styles.qrBackground}>
                  <QRCode 
                    value={qrValue} 
                    size={220}
                    backgroundColor="white"
                    color="#1a1a2e"
                    logoSize={30}
                    logoBackgroundColor="white"
                  />
                </View>
              </View>

              {/* Security Badge */}
              <View style={styles.securityBadge}>
                <Text style={styles.securityText}>🛡️ Server Verified</Text>
                <Text style={styles.securitySubtext}>Secure • Encrypted • Time-limited</Text>
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Instructions */}
        {!qrValue && (
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>How it works:</Text>
            <Text style={styles.instructionText}>
              • Enter your class identifier{'\n'}
              • Generate a secure, time-limited QR code{'\n'}
              • Students scan to mark attendance{'\n'}
              • Sessions expire automatically after 2 hours
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  shape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  shape1: {
    width: 200,
    height: 200,
    backgroundColor: '#667eea',
    top: 100,
    left: -50,
  },
  shape2: {
    width: 150,
    height: 150,
    backgroundColor: '#764ba2',
    top: 300,
    right: -30,
  },
  shape3: {
    width: 100,
    height: 100,
    backgroundColor: '#f093fb',
    bottom: 200,
    left: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  backButtonBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginRight: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 12,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingButton: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrSection: {
    marginBottom: 30,
  },
  qrContainer: {
    borderRadius: 20,
    padding: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionInfoContainer: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8892b0',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  qrBackground: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  securityBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  securityText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  securitySubtext: {
    color: '#8892b0',
    fontSize: 12,
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 22,
    textAlign: 'center',
  },
});