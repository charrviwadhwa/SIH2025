import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../utils/colors'; // reuse your colors

export default function BeautifulAttendanceSuccess() {
  const params = useLocalSearchParams();
  const attendanceData = params.attendanceData
    ? JSON.parse(params.attendanceData as string)
    : null;

  if (!attendanceData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={60} color="red" />
          <Text style={styles.errorTitle}>No Data Found</Text>
          <Text style={styles.errorText}>Attendance information is missing</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
  };

  const { date, time } = formatDateTime(attendanceData.markedAt);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Success Icon & Message */}
        <View style={styles.header}>
          <Ionicons name="checkmark-circle-outline" size={80} color={colors.secondary} />
          <Text style={styles.successTitle}>Attendance Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            You've been successfully marked present
          </Text>
        </View>

        {/* Attendance Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time Marked:</Text>
            <Text style={styles.detailValue}>{time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student ID:</Text>
            <Text style={styles.detailValue}>#{attendanceData.studentId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{attendanceData.studentEmail}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Session ID:</Text>
            <Text style={styles.detailValue}>#{attendanceData.sessionId}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(tabs)/myAttendance")}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContainer: { padding: 20, 
    paddingTop:80
  },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: 'red', marginTop: 10 },
  errorText: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 10 },
  button: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: { color: 'white', fontWeight: '600', textAlign: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  successTitle: { fontSize: 24, fontWeight: '700', marginTop: 10, color: colors.secondary },
  successSubtitle: { fontSize: 16, color: '#666', marginTop: 5, textAlign: 'center' },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: colors.secondary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#333' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    borderRadius: 12,
    marginRight: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 10,
  },
  secondaryButtonText: { color: colors.secondary, fontWeight: '600', textAlign: 'center' },
});
