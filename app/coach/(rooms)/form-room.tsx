import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { firestore } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { router, useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Room } from "@/types/rooms";

export default function FormRoom() {
  const auth = getAuth().currentUser;

  const { roomId, roomName } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Room>({
    name: "",
    coachId: auth?.uid,
    code: Crypto.randomUUID(),
    createAt: serverTimestamp(),
  });

  const colorScheme = useColorScheme() ?? "light";
  const { tint } = Colors[colorScheme];

  const handleChangeInput = (name: keyof Room, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createNewRoom = async () => {
    try {
      setLoading(true);
      const addRomm = await addDoc(collection(firestore, "rooms"), form);
      setLoading(false);

      Alert.alert("Clase", `Clase añadida con éxito`, [
        {
          text: "Aceptar",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", `Ocurrio un error ${error}`, [
        {
          text: "Aceptar",
          onPress: () => {
            console.log("Aceptar");
          },
        },
      ]);
    }
  };

  const updateRoom = async (id: string | string[]) => {
    try {
      setLoading(true);
      const roomRef = doc(firestore, "rooms", id as string);

      await updateDoc(roomRef, {
        name: form.name,
      });

      setLoading(false);

      Alert.alert("Clase", `Clase actualizada con éxito`, [
        {
          text: "Aceptar",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", `Ocurrio un error ${error}`, [
        {
          text: "Aceptar",
          onPress: () => {
            console.log("Aceptar");
          },
        },
      ]);
    }
  };

  useEffect(() => {
    if (roomName) {
      setForm((prev) => ({ ...prev, name: roomName as string }));
    }
  }, [roomName]);

  return (
    <ThemedView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? undefined : "padding"}
      >
        <NavigationHeader
          title={roomName ? "Editar sala" : "Añadir sala"}
          headerRight={() => {
            if (loading) {
              return <ActivityIndicator size="small" color={tint} />;
            }
            if (form.name) {
              return (
                <Touchable
                  type="shadow"
                  title="Guardar"
                  onPress={() => {
                    if (roomId) {
                      return updateRoom(roomId);
                    }
                    createNewRoom();
                  }}
                />
              );
            }
          }}
        />
        <ScrollView
          style={styles.form}
          contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
        >
          <View>
            <ThemedText style={{ marginBottom: 4 }}>
              Nombre de la sala
            </ThemedText>
            <ThemedInput
              onChangeText={(name) => handleChangeInput("name", name)}
              value={form.name}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 12,
  },
});
