import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>📍 Welcome to Qrious</Text>
      <Button
        title="📷 Scan Attendance QR"
        onPress={() => navigation.navigate("Attendance")}
      />
    </View>
  );
}
