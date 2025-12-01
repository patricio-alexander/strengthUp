import { IconButton } from "@/components/IconButton";
import { ItemList } from "@/components/ItemList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { firestore } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { Link, useFocusEffect } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, useColorScheme, View } from "react-native";
import { Room } from "@/types/rooms";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-simple-toast";
import { Colors } from "@/constants/Colors";

type Rooms = Room & {
  id: string;
};

export default function RoomsScreen() {
  const user = getAuth().currentUser;
  const colorScheme = useColorScheme() ?? "light";
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const { background } = Colors[colorScheme];

  const fetchRooms = async () => {
    const q = query(
      collection(firestore, "rooms"),
      where("coachId", "==", user?.uid),
    );

    const roomsFirestore = await getDocs(q);

    setRooms(
      roomsFirestore.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Rooms,
      ),
    );
  };

  const copyToClipboard = async (value: string) => {
    await Clipboard.setStringAsync(value);
    Toast.show("Copiado en el portapales", Toast.LONG, {
      backgroundColor: background,
    });
  };

  const removeRoom = async ({
    roomId,
    roomCode,
  }: {
    roomId: string;
    roomCode: string;
  }) => {
    try {
      setRooms((prev) => prev.filter((r) => r.id !== roomId));

      await deleteDoc(doc(firestore, "rooms", roomId));
      const q = query(
        collection(firestore, "customers"),
        where("roomId", "==", roomCode),
      );
      const customersSnapshot = await getDocs(q);

      const updatePromises = customersSnapshot.docs.map((c) =>
        updateDoc(doc(firestore, "customers", c.id), { roomId: "" }),
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error al limpiar roomId de los clientes", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, []),
  );

  return (
    <ThemedView>
      <View style={styles.header}>
        <ThemedText type="subtitle">Salas</ThemedText>
        <Link asChild href="/coach/form-room">
          <Touchable type="shadow" title="Crear sala" />
        </Link>
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ gap: 12 }}
        data={rooms}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/coach/room/[roomCode]",
              params: {
                roomCode: item.code,
                roomName: item.name,
              },
            }}
            asChild
          >
            <ItemList
              value={() => <ThemedText>{item.name}</ThemedText>}
              right={() => (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    flex: 1,
                  }}
                >
                  <Link
                    asChild
                    href={{
                      pathname: "/coach/form-room",
                      params: {
                        roomName: item.name,
                        roomId: item.id,
                      },
                    }}
                  >
                    <IconButton name="pencil" size={24} />
                  </Link>
                  <IconButton
                    name="copy"
                    size={24}
                    onPress={() => copyToClipboard(item.code)}
                  />

                  <IconButton
                    name="trash"
                    size={24}
                    onPress={() =>
                      removeRoom({ roomId: item.id, roomCode: item.code })
                    }
                  />
                </View>
              )}
            />
          </Link>
        )}
      />
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  list: {
    marginHorizontal: 12,
  },
});
