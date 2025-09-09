import { SafeAreaView, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>Hello, this is Index Page</Text>
      <Button title="Go to Home" onPress={() => router.push("/HomeScreen")} />
      <Button title="Login" onPress={() => router.push("/Login")} />
      <Button title="Name" onPress={() => router.push("/Name")} />
      <Button title="UserTypeScreen" onPress={() => router.push("/UserTypeScreen")} />
      <Button title="Email" onPress={() => router.push("/Email")} />
      <Button title="Degree" onPress={() => router.push("/Degree")} />
      <Button title="Dashboard" onPress={() => router.push("/Dashboard")} />
      <Button title="QR" onPress={() => router.push("/QR")} />
      <Button title="Timetable" onPress={() => router.push("/Timetable")} />
      <Button title="Student" onPress={() => router.push("/Student")} />
      <Button title="Profile" onPress={() => router.push("/Profile")} />
      <Button title="myAttendance" onPress={() => router.push("/myAttendance")} />
    </SafeAreaView>
  );
}
