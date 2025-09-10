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
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

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

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  try {
    const response = await fetch("http://192.168.1.9:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Login Failed", data.error || "Something went wrong");
      return;
    }

    // Save email and role locally
    await AsyncStorage.setItem("userEmail", email);
    await AsyncStorage.setItem("userRole", role);

    // Navigate to dashboard based on role
    if (role === "student") {
      router.push("/(tabs)/Student");
    } else {
      router.push("/(tabs)/Dashboard");
    }

  } catch (err) {
    console.error("Login error:", err);
    Alert.alert("Error", "Could not connect to server");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </Pressable>

      <Text style={styles.title}>Login To Your Account</Text>

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

        {/* Email Label */}
        <Text style={styles.inputLabel}>Email Address</Text>
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

        {/* Password Label */}
        <Text style={styles.inputLabel}>Password</Text>
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

        {/* Login Image */}
        <Image
          source={require('../../assets/images/Login.png')}
          style={styles.login}
          resizeMode="contain"
        />

        {/* Next Button */}
      <Pressable
  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
  android_ripple={{ color: '#ffffff30' }}
  onPress={handleLogin}
>
  <Text style={styles.buttonText}>Next</Text>
</Pressable>



        {/* New User Button */}
        <Pressable onPress={() => router.push("/(tabs)/Dashboard")}>
          <Text style={styles.newUserText}>
            New user? <Text style={styles.linkText}>Get started now!</Text>
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  title: {
    marginTop: 55,
    fontSize: 25,
    paddingLeft: 25,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  login: {
    height: 290,
    width: 290,
    marginVertical: 20,
  },
  form: {
    marginTop: 30,
    width: '85%',
    alignItems: 'center',
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 14,
    color: colors.grayDark || '#333',
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
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
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  newUserText: {
    fontSize: 14,
    color: colors.grayDark || '#555',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
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
input: {
  flex: 1,
  paddingVertical: 12,
  fontSize: 16,
  color: "#333",
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
