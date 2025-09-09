// DegreeBranchCollegeScreen.js
import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, Pressable, Image, StyleSheet, Platform, Dimensions,
} from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';

const DegreeBranchCollegeScreen = () => {
  const navigation = useNavigation();
  const [degree, setDegree] = useState(null);
  const [branch, setBranch] = useState(null);
  const [college, setCollege] = useState(null);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);

  const degrees = [
    { id: '1', title: 'Bachelor of Technology' },
    { id: '2', title: 'Bachelor of Science' },
    { id: '3', title: 'Master of Science' },
  ];
  const branches = [
    { id: '1', title: 'Computer Science' },
    { id: '2', title: 'Electronics' },
    { id: '3', title: 'Mechanical' },
  ];

  const fetchCollegeSuggestions = useCallback(q => {
    if (!q || q.length < 3) {
      setCollegeSuggestions([]);
      return;
    }
    const dummy = ['MIT', 'NIT Delhi', 'IIT Bombay'];
    const filtered = dummy.filter(c => c.toLowerCase().includes(q.toLowerCase()));
    setCollegeSuggestions(filtered.map((c, i) => ({ id: i.toString(), title: c })));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
      </View>

      <Text style={styles.title}>Tell us more</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Degree</Text>
        <AutocompleteDropdown
          dataSet={degrees}
          onSelectItem={item => setDegree(item?.title)}
          inputContainerStyle={styles.inputContainer}
          suggestionsListContainerStyle={styles.suggestionsContainer}
          suggestionsListTextStyle={styles.suggestionText}
          textInputProps={{ style: styles.inputText }}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Branch / Major</Text>
        <AutocompleteDropdown
          dataSet={branches}
          onSelectItem={item => setBranch(item?.title)}
          inputContainerStyle={styles.inputContainer}
          suggestionsListContainerStyle={styles.suggestionsContainer}
          suggestionsListTextStyle={styles.suggestionText}
          textInputProps={{ style: styles.inputText }}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>College / University</Text>
        <AutocompleteDropdown
          onChangeText={fetchCollegeSuggestions}
          dataSet={collegeSuggestions}
          onSelectItem={item => setCollege(item?.title)}
          inputContainerStyle={styles.inputContainer}
          suggestionsListContainerStyle={styles.suggestionsContainer}
          suggestionsListTextStyle={styles.suggestionText}
          textInputProps={{ style: styles.inputText }}
          debounce={300}
        />
      </View>

      <Image
        source={require('../assets/images/Degree.png')}
        style={styles.degree}
        resizeMode="contain"
      />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, (!(degree && branch && college)) && { opacity: 0.5 }]}
        onPress={() => navigation.navigate('ProfileImage')}
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
  progressInactive: { width: 40, height: 5, backgroundColor: '#e0e0e0', marginRight: 8, borderRadius: 3 },
  field: { width: '85%', marginBottom: 20 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: '600', color: '#333' },
  inputContainer: { borderRadius: 8, borderWidth: 1, borderColor: colors.gray, backgroundColor: '#F2F2F2', zIndex: 10, elevation: 5 },
  suggestionsContainer: { backgroundColor: '#F2F2F2', position: 'absolute', top: 45, zIndex: 99, elevation: 5 },
  suggestionText: { color: '#000' },
  inputText: { color: '#000' },
  degree: {
    height: 290,
    width: 290,
    marginVertical: -20,
  },
  button: {
    marginTop: 20, backgroundColor: colors.secondary, padding: 14, borderRadius: 8, width: '85%', alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 }, android: { elevation: 4 } }),
  },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
