import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Welcome Home</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/scanner")}
      >
        <Text style={styles.buttonText}>Open Scanner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f3460",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
