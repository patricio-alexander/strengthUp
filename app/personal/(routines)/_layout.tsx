import { Stack } from "expo-router";

const RoutineLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="new-routine"
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="new-workout-session"
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
        }}
      />
    </Stack>
  );
};

export default RoutineLayout;
