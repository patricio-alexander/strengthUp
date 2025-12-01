import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { StyleSheet, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { useEffect } from "react";

export default function SettingsCoach() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      }
    });

    return unsubscribe; // cleanup
  }, []);

  return (
    <ThemedView>
      <View style={styles.header}>
        <ThemedText type="subtitle">Ajustes</ThemedText>

        <Touchable
          type="shadow"
          onPress={() => auth.signOut()}
          title="Cerrar sesión"
          icon="sign-out"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
