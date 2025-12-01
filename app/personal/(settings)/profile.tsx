import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUserStore } from "@/store/userStore";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { IconButton } from "@/components/IconButton";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NavigationHeader } from "@/components/NavigationHeader";

export default function ProfileScreen() {
  const { user, userId, setUser } = useUserStore();
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState("");
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const [success, setSuccess] = useState(false);
  const successColor = useThemeColor({}, "success");

  const changeUsername = async () => {
    setUser({ user: value, userId });
    await drizzleDb
      .update(users)
      .set({
        username: value,
      })
      .where(eq(users.id, userId));
    setEdit(false);
    setSuccess(true);
  };

  return (
    <ThemedView>
      <NavigationHeader
        title="Usuario"
        headerRight={() =>
          edit && <IconButton name="check" onPress={() => changeUsername()} />
        }
      />
      <View style={styles.inputControl}>
        <ThemedText type="defaultSemiBold">Nombre de usuario</ThemedText>
        <ThemedInput
          defaultValue={user}
          onChangeText={(e) => {
            setEdit(true);
            setValue(e);
          }}
        />
      </View>
      {success && (
        <ThemedText style={{ color: successColor, paddingHorizontal: 20 }}>
          Nombre de usuario actualizado con éxito
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputControl: {
    marginHorizontal: 20,
  },
});
