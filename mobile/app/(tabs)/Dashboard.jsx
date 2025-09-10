import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Pressable,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { router } from 'expo-router';

const Dashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("QR");
  const [notifications, setNotifications] = useState(3); // Example: 3 notifications

  const tabs = [
    { name: "Profile", icon: "person-circle-outline", route: "Profile" },
    { name: "QR", icon: "qr-code-outline", route: "QRScreen" },
    { name: "Timetable", icon: "calendar-outline", route: "Timetable" },
    { name: "Settings", icon: "settings-outline", route: "Settings" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Image source={require("../../assets/images/QRIOUS.png")} style={styles.logo} resizeMode="contain" />
        <View style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={28} color={colors.white} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>{notifications}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Attendance App</Text>
        <Text style={styles.subtitle}>{activeTab} Page</Text>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            style={styles.tabButton}
            onPress={() => {
              setActiveTab(tab.name);
              router.push(tab.route);
            }}
          >
            <Ionicons
              name={tab.icon}
              size={28}
              color={activeTab === tab.name ? colors.primary : colors.gray}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.name ? colors.primary : colors.gray },
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomWidth: 37
  },
  logo: {
    height: 150,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.secondary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.primary,
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
  },
});
