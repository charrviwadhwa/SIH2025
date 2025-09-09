import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>👩‍🏫 Teacher Dashboard</Text>
        <Text style={styles.subtitle}>Manage your classes and attendance</Text>
      </View>

      {/* Buttons */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(tabs)/generator")}
        >
          <Ionicons name="qr-code-outline" size={40} color="white" />
          <Text style={styles.cardText}>Generate QR</Text>
        </TouchableOpacity>

        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8892b0",
  },
  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  card: {
    width: "47%",
    height: 140,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
