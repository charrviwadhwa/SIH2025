// components/Navbar.jsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { colors } from "../../utils/colors";

const { width } = Dimensions.get("window");

const Navbar = () => {
  const pathname = usePathname(); // current route

  const tabs = [
    { name: "Profile", icon: "person-circle-outline", route: "/studprofile" },
    { name: "Scanner", icon: "scan-outline", route: "/scanner" },
    { name: "Attendance", icon: "checkmark-done-outline", route: "/myAttendance" },
    { name: "Settings", icon: "settings-outline", route: "/Settings copy" },
  ];

  // Animated value for the underline
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.route === pathname);
    if (activeIndex >= 0) {
      Animated.spring(indicatorAnim, {
        toValue: activeIndex * (width / tabs.length),
        useNativeDriver: false,
        stiffness: 200,
        damping: 20,
      }).start();
    }
  }, [pathname]);

  const tabWidth = width / tabs.length;

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
              size={28}
              color={isActive ? colors.primary : colors.gray}
            />
            <Text style={[styles.tabLabel, { color: isActive ? colors.primary : colors.gray }]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}

      {/* Animated underline */}
      <Animated.View
        style={[
          styles.indicator,
          { width: tabWidth, transform: [{ translateX: indicatorAnim }] },
        ]}
      />
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 6,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 5 },
    }),
    position: "relative",
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  indicator: {
    height: 3,
    backgroundColor: colors.primary,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});
