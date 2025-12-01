import { ItemList } from "@/components/ItemList";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRoutineStore } from "@/store/routineStore";
import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Alert } from "react-native";
import { IconButton } from "@/components/IconButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { Touchable } from "@/components/Touchable";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { daysExcercises, exercises } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { sets } from "@/db/schema";
import { NavigationHeader } from "@/components/NavigationHeader";
import { isValidName } from "@/helpers/inputValidation";
import { Modal } from "@/components/Modal";
import { useLocalSearchParams } from "expo-router";

export default function ModalAddExercices() {


  const {dayId} = useLocalSearchParams<{dayId: string}>()

  const currentDayId = Number(dayId)
  
  const {
    selectedExercises,
    exercises: exercisesStore,
    loadAllExercises,
    
    removeExercise,
    loadSelectedExercises,
  } = useRoutineStore();

  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "foreground");
  const [visible, setVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState<string>("");
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const [isEdit, setIsEdit] = useState(false);
  const [exerciseId, setExerciseId] = useState(0);
  const [search, setSearch] = useState("");

  const addNewExerciseInDb = async () => {
    if (!isValidName(exerciseName)) {
      return;
    }
    await drizzleDb.insert(exercises).values({
      name: exerciseName,
    });
    setVisible(false);
    loadAllExercises();

    setExerciseName("");
  };

  const closeModal = () => {
    setVisible(false);
    setIsEdit(false);
    setExerciseName("");
    setExerciseId(0);
  };

  const updatExerciseFromDb = async () => {
    if (!isValidName(exerciseName)) {
      return;
    }
    await drizzleDb
      .update(exercises)
      .set({
        name: exerciseName,
      })
      .where(eq(exercises.id, exerciseId));

    setVisible(false);
    setIsEdit(false);
    loadAllExercises();
  };

  const selectExercise = async ({ exerciseId }: { exerciseId: number }) => {
    
    const exist = await drizzleDb
      .select()
      .from(daysExcercises)
      .where(
        and(
          eq(daysExcercises.exerciseId, exerciseId),
          eq(daysExcercises.dayId, currentDayId),
        ),
      );

      

    if (!exist.length) {
      await drizzleDb
        .insert(daysExcercises)
        .values({ exerciseId, dayId: currentDayId });
      return loadSelectedExercises({ dayId: currentDayId });
    }

    Alert.alert(
      "Desvincular",
      "¿Deseas desvincular este ejercicio? Se removeran todas las series existentes.",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Aceptar",
          onPress: async () => {
            await drizzleDb
              .delete(daysExcercises)
              .where(
                and(
                  eq(daysExcercises.exerciseId, exerciseId),
                  eq(daysExcercises.dayId, currentDayId),
                ),
              );

            await drizzleDb
              .delete(sets)
              .where(eq(sets.dayExerciseId, exist[0].id));

            loadSelectedExercises({ dayId: currentDayId });
          },
        },
      ],
    );
  };

  const filter = exercisesStore.filter(({ name }) =>
    name?.toLocaleUpperCase().includes(search.toUpperCase()),
  );

  useEffect(() => {
    loadAllExercises();
  }, []);

  return (
    <ThemedView>
      <NavigationHeader
        title="Ejercicios"
        headerRight={() => (
          <IconButton name="plus" onPress={() => setVisible(true)} />
        )}
      />
      <ThemedInput
        style={{ marginHorizontal: 12, marginBottom: 12 }}
        placeholder="Buscar"
        onChangeText={setSearch}
        value={search}
      />
      <Modal animationType="fade" visible={visible} onRequestClose={closeModal}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>
          {isEdit ? "Actualizar nombre" : "Nombre"} del ejercicio
        </ThemedText>
        <ThemedInput onChangeText={setExerciseName} value={exerciseName} />
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 12,
          }}
        >
          <Touchable
            title="Cancelar"
            onPress={() => {
              closeModal();
            }}
          />
          <Touchable
            title="Guardar"
            disabled={!exerciseName.length}
            onPress={() =>
              !isEdit ? addNewExerciseInDb() : updatExerciseFromDb()
            }
          />
        </View>

        {isEdit && (
          <Touchable
            type="danger"
            title="Eliminar"
            disabled={!exerciseName.length}
            onPress={() => {
              removeExercise({ id: Number(exerciseId) });
              setVisible(false);
              setExerciseName("");
              setExerciseId(0);
            }}
          />
        )}
      </Modal>

      {!exercisesStore.length ? (
        <ThemedText style={{ textAlign: "center" }}>
          No hay ejercicios. ¡Agrega uno!
        </ThemedText>
      ) : (
        <FlatList
          contentContainerStyle={Styles.listContent}
          keyExtractor={(_, index) => index.toString()}
          data={filter}
          renderItem={({ item }) => {
            return (
              <ItemList
                onLongPress={() => {
                  setIsEdit(true);
                  setVisible(true);
                  setExerciseName(item?.name ?? "");
                  setExerciseId(item.id);
                }}
                value={item.name as string}
                style={
                  selectedExercises.some(
                    (exercise) => item.id === exercise.id,
                  ) && {
                    backgroundColor: tint,
                  }
                }
                textStyle={
                  selectedExercises.some(
                    (exercise) => item.id === exercise.id,
                  ) && { color: bg }
                }
                onPress={() => selectExercise({ exerciseId: item.id })}
              />
            );
          }}
        />
      )}
    </ThemedView>
  );
}

const Styles = StyleSheet.create({
  listContent: {
    marginHorizontal: 12,
    gap: 12,
    paddingBottom: 100,
  },
});
