import { Stack } from "expo-router";

const SettingsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Ajustes" }} />
      <Stack.Screen name="profile" options={{ title: "Perfil" }} />
      <Stack.Screen
        name="stateSub"
        options={{ title: "Estado de la subscripción" }}
      />
    </Stack>
  );
};

export default SettingsLayout;
