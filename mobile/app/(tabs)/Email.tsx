// RegisterScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  Pressable,
  View,
  Platform,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';

import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirm, showsetConfirm] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  const isFormValid = email && password && confirm && password === confirm;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: selectedIndex,
      useNativeDriver: false,
      friction: 7,
      tension: 60,
    }).start();
  }, [selectedIndex]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });


const handleRegister = async () => {
  try {
    // Get name from AsyncStorage (saved from Name page)
    const name = await AsyncStorage.getItem("userName");
    if (!name) return Alert.alert("Error", "Please enter your name first");

    // Send registration request
    const response = await fetch("http://192.168.1.9:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Error", data.error || "Something went wrong");
      return;
    }

    // Save email + role locally
    await AsyncStorage.setItem("userEmail", email);
    await AsyncStorage.setItem("userRole", role);

    // Redirect based on role
    if (role === "student") {
      router.push("/(tabs)/Degree"); // student path
    } else if (role === "teacher") {
      router.push("/(tabs)/TeacherDegree"); // teacher path
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Failed to connect to server");
  }
};



  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
      </View>

      <Text style={styles.title}>Create Your Account</Text>

      <View style={styles.form}>
        {/* TOGGLE STUDENT / TEACHER */}
        <View style={styles.toggleContainer}>
          <Animated.View
            style={[styles.toggleHighlight, { transform: [{ translateX }] }]}
          />
          {['Student', 'Teacher'].map((option, index) => (
            <Pressable
              key={option}
              style={styles.option}
              onPress={() => {
                setSelectedIndex(index);
                setRole(option.toLowerCase());
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  index === selectedIndex && styles.activeText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
          </View>

        <Text style={styles.label}>Password</Text>
         <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
              style={styles.eyeIcon}
            />
          </Pressable>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showconfirm}
            value={confirm}
            onChangeText={setConfirm}
          />
          <Pressable onPress={() => showsetConfirm(!showconfirm)}>
            <Ionicons
              name={showconfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
              style={styles.eyeIcon}
            />
          </Pressable>
        </View>

        <Image
          source={require('../../assets/images/Email.png')}
          style={styles.email}
          resizeMode="contain"
        />

        {/* NEXT BUTTON */}
        <View style={styles.buttonContainer}>
          <Pressable
  style={({ pressed }) => [
    styles.sharedButton,
    pressed && styles.sharedButtonPressed,
    !isFormValid && { opacity: 0.5 },
  ]}
  android_ripple={{ color: '#ffffff30' }}
  onPress={handleRegister}  // <-- call your function here
  disabled={!isFormValid}
>
  <Text style={styles.sharedButtonText}>Next</Text>
</Pressable>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    height: 220,
    width: 300,
    marginVertical: 20,
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  progressActive: {
    width: 40,
    height: 5,
    backgroundColor: colors.primary,
    marginRight: 8,
    borderRadius: 3,
  },
  progressInactive: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    borderRadius: 3,
  },
  form: {
    width: '85%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color:'#333',
  },
input: {
  flex: 1,
  paddingVertical: 12,
  fontSize: 16,
  color: "#333",
},
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  sharedButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sharedButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  sharedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: "#ddd",
  paddingHorizontal: 10,
  marginBottom: 20,

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
},
inputIcon: {
  marginRight: 8,
},
eyeIcon: {
  marginLeft: 8,
},



  // Toggle styles
  toggleContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  toggleHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  option: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  activeText: {
    color: colors.white,
    fontWeight: '700',
  },
});


