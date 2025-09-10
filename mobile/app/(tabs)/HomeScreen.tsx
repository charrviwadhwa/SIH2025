// HomeScreen.js
import React from 'react';
import { StyleSheet, SafeAreaView, Image, Text, Pressable, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import { router } from 'expo-router';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/images/QRIOUS.png")} style={styles.logo} resizeMode="contain" />
      <Image source={require("../../assets/images/Home.png")} style={styles.home} resizeMode="contain" />
      <Text style={styles.title}>Hello, ready to mark attendance?</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          android_ripple={{ color: '#ffffff30' }}
          onPress={() => router.push("/(tabs)/Name")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          android_ripple={{ color: '#ffffff30' }}
          onPress={() => router.push("/(tabs)/Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logo: {
    height: 250,
    width: 350,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  home: {
    marginVertical: -80,
    height: 350,
    width: 350,
  },
  title: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 30,
    width: "80%",
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    width: "100%",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
