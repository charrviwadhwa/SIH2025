// ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../utils/colors";
import BottomNav from "./BottomNav";

const ProfileScreen = () => {
  const [isProfile, setIsProfile] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState({ class: "", subject: "", code: "" });
  const [duplicateError, setDuplicateError] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    identity: "",
    college: "",
    department: "",
    mobile: "",
  });

  // Fetch user info from backend
  const fetchProfile = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      const role = await AsyncStorage.getItem("userRole");

      if (!email || !role) {
        Alert.alert("Error", "User info missing. Please login again.");
        return;
      }

      const res = await fetch(`http://192.168.1.9:5000/auth/user?email=${email}&role=${role}`);
      const data = await res.json();

      if (!res.ok) {
        console.log("Fetch profile error:", data.error);
        Alert.alert("Error", data.error || "Failed to fetch profile");
        return;
      }

      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
        identity: data.user.identity || "",
        college: data.user.college || "",
        department: data.user.department || "",
        mobile: data.user.mobile || "",
      });

      if (role === "teacher" && data.user.subjects) {
        setSubjects(data.user.subjects);
      }

      setLoading(false);
    } catch (err) {
      console.error("Fetch profile error:", err);
      Alert.alert("Error", "Could not fetch profile");
      setLoading(false);
    }
  };

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      const role = await AsyncStorage.getItem("userRole");

      if (!email || !role) return;

      const res = await fetch(`http://192.168.1.9:5000/auth/user?email=${email}&role=${role}`);
      const data = await res.json();

      if (!res.ok) return;

      // Update profile info
      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
        identity: data.user.identity || "",
        college: data.user.college || "",
        department: data.user.department || "",
        mobile: data.user.mobile || "",
      });

      // Use sample subjects if none exist
      if (role === "teacher") {
        setSubjects(data.user.subjects && data.user.subjects.length
          ? data.user.subjects
          : [
              { id: "1", class: "CSE-1", subject: "Operating Systems", code: "CS301" },
              { id: "2", class: "CSE-2", subject: "Database Management", code: "CS302" },
              { id: "3", class: "CSE-3", subject: "Data Structures", code: "CS303" },
            ]
        );
      } else if (role === "student") {
        setSubjects(data.user.subjects && data.user.subjects.length
          ? data.user.subjects
          : [
              { id: "1", class: "CSE-1", subject: "Maths", code: "MA101" },
              { id: "2", class: "CSE-1", subject: "Physics", code: "PH101" },
            ]
        );
      }

    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  fetchProfile();
}, []);


  const handleSaveProfile = () => {
    // Optionally: send updated profile to backend
    setEditProfile(false);
  };

  const addSubject = () => {
    if (!newSubject.class || !newSubject.subject || !newSubject.code) return;

    const exists = subjects.find(
      (s) =>
        s.subject.toLowerCase() === newSubject.subject.toLowerCase() ||
        s.code.toLowerCase() === newSubject.code.toLowerCase()
    );

    if (exists) {
      setDuplicateError(true);
      return;
    }

    setSubjects([...subjects, { id: Date.now().toString(), ...newSubject }]);
    setNewSubject({ class: "", subject: "", code: "" });
    setDuplicateError(false);
    setModalVisible(false);
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const renderSubject = ({ item }) => (
    <View style={styles.tile}>
      <Text style={styles.classText}>{item.class}</Text>
      <Text style={styles.subjectText}>{item.subject}</Text>
      <Text style={styles.codeText}>{item.code}</Text>
      <Pressable onPress={() => deleteSubject(item.id)} style={{ marginTop: 10 }}>
        <Ionicons name="trash-outline" size={20} color="red" />
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Toggle */}
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleBtn, isProfile && styles.activeTab]}
          onPress={() => setIsProfile(true)}
        >
          <Text style={[styles.toggleText, isProfile && styles.activeText]}>Profile</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, !isProfile && styles.activeTab]}
          onPress={() => setIsProfile(false)}
        >
          <Text style={[styles.toggleText, !isProfile && styles.activeText]}>Subjects</Text>
        </Pressable>
      </View>

      {/* Profile Section */}
      {isProfile ? (
        <View style={styles.profileForm}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              style={styles.profileAvatar}
            />
            <Pressable style={styles.editAvatar}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </Pressable>
          </View>

          {Object.keys(profile).map((key) => (
            <View
              style={[styles.inputWrapper, !editProfile && { backgroundColor: "#f5f5f5" }]}
              key={key}
            >
              <Ionicons
                name={
                  key === "name"
                    ? "person-outline"
                    : key === "email"
                    ? "mail-outline"
                    : key === "identity"
                    ? "id-card-outline"
                    : key === "college"
                    ? "school-outline"
                    : key === "department"
                    ? "layers-outline"
                    : "call-outline"
                }
                size={20}
                color={colors.primary}
                style={styles.icon}
              />
              <TextInput
                style={styles.inputWithIcon}
                value={profile[key]}
                onChangeText={(text) => setProfile({ ...profile, [key]: text })}
                editable={editProfile}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            </View>
          ))}
          {editProfile ? (
            <Pressable style={styles.saveBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveText}>SAVE</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.saveBtn, { backgroundColor: "gray" }]}
              onPress={() => setEditProfile(true)}
            >
              <Text style={styles.saveText}>EDIT</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={styles.subjectsContainer}>
          <FlatList
            data={subjects}
            renderItem={renderSubject}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tilesGrid}
          />
          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={50} color={colors.primary} />
          </Pressable>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Subject</Text>
                {duplicateError && (
                  <Text style={styles.duplicateText}>Subject or Code Already Exists!</Text>
                )}
                {/* Input Fields */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="school-outline" size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Class"
                    value={newSubject.class}
                    onChangeText={(text) => setNewSubject({ ...newSubject, class: text })}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="book-outline" size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Subject"
                    value={newSubject.subject}
                    onChangeText={(text) => setNewSubject({ ...newSubject, subject: text })}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="code-slash-outline" size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Paper Code"
                    value={newSubject.code}
                    onChangeText={(text) => setNewSubject({ ...newSubject, code: text })}
                  />
                </View>
                <View style={styles.modalButtonsRow}>
                  <Pressable style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={addSubject}>
                    <Text style={styles.modalBtnText}>Add</Text>
                  </Pressable>
                  <Pressable style={[styles.modalBtn, { backgroundColor: "gray" }]} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalBtnText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      <View style={styles.bottomPadding} />
      <View style={styles.navbarContainer}>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  toggleRow: { flexDirection: "row", justifyContent: "center", margin: 10 },
  toggleBtn: { flex: 1, padding: 12, alignItems: "center" },
  toggleText: { fontSize: 16, color: "gray" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  activeText: { color: colors.primary, fontWeight: "bold" },
  profileForm: { alignItems: "center", marginTop: 20 },
  avatarWrapper: { position: "relative" },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  editAvatar: { position: "absolute", bottom: 0, right: 0, backgroundColor: colors.primary, padding: 6, borderRadius: 20, borderWidth: 2, borderColor: "#fff" },
  inputWrapper: { flexDirection: "row", alignItems: "center", marginVertical: 8, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, backgroundColor: "#fff", width: "90%", paddingHorizontal: 8 },
  icon: { paddingHorizontal: 6 },
  inputWithIcon: { flex: 1, paddingVertical: 10, paddingHorizontal: 8 },
  saveBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: 10, marginTop: 15, width: "90%", alignItems: "center" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subjectsContainer: { flex: 1, padding: 10 },
  tilesGrid: { paddingBottom: 20 },
  tile: { flex: 1, margin: 8, backgroundColor: "#f9f9f9", borderRadius: 15, padding: 14, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  classText: { fontSize: 16, fontWeight: "bold" },
  subjectText: { fontSize: 14, color: "#333" },
  codeText: { fontSize: 12, fontStyle: "italic", color: "gray" },
  addButton: { alignSelf: "center", marginVertical: 15 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: colors.primary },
  duplicateText: { color: "red", fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  modalButtonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15, width: "100%" },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 5 },
  modalBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  bottomPadding: { height: 80 },
  navbarContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#eee", paddingBottom: 20 },
});

export default ProfileScreen;
