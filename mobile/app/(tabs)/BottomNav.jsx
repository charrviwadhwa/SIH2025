// components/BottomNav.jsx
import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { colors } from "../../utils/colors"; // adjust path if needed

const BottomNav = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Profile", icon: "person-circle-outline", route: "/Profile" },
    { name: "QR", icon: "qr-code-outline", route: "/QR" },
    { name: "Timetable", icon: "calendar-outline", route: "/Timetable" },
    { name: "Settings", icon: "settings-outline", route: "/Settings" },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.route;

        return (
          <Pressable
            key={index}
            style={styles.tabButton}
            onPress={() => router.push(tab.route)}
          >
            <Ionicons
              name={tab.icon}
              size={isActive ? 32 : 28}
              color={isActive ? colors.secondary : colors.primary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? colors.secondary : colors.primary,
                  fontWeight: isActive ? "700" : "400" }
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
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
