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
import { useUserStore } from "@/store/userStore";
import { useColors } from "@/hooks/useColors";

const useDefaultExercises = () => {
  const [defaultExercises, setDefaultExercises] = useState<Exercises[]>([]);

  const fetchDefaultExercises = async () => {
    const { data } = await supabase
      .from("user_exercises")
      .select()
      .eq("default_exercise", true);
    if (!data?.length) {
      return;
    }

    setDefaultExercises(data);
  };

  useEffect(() => {
    fetchDefaultExercises();
  }, []);
  return { defaultExercises, fetchDefaultExercises };
};

const useUserExercises = (userId: string | undefined) => {
  const [exercises, setExercises] = useState<Exercises[]>([]);

  const fetchExercises = async () => {
    const { data } = await supabase
      .from("user_exercises")
      .select()
      .eq("user_id", userId);

    if (data) {
      setExercises(data);
    }
  };

  const removeExercise = async ({ id }: { id: number }) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    await supabase.from("user_exercises").delete().eq("id", id);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return { exercises, fetchExercises, removeExercise };
};

enum ExercisesFilter {
  myExercises,
  defaultExercises,
}

export default function ModalAddExercices() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { user } = useUserStore();

  const { exercises, fetchExercises, removeExercise } = useUserExercises(
    user?.id,
  );
  const { selectedExercises, isLoading, fetchSelectedExercises } =
    useSelectedExercises(workoutId);
  const { defaultExercises } = useDefaultExercises();
  const { secondary } = useColors();

  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "foreground");
  const [visible, setVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [exerciseId, setExerciseId] = useState(0);
  const [search, setSearch] = useState("");
  const [exercisesFilter, setExercisesFilter] = useState<ExercisesFilter>(
    ExercisesFilter.myExercises,
  );

  const addNewExercise = async () => {
    if (!isValidName(exerciseName)) {
      return;
    }

    await supabase.from("user_exercises").insert({
      name: exerciseName,
      user_id: user?.id,
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
      .from("user_exercises")
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
      fetchSelectedExercises();

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
            fetchSelectedExercises();
          },
        },
      ],
    );
  };

  let filter: Exercises[] = [];

  if (exercisesFilter === ExercisesFilter.myExercises) {
    filter = exercises.filter(({ name }) =>
      name?.toLocaleUpperCase().includes(search.toUpperCase()),
    );
  }
  if (exercisesFilter === ExercisesFilter.defaultExercises) {
    filter = defaultExercises.filter(({ name }) =>
      name?.toLocaleUpperCase().includes(search.toUpperCase()),
    );
  }

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginBottom: 12,
        }}
      >
        <Touchable
          title="Mis ejercicios"
          onPress={() => {
            setExercisesFilter(ExercisesFilter.myExercises);
          }}
          style={{
            backgroundColor:
              exercisesFilter === ExercisesFilter.myExercises
                ? secondary
                : undefined,
          }}
        />
        <Touchable
          title="Ejercicios disponibles"
          onPress={() => {
            setExercisesFilter(ExercisesFilter.defaultExercises);
          }}
          style={{
            backgroundColor:
              exercisesFilter === ExercisesFilter.defaultExercises
                ? secondary
                : undefined,
          }}
        />
      </View>

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
              removeExercise({ id: Number(exerciseId) });
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
      ) : !exercises.length &&
        exercisesFilter === ExercisesFilter.myExercises ? (
        <ThemedText style={{ textAlign: "center" }}>
          No hay ejercicios. ¡Agrega uno!
        </ThemedText>
      ) : (
        <>
          {exercisesFilter === ExercisesFilter.myExercises && (
            <FlatList
              showsVerticalScrollIndicator={false}
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

          {exercisesFilter === ExercisesFilter.defaultExercises && (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={Styles.listContent}
              keyExtractor={(_, index) => index.toString()}
              data={filter}
              renderItem={({ item }) => {
                return (
                  <ItemList
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
        </>
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
