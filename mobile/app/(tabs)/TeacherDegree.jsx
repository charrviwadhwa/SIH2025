import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const TeacherCollege = () => {
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      setEmail(storedEmail || "");
    };
    loadEmail();
  }, []);

  const handleNext = async () => {
    if (!college.trim()) {
      Alert.alert("⚠️ Error", "Please enter your college");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.9:5000/auth/teacher/college", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, college }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("❌ Error", data.error || "Failed to save college");
        setLoading(false);
        return;
      }

      Alert.alert("✅ Success", "College saved successfully");
      router.push("/(tabs)/Dashboard");
    } catch (err) {
      console.error("College save error:", err);
      Alert.alert("❌ Error", "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter Your College</Text>

      <Text style={styles.label}>College Name</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="school-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter college name"
          placeholderTextColor="#aaa"
          value={college}
          onChangeText={setCollege}
        />
      </View>

              <Image
                source={require('../../assets/images/college.png')}
                style={styles.login}
                resizeMode="contain"
              />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          !college.trim() && { opacity: 0.5 },
        ]}
        onPress={handleNext}
        disabled={!college.trim() || loading}
        android_ripple={{ color: "#ffffff30" }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

export default TeacherCollege;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
    login: {
    height: 290,
    width: 290,
    marginVertical: 20,
  },
});
