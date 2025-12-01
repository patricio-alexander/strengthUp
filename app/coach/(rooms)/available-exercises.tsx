import { IconButton } from "@/components/IconButton";
import { ItemList } from "@/components/ItemList";
import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { useRoutineStore } from "@/store/routineStore";
import { useSelectedExerciseStore } from "@/store/selectedExerciseStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Modal } from "@/components/Modal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { Touchable } from "@/components/Touchable";
import { exercises } from "@/db/schema";
import Toast from "react-native-simple-toast";
import { useColors } from "@/hooks/useColors";

export default function ModalAvailableExerciseScreen() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const { loadAllExercises, exercises: exercisesList } = useRoutineStore();
  const { indexBlock } = useLocalSearchParams();
  const { setSelectedExercise } = useSelectedExerciseStore();
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { background } = useColors();

  const filterExercises = exercisesList.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const addNewExercise = async () => {
    await drizzleDb.insert(exercises).values({ name: value });
    Toast.show("Exejercicio agregado con éxito", Toast.LONG, {
      backgroundColor: background,
    });
    setVisible(false);
  };

  useEffect(() => {
    loadAllExercises();
  }, []);

  return (
    <ThemedView>
      <NavigationHeader
        title="Ejercicios disponibles"
        headerRight={() => (
          <IconButton name="plus" onPress={() => setVisible(true)} />
        )}
      />
      <ThemedInput
        placeholder="Buscar"
        style={{ marginBottom: 12, marginHorizontal: 12 }}
        onChangeText={setSearch}
        value={search}
      />
      <FlatList
        style={{ marginHorizontal: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
        data={filterExercises}
        renderItem={({ item }) => (
          <ItemList
            value={item.name ?? ""}
            onPress={() => {
              setSelectedExercise(item.name ?? "", Number(indexBlock));
              router.back();
            }}
          />
        )}
      />
      <Modal visible={visible}>
        <ThemedText type="defaultSemiBold">
          Inserte el nombre del ejercicio
        </ThemedText>
        <ThemedInput onChangeText={setValue} value={value} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 10,
            gap: 12,
          }}
        >
          <Touchable title="Cancelar" onPress={() => setVisible(false)} />
          <Touchable
            title="Guardar"
            disabled={Boolean(!value.length)}
            onPress={() => addNewExercise()}
          />
        </View>
      </Modal>
    </ThemedView>
  );
}
