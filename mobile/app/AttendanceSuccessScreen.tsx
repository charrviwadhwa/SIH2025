import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function BeautifulAttendanceSuccess() {
  const params = useLocalSearchParams();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const successIconScale = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  const attendanceData = params.attendanceData ? 
    JSON.parse(params.attendanceData as string) : null;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      // Success icon bounce
      Animated.timing(successIconScale, {
        toValue: 1.2,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(successIconScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Main content fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Sparkle animation
    const sparkle = () => {
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => sparkle());
    };
    sparkle();
  }, []);

  if (!attendanceData) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={styles.centerContent}>
          <BlurView intensity={20} tint="dark" style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
            <Text style={styles.errorTitle}>No Data Found</Text>
            <Text style={styles.errorText}>Attendance information is missing</Text>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => router.back()}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                <Ionicons name="arrow-back-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Go Back</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
      </LinearGradient>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
  };

  const { date, time } = formatDateTime(attendanceData.markedAt);

  const handleGoHome = () => {
    router.push("/(tabs)");
  };

  const handleScanAgain = () => {
    router.back();
  };

 

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Background sparkles */}
      <Animated.View 
        style={[
          styles.sparkles,
          {
            opacity: sparkleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1]
            })
          }
        ]}
      >
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.sparkle, { 
            left: `${15 + i * 15}%`, 
            top: `${20 + (i % 2) * 30}%` 
          }]}>
            ✨
          </View>
        ))}
      </Animated.View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <Animated.View 
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: successIconScale }]
            }
          ]}
        >
          <LinearGradient
            colors={['#00d4aa', '#00b894']}
            style={styles.successIconGradient}
          >
            <Ionicons name="checkmark" size={60} color="white" />
          </LinearGradient>
          
          {/* Pulse ring */}
          <Animated.View 
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: sparkleAnim }],
                opacity: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 0]
                })
              }
            ]}
          />
        </Animated.View>

        {/* Success Message */}
        <Animated.View 
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.successTitle}>🎉 Attendance Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            You've been successfully marked present
          </Text>
        </Animated.View>

        {/* Attendance Details Card */}
        <Animated.View 
          style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <BlurView intensity={30} tint="dark" style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>Attendance Details</Text>
            </View>
            
            {/* Course Info */}
            <View style={styles.detailSection}>
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="time-outline" size={20} color="#ffd93d" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Time Marked</Text>
                  <Text style={styles.detailValue}>{time}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person-outline" size={20} color="#764ba2" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Student ID</Text>
                  <Text style={styles.detailValue}>#{attendanceData.studentId}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#ff6b6b" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{attendanceData.studentEmail}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="key-outline" size={20} color="#00cec9" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Session ID</Text>
                  <Text style={styles.detailValue}>#{attendanceData.sessionId}</Text>
                </View>
              </View>
            </View>

            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <LinearGradient
                colors={['#00d4aa', '#00b894']}
                style={styles.statusGradient}
              >
                <Ionicons name="shield-checkmark-outline" size={16} color="white" />
                <Text style={styles.statusText}>Verified & Recorded</Text>
              </LinearGradient>
            </View>
          </BlurView>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleGoHome}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.buttonGradient}
            >
              <Ionicons name="home-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Back to Home</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
         

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handleScanAgain}
            >
              <BlurView intensity={20} tint="dark" style={styles.secondaryButtonBlur}>
                <Ionicons name="qr-code-outline" size={18} color="#667eea" />
                <Text style={styles.secondaryButtonText}>Scan Again</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Info Footer */}
        <Animated.View 
          style={[
            styles.infoFooter,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7]
              })
            }
          ]}
        >
          <BlurView intensity={15} tint="dark" style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#8892b0" />
            <Text style={styles.infoText}>
              Your attendance has been securely recorded and saved
            </Text>
          </BlurView>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  errorTitle: {
    fontSize: 20,
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 25,
  },
  sparkles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  successIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#00d4aa',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#00d4aa',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardContainer: {
    marginBottom: 30,
  },
  detailsCard: {
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8892b0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  infoFooter: {
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#8892b0',
    textAlign: 'center',
    flex: 1,
  },
});