import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/colors";
import BottomNav from "../(tabs)/BottomNav"
import { router } from "expo-router";

const Timetable = () => {
  const navigation = useNavigation();

  // Sample lectures (with past + future)
  const [lectures, setLectures] = useState({
    "2025-09-05": [
      { subject: "OS", class: "IT-E", time: "10:00 AM", students: 40, status: "held" },
    ],
    "2025-09-07": [
      { subject: "DSA", class: "ECE-2", time: "11:00 AM", students: 55, status: "held" },
    ],
    "2025-09-08": [
      { subject: "OS", class: "IT-E", time: "9:00 AM", students: 45, status: "upcoming" },
      { subject: "DSA", class: "ECE-2", time: "11:00 AM", students: 52, status: "upcoming" },
    ],
  });

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [newClass, setNewClass] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Add new lecture
  const addLecture = () => {
    if (!newSubject || !newClass || !newDate || !newTime) return;
    const newLecture = {
      subject: newSubject,
      class: newClass,
      time: newTime,
      students: 0,
      status: "upcoming",
    };
    setLectures((prev) => {
      const updated = { ...prev };
      if (!updated[newDate]) updated[newDate] = [];
      updated[newDate].push(newLecture);
      return updated;
    });
    setModalVisible(false);
    setNewSubject("");
    setNewClass("");
    setNewDate("");
    setNewTime("");
  };

  // Generate month grid
  const generateMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let currentDay = 1 - firstDay;

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        if (currentDay > 0 && currentDay <= daysInMonth) {
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(currentDay).padStart(2, "0")}`;
          days.push(dateStr);
        } else {
          days.push(null);
        }
        currentDay++;
      }
      weeks.push(days);
    }
    return weeks;
  };

  const weeks = generateMonth(currentMonth, currentYear);

  // Lecture status
  const getLectureStatus = (dateStr) => {
    if (!lectures[dateStr]) return null;
    const hasHeld = lectures[dateStr].some((lec) => lec.status === "held");
    return hasHeld ? "held" : "upcoming";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with arrows */}
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            setCurrentMonth((prev) => {
              if (prev === 0) {
                setCurrentYear((y) => y - 1);
                return 11;
              }
              return prev - 1;
            })
          }
        >
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </Pressable>

        <Text style={styles.headerTitle}>
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </Text>

        <Pressable
          onPress={() =>
            setCurrentMonth((prev) => {
              if (prev === 11) {
                setCurrentYear((y) => y + 1);
                return 0;
              }
              return prev + 1;
            })
          }
        >
          <Ionicons name="chevron-forward" size={28} color={colors.white} />
        </Pressable>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        <View style={styles.weekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <Text key={d} style={styles.weekDay}>
              {d}
            </Text>
          ))}
        </View>

        {weeks.map((week, i) => (
          <View key={i} style={styles.weekRow}>
            {week.map((dateStr, j) => {
              if (!dateStr) return <View key={j} style={styles.dayCell} />;

              const lectureStatus = getLectureStatus(dateStr);
              const isSelected = dateStr === selectedDate;

              return (
                <Pressable
                  key={j}
                  style={[
                    styles.dayCell,
                    lectureStatus === "upcoming" && {
                      backgroundColor: colors.primary,
                    },
                    lectureStatus === "held" && {
                      backgroundColor: "#9e9e9e",
                    },
                    !lectureStatus && { borderWidth: 1, borderColor: "#ccc" },
                    isSelected && styles.selectedDay,
                  ]}
                  onPress={() => setSelectedDate(dateStr)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      (lectureStatus || isSelected) && { color: colors.secondary },
                    ]}
                  >
                    {parseInt(dateStr.split("-")[2], 10)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Lecture List */}
      <FlatList
        data={lectures[selectedDate] || []}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.lectureList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.lectureCard,
              item.status === "upcoming"
                ? styles.upcomingCard
                : styles.heldCard,
            ]}
          >
            {/* ✅ FIXED: show Subject + Class */}
            <Text style={styles.subject}>
              {item.subject} [{item.class}]
            </Text>
            <Text style={styles.time}>{item.time}</Text>
            {item.status === "upcoming" ? (
              <Text style={styles.statusUpcoming}>Upcoming</Text>
            ) : (
              <Text style={styles.statusHeld}>
                Held - {item.students} Students
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noLectures}>No lectures for this date</Text>
        }
      />

      {/* Floating Action Button */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>

      {/* Bottom Navigation */}
     <BottomNav/>

      {/* Add Lecture Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Lecture</Text>
            <TextInput
              placeholder="Class"
              value={newClass}
              onChangeText={setNewClass}
              style={styles.input}
            />
            <TextInput
              placeholder="Subject"
              value={newSubject}
              onChangeText={setNewSubject}
              style={styles.input}
            />
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={newDate}
              onChangeText={setNewDate}
              style={styles.input}
            />
            <TextInput
              placeholder="Time (e.g. 2:00 PM)"
              value={newTime}
              onChangeText={setNewTime}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.saveBtn} onPress={addLecture}>
                <Text style={{ color: colors.white }}>Save</Text>
              </Pressable>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.white }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Timetable;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, borderBottomWidth: 37 },

  header: {
    height: 100,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 40, 
  },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "700" },

  calendarContainer: { padding: 10 },
  weekRow: { flexDirection: "row" },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: "#444",
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  dayText: { fontSize: 14 },
  selectedDay: { borderWidth: 2, borderColor: colors.secondary },
  lectureList: { padding: 15 },
  lectureCard: {
    backgroundColor: colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  upcomingCard: { borderColor: colors.primary, backgroundColor: "#fff8e1" },
  heldCard: { borderColor: "#9e9e9e", backgroundColor: "#eeeeee" },

  subject: { fontSize: 18, fontWeight: "600", color: colors.secondary },
  time: { fontSize: 14, color: "#333" },
  statusUpcoming: { marginTop: 6, color: colors.primary, fontWeight: "700" },
  statusHeld: { marginTop: 6, color: colors.secondary, fontWeight: "700" },
  noLectures: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },

  // FAB
  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  tabButton: { alignItems: "center" },
  tabLabel: { fontSize: 12, marginTop: 2, color: colors.primary },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  cancelBtn: {
    backgroundColor: "#9e9e9e",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
});
