// app/Settings/LogoutScreen.jsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { colors } from "../../utils/colors";
import { router } from "expo-router";

const LogoutScreen = () => {
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Clear any stored user session if using AsyncStorage
            // Example: AsyncStorage.removeItem('userToken');
            router.replace("/Login"); // redirect to login page
          },
        },
      ],
      { cancelable: true }
    );
  };

  return ( 
    <View></View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: colors.primary,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
