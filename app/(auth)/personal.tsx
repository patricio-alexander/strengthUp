import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { useEffect, useState } from "react";
import { Role, useUserStore } from "@/store/userStore";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { users } from "@/db/schema";
import { router } from "expo-router";
import { Touchable } from "@/components/Touchable";
import { View } from "react-native";
import { NavigationHeader } from "@/components/NavigationHeader";
import { eq } from "drizzle-orm";
type User = typeof users.$inferSelect;

export default function PersonalAccount() {
  const [value, setValue] = useState("");
  const { setUser, setRole } = useUserStore();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const [user, setSomeUser] = useState<User>({
    id: 0,
    loggedIn: false,
    username: "",
  });

  const addUserInDb = async () => {
    const id = await drizzleDb
      .insert(users)
      .values({
        username: value,
        loggedIn: true,
      })
      .returning({ insertedId: users.id });

    setUser({ user: value, userId: id[0].insertedId });
    setRole({ role: Role.Personal });
  };

  const someUserInDb = async () => {
    const user = await drizzleDb.select().from(users);
    if (user.length) {
      setSomeUser(user[0]);
    }
  };

  const logIn = async () => {
    await drizzleDb
      .update(users)
      .set({
        loggedIn: true,
      })
      .where(eq(users.id, user.id));
    setUser({ user: user.username, userId: user.id });
    setRole({ role: Role.Personal });
    router.navigate("/personal/(routines)");
  };

  useEffect(() => {
    someUserInDb();
  }, []);

  return (
    <ThemedView>
      <NavigationHeader title="Accede a tu cuenta personal" />
      <View style={{ marginHorizontal: 12 }}>
        {user.id ? (
          <Touchable title={`Entrar como ${user.username}`} onPress={logIn} />
        ) : (
          <View>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 6 }}>
              Establece tu nombre para comenzar
            </ThemedText>
            <ThemedInput
              onChangeText={setValue}
              value={value}
              style={{ marginBottom: 12 }}
            />
            <Touchable
              title="Guardar"
              onPress={() => {
                addUserInDb();
                router.replace("/personal");
              }}
            />
          </View>
        )}
      </View>
    </ThemedView>
  );
}
