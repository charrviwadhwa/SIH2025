// RegisterScreen.js
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, Image, TextInput, Pressable, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const isFormValid = email && password && confirm && password === confirm;

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
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <Image
            source={require('../assets/images/Email.png')}
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
            onPress={() => navigation.navigate('Degree')}
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
  email:{
    height: 220,
    width: 300,
    marginVertical: 20,
    alignItems: "center"
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
    color: colors.grayDark || '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: 16,
    fontSize: 16,
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
});
