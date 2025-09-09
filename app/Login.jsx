import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, Image, TextInput, Pressable, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons'; // Or use react-native-vector-icons/Ionicons if not using Expo

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </Pressable>

      <Text style={styles.title}>Login To Your Account</Text>

      <View style={styles.form}>
        {/* Email Label */}
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Label */}
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Image */}
        <Image
          source={require('../assets/images/Login.png')}
          style={styles.login}
          resizeMode="contain"
        />

        {/* Next Button (styled same as Home) */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          android_ripple={{ color: '#ffffff30' }}
          onPress={() => console.log('Login pressed')}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>

        {/* New User Button */}
        <Pressable onPress={() => navigation.navigate('Name')}>
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
});