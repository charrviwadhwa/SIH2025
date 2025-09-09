// Name.jsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';

const NameScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isFormValid = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
      </View>

      <Text style={styles.title}>Name please!</Text>
      <Text style={styles.subtitle}>Let's network and grow!</Text>

      {/* Input field */}
      <TextInput
        style={[
          styles.input,
          isFocused && { borderColor: colors.primary, shadowColor: colors.primary, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
        ]}
        placeholder="Your Name"
        placeholderTextColor="#787c92ff"
        value={name}
        onChangeText={setName}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={colors.primary} // removes orange highlight
      />

      <Image
        source={require('../assets/images/Name.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.sharedButton,
            pressed && styles.sharedButtonPressed,
            !isFormValid && { opacity: 0.5 },
          ]}
          android_ripple={{ color: '#ffffff30' }}
          onPress={() => navigation.navigate('Email')}
          disabled={!isFormValid}
        >
          <Text style={styles.sharedButtonText}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default NameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 50,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    width: '85%',
    padding: 12,
    backgroundColor: '#e1e5fcff',
    borderRadius: 10,
    borderColor: '#4b4f63ff',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '85%',
    alignItems: 'center',
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
