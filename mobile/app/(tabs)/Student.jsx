import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import Navbar from "../(tabs)/Studentnavbar"; // 👈 Import Navbar

const Dashboard = () => {
  const [notifications, setNotifications] = useState(3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/QRIOUS.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={28} color={colors.white} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>{notifications}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Student 👩‍🎓</Text>
      </View>

      {/* Navbar */}
      <Navbar initialTab="Scanner" /> 
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  logo: { height: 150, width: 150, marginVertical: 20 },
  header: {
    height: 100,
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
  notificationWrapper: { position: "relative" },
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
  badgeText: { color: colors.white, fontSize: 10, fontWeight: "700" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", color: colors.secondary },
});
