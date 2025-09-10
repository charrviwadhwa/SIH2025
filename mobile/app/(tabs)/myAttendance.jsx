import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../utils/colors";
import Navbar from "../(tabs)/Studentnavbar";

const Profile = () => {
  const [user, setUser] = useState({ name: "User Name", email: "user@example.com" });

  const subjects = [
    { id: 1, name: "Operating Systems", attended: 18, total: 24 },
    { id: 2, name: "DBMS", attended: 20, total: 28 },
    { id: 3, name: "Computer Networks", attended: 15, total: 20 },
    { id: 4, name: "AI & ML", attended: 10, total: 16 },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Bottom Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Subject Attendance Cards */}
        <Text style={styles.sectionTitle}>Attendance Overview</Text>
        {subjects.map((subj) => {
          const percentage = ((subj.attended / subj.total) * 100).toFixed(1);
          const isLow = percentage < 75;

          return (
            <View
              key={subj.id}
              style={[styles.attendanceCard, isLow && { borderLeftColor: "red" }]}
            >
              <View style={styles.subjectBox}>
                <Text style={styles.subjectName}>{subj.name}</Text>
                <Text style={styles.subText}>
                  {subj.attended} / {subj.total} classes
                </Text>
              </View>

              <View style={styles.percentageBox}>
                <Text style={[styles.percentage, { color: isLow ? "red" : "green" }]}>
                  {percentage}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer Navigation */}
      <Navbar />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    height: 150,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
  },
  content: { flex: 1, padding: 20 },
  card: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 15,
  },
  name: { fontSize: 20, fontWeight: "700", color: colors.white },
  email: { fontSize: 14, color: "#eee", marginTop: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.secondary,
    marginBottom: 10,
  },
  attendanceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 6,
    borderLeftColor: "green",
  },
  subjectBox: { flex: 1 },
  subjectName: { fontSize: 16, fontWeight: "600", color: colors.secondary },
  subText: { fontSize: 13, color: "#666", marginTop: 3 },
  percentageBox: { alignItems: "flex-end" },
  percentage: { fontSize: 18, fontWeight: "700" },
});
