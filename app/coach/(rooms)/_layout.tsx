import { Stack } from "expo-router";

const CustomersLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="form-room"
        options={{
          animation: "fade_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="available-exercises"
        options={{
          animation: "fade_from_bottom",
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default CustomersLayout;
