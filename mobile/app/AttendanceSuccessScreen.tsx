import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

export default function AttendanceSuccess() {
  const params = useLocalSearchParams();
  
  // Parse the attendance data from params
  const attendanceData = params.attendanceData ? 
    JSON.parse(params.attendanceData as string) : null;

  if (!attendanceData) {
    return (
      <View style={styles.container}>
        <Text>No attendance data found</Text>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
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
    router.push("/(tabs)"); // Adjust to your home route
  };

  const handleScanAgain = () => {
    router.back();
  };

  const handleViewHistory = () => {
    router.push('/attendance-history'); // Create this route if needed
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
      </View>

      {/* Success Message */}
      <Text style={styles.successTitle}>Attendance Marked Successfully!</Text>
      <Text style={styles.successSubtitle}>You're all set for today's class</Text>

      {/* Attendance Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Attendance Details</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="book-outline" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Course</Text>
            <Text style={styles.detailValue}>{attendanceData.course}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Time Marked</Text>
            <Text style={styles.detailValue}>{time}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Student ID</Text>
            <Text style={styles.detailValue}>{attendanceData.studentId}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{attendanceData.studentEmail}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="key-outline" size={20} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Session ID</Text>
            <Text style={styles.detailValue}>#{attendanceData.sessionId}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleGoHome}
        >
          <Ionicons name="home-outline" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleViewHistory}
        >
          <Ionicons name="list-outline" size={20} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleScanAgain}
        >
          <Ionicons name="camera-outline" size={20} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Scan Another QR</Text>
        </TouchableOpacity>
      </View>

      {/* Info Message */}
      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={16} color="#888" />
        <Text style={styles.infoText}>
          Your attendance has been recorded and saved securely
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailContent: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});