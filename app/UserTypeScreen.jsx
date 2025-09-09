// UserTypeScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, Pressable, StyleSheet, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';

const UserTypeScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);

  const types = ['Student', 'College / University', 'Organization'];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>
      {types.map(type => (
        <Pressable
          key={type}
          style={[
            styles.typeButton,
            selectedType === type && styles.typeButtonSelected,
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text
            style={[
              styles.typeText,
              selectedType === type && styles.typeTextSelected,
            ]}
          >
            {type}
          </Text>
        </Pressable>
      ))}
      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          pressed && styles.nextButtonPressed,
          !selectedType && { backgroundColor: '#ccc' },
        ]}
        disabled={!selectedType}
        onPress={() => navigation.navigate(
          selectedType === 'Student' ? 'NameScreen' : 'RegisterScreen'
        )}
      >
        <Text style={styles.nextText}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default UserTypeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: colors.white },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  typeButton: {
    width: '80%', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.gray,
    marginBottom: 15, alignItems: 'center',
  },
  typeButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { fontSize: 18, color: colors.grayDark || '#333' },
  typeTextSelected: { color: '#fff', fontWeight: 'bold' },
  nextButton: {
    marginTop: 40, width: '80%', paddingVertical: 14, borderRadius: 10, backgroundColor: colors.secondary,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  nextButtonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  nextText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
