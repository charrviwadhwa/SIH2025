// SpecialIdScreen.jsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { colors } from '../../utils/colors';

const SpecialIdScreen = () => {
const [specialId, setSpecialId] = useState('S-TEST-001'); // default test ID
;

  const handleSave = async () => {
    const email = await AsyncStorage.getItem("userEmail");
    const role = await AsyncStorage.getItem("userRole");

    if(!email || !role || !specialId) return Alert.alert("Error", "All fields are required");

    try {
      const res = await fetch("http://192.168.1.9:5000/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, specialId })
      });

      const data = await res.json();
      if(res.ok){
        Alert.alert("Success", "Special ID saved!");
        router.push(role === "student" ? "/(tabs)/StudentDashboard" : "/(tabs)/TeacherDashboard");
      } else {
        Alert.alert("Error", data.error || "Failed to save");
      }
    } catch(err){
      console.error(err);
      Alert.alert("Error", "Failed to connect to server");
    }
  }

  return (
    <SafeAreaView style={{ flex:1, alignItems:'center', padding:20 }}>
      <Text style={{ fontSize:20, fontWeight:'bold', marginVertical:20 }}>Enter your Special ID</Text>
      <TextInput
        style={{ width:'85%', borderWidth:1, borderRadius:10, padding:12, fontSize:16, marginBottom:20 }}
        placeholder="Special ID"
        value={specialId}
        onChangeText={setSpecialId}
      />
      <Pressable
        style={{ backgroundColor: colors.secondary, padding:14, borderRadius:10, width:'85%', alignItems:'center' }}
        onPress={handleSave}
      >
        <Text style={{ color:'#fff', fontWeight:'bold' }}>Save</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default SpecialIdScreen;
