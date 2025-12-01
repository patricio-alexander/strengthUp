import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { firestore } from "@/firebaseConfig";
import { Link, useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Customer } from "@/types/customer";
import { FlatList, StyleSheet } from "react-native";
import { ItemList } from "@/components/ItemList";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function RoomScreen() {
  const { roomCode, roomName } = useLocalSearchParams<{
    roomCode: string;
    roomName: string;
  }>();

  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustmersRoom = async () => {
    const q = query(
      collection(firestore, "customers"),
      where("roomId", "==", roomCode),
    );

    const customers = await getDocs(q);

    setCustomers(
      customers.docs.map((d) => ({ id: d.id, ...d.data() })) as Customer[],
    );
  };

  useEffect(() => {
    fetchCustmersRoom();
  }, [roomCode]);

  return (
    <ThemedView>
      <NavigationHeader title={roomName} />
      <FlatList
        style={styles.list}
        contentContainerStyle={{ gap: 12 }}
        data={customers}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname:
                "/coach/(rooms)/(customers)/[customerId]/assing-routine",
              params: {
                customerId: item.id,
              },
            }}
            asChild
          >
            <ItemList
              value={() => (
                <View>
                  <ThemedText>({item.username})</ThemedText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <ThemedText>{item.bodyStats.weight} kg</ThemedText>
                    <ThemedText>{item.bodyStats.height} cm</ThemedText>
                  </View>
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
  list: {
    marginTop: 12,
    marginHorizontal: 12,
  },
});
