import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../utils/colors";
import { router } from 'expo-router';
import BottomNav from "../(tabs)/BottomNav"

const QRScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(2);

  // Example upcoming classes
  const classes = [
    { id: "1", name: "IT-E", time: "10:00 AM", borderColor: "#1d85bc" }, // blue
    { id: "2", name: "ECE-2", time: "11:30 AM", borderColor: "#f39c12" }, // orange
    { id: "3", name: "CSE-1", time: "01:00 PM", borderColor: "#27ae60" }, // green
    { id: "4", name: "MECH-3", time: "02:30 PM", borderColor: "#9b59b6" }, // purple
  ];

const handleGenerateQR = (className) => {
  Alert.alert(
    "Generate QR",
    `Do you want to Generate QR for ${className}?`,
    [
      {
        text: "Yes",
        onPress: () => {
          console.log("QR Generated for", className);
          router.push("/(tabs)/generator"); // ✅ navigate on press
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ],
    { cancelable: true }
  );
};

  const renderClass = ({ item }) => (
    <View style={[styles.classCard, { borderLeftColor: item.borderColor }]}>
      <View style={styles.classInfo}>
        <Text style={styles.className}>{item.name}</Text>
        <Text style={styles.classTime}>{item.time}</Text>
      </View>
      <Pressable
        style={styles.qrButton}
        onPress={() => handleGenerateQR(item.name)}
      >
        <Text style={styles.qrButtonText}>Generate QR</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Classes</Text>
        <View style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={28} color={colors.white} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>{notifications}</Text>
          </View>
        </View>
      </View>

      {/* Class List */}
      <FlatList
        data={classes}
        renderItem={renderClass}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* Bottom Navigation Bar */}
      <BottomNav/>
     
    </SafeAreaView>
  );
};

export default QRScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomWidth: 37
  },
  header: {
    height: 100,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", paddingTop: 40, 
    paddingHorizontal: 15,
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
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  classCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 5, // colored border
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.secondary,
  },
  classTime: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
  qrButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  qrButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  tabButton: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    color: colors.primary,
  },
});
