// DegreeBranchCollegeScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DegreeBranchCollegeScreen = () => {
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [college, setCollege] = useState('');

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedRole = await AsyncStorage.getItem("userRole");
      setEmail(storedEmail || "");
      setRole(storedRole || "");
    };
    loadUser();
  }, []);

  const handleNext = async () => {
    if (!degree || !branch || !college) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (role !== "student") {
      return Alert.alert("⚠️ Error", "This step is only for students.");
    }

    try {
      const response = await fetch("http://192.168.1.9:5000/auth/degree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, degree, branch, college }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("❌ Error", data.error || "Failed to save details");
        return;
      }

      Alert.alert("✅ Success", "Details saved successfully");
      router.push("/(tabs)/myAttendance"); // student dashboard
    } catch (err) {
      console.error("Degree save error:", err);
      Alert.alert("❌ Error", "Could not connect to server");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
      </View>

      <Text style={styles.title}>Tell us more</Text>

      {/* Degree */}
      <View style={styles.field}>
        <Text style={styles.label}>Degree</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="school-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your degree"
            value={degree}
            onChangeText={setDegree}
          />
        </View>
      </View>

      {/* Branch */}
      <View style={styles.field}>
        <Text style={styles.label}>Branch / Major</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="construct-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your branch"
            value={branch}
            onChangeText={setBranch}
          />
        </View>
      </View>

      {/* College */}
      <View style={styles.field}>
        <Text style={styles.label}>College / University</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="business-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your college"
            value={college}
            onChangeText={setCollege}
          />
        </View>
      </View>

      <Image
        source={require('../../assets/images/Degree.png')}
        style={styles.degree}
        resizeMode="contain"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          (!(degree && branch && college)) && { opacity: 0.5 },
        ]}
        onPress={handleNext}
        disabled={!(degree && branch && college)}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default DegreeBranchCollegeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingTop: 50, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  progressBar: { flexDirection: 'row', marginBottom: 30 },
  progressActive: { width: 40, height: 5, backgroundColor: colors.primary, marginRight: 8, borderRadius: 3 },
  field: { width: '85%', marginBottom: 20 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: '600', color: '#333' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#F2F2F2' },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 10, fontSize: 16, color: '#000' },
  degree: { height: 290, width: 290, marginVertical: -20 },
  button: {
    marginTop: 20, backgroundColor: colors.secondary, padding: 14, borderRadius: 8, width: '85%', alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 }
    }),
  },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
