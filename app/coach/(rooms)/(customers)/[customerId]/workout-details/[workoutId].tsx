import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { ActivityIndicator, View } from "react-native";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useColors } from "@/hooks/useColors";
import { Sets } from "@/types/routine";
import { Table, Row, TableWrapper, Cell } from "react-native-reanimated-table";
import { ThemedInput } from "@/components/ThemedInput";
import { Touchable } from "@/components/Touchable";
import { IconButton } from "@/components/IconButton";
import Checkbox from "expo-checkbox";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { WorkoutLog } from "@/types/workoutlog";

export default function WorkoutDetailsScreen() {
  const { customerId, workoutId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const { tint, blue, primary } = useColors();
  const [workout, setWorkout] = useState<WorkoutLog>({
    customerId: "",
    blockName: "",
    exercises: [],
    plannedDate: Timestamp.fromDate(new Date()),
  });

  const onEndEditInput = async ({
    name,
    text,
    indexExercise,
    indexSet,
  }: {
    name: keyof Sets;
    text: string;
    indexExercise: number;
    indexSet: number;
  }) => {
    setLoading(true);
    const updated = { ...workout };
    if (name === "weight") {
      updated.exercises[indexExercise].sets[indexSet].weight = text;
    }
    if (name === "reps") {
      updated.exercises[indexExercise].sets[indexSet].reps = text;
    }
    if (name === "rir") {
      updated.exercises[indexExercise].sets[indexSet].rir = text;
    }
    await updateDoc(
      doc(
        firestore,
        "customers",
        customerId as string,
        "workoutLogs",
        workoutId as string,
      ),
      updated,
    );
    setLoading(false);
  };

  const addSetToExercise = async ({
    indexExercise,
  }: {
    indexExercise: number;
  }) => {
    setLoading(true);
    const updated = { ...workout };
    workout.exercises[indexExercise].sets.push({
      weight: "0",
      reps: "0",
      rir: "0",
      completed: false,
    });
    setWorkout(updated);
    await updateDoc(
      doc(
        firestore,
        "customers",
        customerId as string,
        "workoutLogs",
        workoutId as string,
      ),
      updated,
    );
    setLoading(false);
  };

  const removeSetToExercise = async ({
    indexExercise,
    indexSet,
  }: {
    indexExercise: number;
    indexSet: number;
  }) => {
    setLoading(true);
    const updated = { ...workout };

    updated.exercises[indexExercise].sets = updated.exercises[
      indexExercise
    ].sets.filter((_, i) => i !== indexSet);
    setWorkout(updated);
    await updateDoc(
      doc(
        firestore,
        "customers",
        customerId as string,
        "workoutLogs",
        workoutId as string,
      ),
      updated,
    );
    setLoading(false);
  };

  const table = {
    tableHead: [
      "",
      <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
        Carga (kg)
      </ThemedText>,
      <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
        Reps
      </ThemedText>,
      <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
        rir
      </ThemedText>,
      <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
        Hecho
      </ThemedText>,
    ],
  };

  const fetchWorkoutLog = async () => {
    const document = await getDoc(
      doc(
        firestore,
        "customers",
        customerId as string,
        "workoutLogs",
        workoutId as string,
      ),
    );

    setWorkout(document.data() as WorkoutLog);
  };

  useEffect(() => {
    fetchWorkoutLog();
  }, [workoutId]);

  return (
    <ThemedView>
      <NavigationHeader
        title="Detalles del entrenamiento"
        headerRight={() =>
          loading && <ActivityIndicator size="small" color={tint} />
        }
      />
      <View style={{ marginHorizontal: 12 }}>
        <ThemedText darkColor={tint} lightColor={tint}>
          {workout.plannedDate?.toDate?.()
            ? `Programado para ${format(workout.plannedDate.toDate(), "EEEE dd 'de' MMMM yyyy", { locale: es })}`
            : "Fecha no programada"}
        </ThemedText>
        <ThemedText type="defaultSemiBold">{workout.blockName}</ThemedText>
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: 200, gap: 12 }}
        >
          {workout.exercises.map((item, indexExercise) => (
            <View key={indexExercise}>
              <ThemedText>{item.name}</ThemedText>
              <Table>
                <Row data={table.tableHead} style={{ marginBottom: 12 }} />
                {item.sets.map((s, indexSet) => (
                  <TableWrapper
                    key={indexSet}
                    style={{ flexDirection: "row", marginBottom: 12 }}
                  >
                    <Cell
                      data={
                        <IconButton
                          name="x"
                          style={{ alignSelf: "center" }}
                          onPress={() =>
                            removeSetToExercise({ indexExercise, indexSet })
                          }
                        />
                      }
                    />
                    <Cell
                      data={
                        <ThemedInput
                          style={{
                            textAlign: "center",
                            height: 35,
                            width: 60,
                            alignSelf: "center",
                          }}
                          keyboardType="decimal-pad"
                          value={s.weight}
                          onEndEditing={(e) =>
                            onEndEditInput({
                              indexExercise,
                              indexSet,
                              name: "weight",
                              text: e.nativeEvent.text,
                            })
                          }
                          onChangeText={(weight) => {
                            setWorkout((prev) => {
                              const updated = { ...prev };
                              updated.exercises[indexExercise].sets[
                                indexSet
                              ].weight = weight;
                              return updated;
                            });
                          }}
                        />
                      }
                    />
                    <Cell
                      data={
                        <ThemedInput
                          style={{
                            alignSelf: "center",
                            textAlign: "center",
                            height: 35,
                            width: 60,
                          }}
                          keyboardType="decimal-pad"
                          value={s.reps}
                          onEndEditing={(e) =>
                            onEndEditInput({
                              indexExercise,
                              indexSet,
                              name: "reps",
                              text: e.nativeEvent.text,
                            })
                          }
                          onChangeText={(reps) => {
                            setWorkout((prev) => {
                              const updated = { ...prev };
                              updated.exercises[indexExercise].sets[
                                indexSet
                              ].reps = reps;
                              return updated;
                            });
                          }}
                        />
                      }
                    />
                    <Cell
                      data={
                        <ThemedInput
                          value={s.rir}
                          keyboardType="decimal-pad"
                          style={{
                            textAlign: "center",
                            height: 35,
                            width: 60,
                            alignSelf: "center",
                          }}
                          onEndEditing={(e) =>
                            onEndEditInput({
                              indexExercise,
                              indexSet,
                              name: "rir",
                              text: e.nativeEvent.text,
                            })
                          }
                          onChangeText={(rir) => {
                            setWorkout((prev) => {
                              const updated = { ...prev };
                              updated.exercises[indexExercise].sets[
                                indexSet
                              ].rir = rir;
                              return updated;
                            });
                          }}
                        />
                      }
                    />

                    <Cell
                      data={
                        <Checkbox
                          style={{ alignSelf: "center" }}
                          value={s.completed}
                          color={s.completed ? blue : primary}
                        />
                      }
                    />
                  </TableWrapper>
                ))}
                <Touchable
                  title="Añadir serie"
                  style={{ marginTop: 10 }}
                  icon="plus"
                  onPress={() => addSetToExercise({ indexExercise })}
                />
              </Table>
            </View>
          ))}
        </KeyboardAwareScrollView>
      </View>
    </ThemedView>
  );
}
