// StudentProfileScreen.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/colors";
import Navbar from "../(tabs)/Studentnavbar"

const StudentProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editProfile, setEditProfile] = useState(true);

  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "janedoe@gmail.com",
    identity: "MSIT2025",
    college: "MSIT",
    department: "CSE",
    mobile: "+91-987654321",
  });

  const [teachers] = useState([
    {
      id: "1",
      name: "Dr. Ravi Kumar",
      subject: "Operating Systems",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "2",
      name: "Ms. Priya Sharma",
      subject: "Database Management",
      photo: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: "3",
      name: "Dr. Anil Mehta",
      subject: "Machine Learning",
      photo: "https://randomuser.me/api/portraits/men/50.jpg",
    },
  ]);

  const handleSaveProfile = () => setEditProfile(false);

  // icons map
  const getIcon = (key) => {
    switch (key) {
      case "name":
        return "person-outline";
      case "email":
        return "mail-outline";
      case "identity":
        return "id-card-outline";
      case "college":
        return "school-outline";
      case "department":
        return "layers-outline";
      case "mobile":
        return "call-outline";
      default:
        return "create-outline";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Toggle Tabs */}
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleBtn, activeTab === "profile" && styles.activeTab]}
          onPress={() => setActiveTab("profile")}
        >
          <Text style={[styles.toggleText, activeTab === "profile" && styles.activeText]}>
            Profile
          </Text>
        </Pressable>

        <Pressable
          style={[styles.toggleBtn, activeTab === "teachers" && styles.activeTab]}
          onPress={() => setActiveTab("teachers")}
        >
          <Text style={[styles.toggleText, activeTab === "teachers" && styles.activeText]}>
            Teachers
          </Text>
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <View style={styles.profileForm}>
            {/* Avatar with edit */}
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/women/1.jpg" }}
                style={styles.profileAvatar}
              />
              <Pressable style={styles.editAvatar} onPress={() => alert("Edit Image Feature Here")}>
                <Ionicons name="create-outline" size={18} color="#fff" />
              </Pressable>
            </View>

            {Object.keys(profile).map((key) => (
              <View
                key={key}
                style={[
                  styles.inputWrapper,
                  !editProfile && { backgroundColor: "#f5f5f5" },
                ]}
              >
                <Ionicons
                  name={getIcon(key)}
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
        )}

        {/* Teachers Tab */}
        {activeTab === "teachers" && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>My Teachers</Text>
            {teachers.map((teacher) => (
              <View key={teacher.id} style={styles.teacherCard}>
                <Image source={{ uri: teacher.photo }} style={styles.teacherPhoto} />
                <View style={styles.teacherInfo}>
                  <Text style={styles.teacherName}>{teacher.name}</Text>
                  <View style={styles.subjectRow}>
                    <Ionicons name="book-outline" size={16} color={colors.primary} />
                    <Text style={styles.teacherSubject}>{teacher.subject}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add bottom padding to account for navbar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fixed Bottom Navbar */}
      <View style={styles.navbarContainer}>
        <Navbar/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" ,
    paddingTop:30
  },

  toggleRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  toggleBtn: { 
    flex: 1, 
    padding: 12, 
    alignItems: "center" 
  },
  toggleText: { 
    fontSize: 16, 
    color: "gray" 
  },
  activeTab: { 
    borderBottomWidth: 2, 
    borderBottomColor: colors.primary 
  },
  activeText: { 
    color: colors.primary, 
    fontWeight: "bold" 
  },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },

  profileForm: { 
    alignItems: "center", 
    marginTop: 20 
  },
  avatarWrapper: { 
    position: "relative" 
  },
  profileAvatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 20 
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    width: "90%",
    paddingHorizontal: 8,
  },
  icon: { 
    paddingHorizontal: 6 
  },
  inputWithIcon: { 
    flex: 1, 
    paddingVertical: 10, 
    paddingHorizontal: 8 
  },

  saveBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    width: "90%",
    alignItems: "center",
  },
  saveText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },

  // Teachers Tab
  section: { 
    marginTop: 20, 
    marginBottom: 20 
  },
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 12, 
    color: "#000" 
  },
  teacherCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  teacherPhoto: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12 
  },
  teacherInfo: { 
    flex: 1 
  },
  teacherName: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 4 
  },
  subjectRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  teacherSubject: { 
    marginLeft: 6, 
    fontSize: 14, 
    color: "#333" 
  },

  bottomPadding: {
    height: 80, // Adjust based on your navbar height
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default StudentProfileScreen;