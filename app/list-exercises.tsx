import { ItemList } from "@/components/ItemList";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { FlatList, View, StyleSheet, Alert } from "react-native";
import { IconButton } from "@/components/IconButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { Touchable } from "@/components/Touchable";
import { NavigationHeader } from "@/components/NavigationHeader";
import { isValidName } from "@/helpers/inputValidation";
import { Modal } from "@/components/Modal";
import { useLocalSearchParams } from "expo-router";
import { Skeleton } from "@/components/Skeleton";
import { useColors } from "@/hooks/useColors";
import { useExercisesVM } from "@features/workouts/ui/ViewModel/useExercisesVM";

enum ExercisesFilter {
  myExercises,
  defaultExercises,
}

export default function ModalAddExercices() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();

  const {
    exercises,
    defaultExercises,
    isLoading,
    isDefaultLoading,
    removeExercise,
    addExercise,
    updateExercise,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    isExerciseSelected,
  } = useExercisesVM(workoutId);
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

    const success = await addExercise(exerciseName);
    if (!success) return;

    setVisible(false);
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

    const success = await updateExercise(exerciseName, exerciseId);
    if (!success) return;

    setVisible(false);
    setIsEdit(false);
  };

  const selectExercise = ({ exerciseId }: { exerciseId: number }) => {
    if (!isExerciseSelected(exerciseId)) {
      addExerciseToWorkout(exerciseId);
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
          onPress: () => removeExerciseFromWorkout(exerciseId),
        },
      ],
    );
  };

  const source =
    exercisesFilter === ExercisesFilter.defaultExercises
      ? defaultExercises
      : exercises;

  const filter = source.filter((exercise) =>
    exercise.name?.toLocaleUpperCase().includes(search.toUpperCase()),
  );

  const isListLoading =
    exercisesFilter === ExercisesFilter.defaultExercises
      ? isDefaultLoading
      : isLoading;

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
              removeExercise(Number(exerciseId));
              setVisible(false);
              setExerciseName("");
              setExerciseId(0);
            }}
          />
        )}
      </Modal>
      {isListLoading ? (
        <View style={{ marginHorizontal: 12, gap: 12 }}>
          <Skeleton isLoading={isListLoading}>
            <ItemList value="" />
          </Skeleton>
          <Skeleton isLoading={isListLoading}>
            <ItemList value="" />
          </Skeleton>
          <Skeleton isLoading={isListLoading}>
            <ItemList value="" />
          </Skeleton>
        </View>
      ) : !filter.length ? (
        <ThemedText style={{ textAlign: "center" }}>
          {exercisesFilter === ExercisesFilter.myExercises
            ? "No hay ejercicios. ¡Agrega uno!"
            : "No hay ejercicios disponibles"}
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
                      isExerciseSelected(item.id) && {
                        backgroundColor: tint,
                      }
                    }
                    textStyle={
                      isExerciseSelected(item.id) && { color: bg }
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
                      isExerciseSelected(item.id) && {
                        backgroundColor: tint,
                      }
                    }
                    textStyle={
                      isExerciseSelected(item.id) && { color: bg }
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
