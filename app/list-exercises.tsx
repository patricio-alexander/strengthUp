import { ItemList } from "@/components/ItemList";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Alert } from "react-native";
import { IconButton } from "@/components/IconButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { Touchable } from "@/components/Touchable";
import { NavigationHeader } from "@/components/NavigationHeader";
import { isValidName } from "@/helpers/inputValidation";
import { Modal } from "@/components/Modal";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Exercises } from "@/types/exercises";
import { useSelectedExercises } from "@/hooks/useSelectedExercises";
import { Skeleton } from "@/components/Skeleton";

const useExercises = () => {
  const [exercises, setExercises] = useState<Exercises[]>([]);

  const fetchExercises = async () => {
    const { data } = await supabase.from("exercises").select();

    if (data) {
      setExercises(data);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return { exercises, fetchExercises };
};

export default function ModalAddExercices() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();

  const { exercises, fetchExercises } = useExercises();
  const { selectedExercises, isLoading } = useSelectedExercises(workoutId);

  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "foreground");
  const [visible, setVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [exerciseId, setExerciseId] = useState(0);
  const [search, setSearch] = useState("");

  const addNewExercise = async () => {
    if (!isValidName(exerciseName)) {
      return;
    }

    await supabase.from("exercises").insert({
      name: exerciseName,
    });

    setVisible(false);
    fetchExercises();
    setExerciseName("");
  };

  const closeModal = () => {
    setVisible(false);
    setIsEdit(false);
    setExerciseName("");
    setExerciseId(0);
  };

  const updatExercise = async () => {
    if (!isValidName(exerciseName)) {
      return;
    }

    const { error } = await supabase
      .from("exercises")
      .update({ name: exerciseName })
      .eq("id", exerciseId);

    setVisible(false);
    setIsEdit(false);
    fetchExercises();
  };

  const selectExercise = async ({ exerciseId }: { exerciseId: number }) => {
    const { count: exist } = await supabase
      .from("workout_sessions_exercises")
      .select("*", { count: "exact", head: true })
      .eq("exercise_id", exerciseId)
      .eq("workout_id", workoutId);

    if (!exist) {
      await supabase
        .from("workout_sessions_exercises")
        .insert({ workout_id: workoutId, exercise_id: exerciseId });
      return;
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
            await supabase
              .from("workout_sessions_exercises")
              .delete()
              .eq("exercise_id", exerciseId)
              .eq("workout_id", workoutId);
          },
        },
      ],
    );
  };

  const filter = exercises.filter(({ name }) =>
    name?.toLocaleUpperCase().includes(search.toUpperCase()),
  );

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
            onPress={() => (!isEdit ? addNewExercise() : updatExercise())}
          />
        </View>

        {isEdit && (
          <Touchable
            type="danger"
            title="Eliminar"
            disabled={!exerciseName.length}
            onPress={() => {
              //removeExercise({ id: Number(exerciseId) });
              setVisible(false);
              setExerciseName("");
              setExerciseId(0);
            }}
          />
        )}
      </Modal>
      {isLoading ? (
        <View style={{ marginHorizontal: 12, gap: 12 }}>
          <Skeleton isLoading={isLoading}>
            <ItemList value="" />
          </Skeleton>
          <Skeleton isLoading={isLoading}>
            <ItemList value="" />
          </Skeleton>
          <Skeleton isLoading={isLoading}>
            <ItemList value="" />
          </Skeleton>
        </View>
      ) : !exercises.length ? (
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
