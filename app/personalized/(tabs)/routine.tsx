import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { auth } from "@/firebaseConfig";
import { Link, useFocusEffect } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { Touchable } from "@/components/Touchable";
import { ThemedInput } from "@/components/ThemedInput";
import { IconButton } from "@/components/IconButton";
import { Card } from "@/components/Card";
import { Cell, Row, Table, TableWrapper } from "react-native-reanimated-table";
import Checkbox from "expo-checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { WorkoutLog } from "@/types/workoutlog";
import Toast from "react-native-simple-toast";

type WorkoutsCustomer = WorkoutLog & {
  id: string;
};

export default function RoutinesPersonaized() {
  const [bodyStats, setBodyStats] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErros] = useState({ message: "" });
  const { danger, tint, blue, primary } = useColors();
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState({ name: "", roomCode: "" });
  const [workouts, setWorkouts] = useState<WorkoutsCustomer[]>([]);

  const [routineAssingned, setRoutineAssinged] = useState(false);

  const table = {
    tableHead: [
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
        Marcar
      </ThemedText>,
    ],
  };

  const fetchCustomerWorkout = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logsRef = collection(
      firestore,
      "customers",
      auth.currentUser?.uid as string,
      "workoutLogs",
    );

    const q = query(
      logsRef,
      where("plannedDate", ">=", today),
      where("plannedDate", "<", tomorrow),
    );

    const getworkout = await getDocs(q);

    const workouts = getworkout.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (workouts.length) {
      setWorkouts(workouts as WorkoutsCustomer[]);
    }
  };

  const fetchUser = async () => {
    const docRef = doc(firestore, "customers", auth.currentUser?.uid as string);
    const personalized = await getDoc(docRef);

    if (personalized.data()?.roomId) {
      const q = query(
        collection(firestore, "rooms"),
        where("code", "==", personalized.data()?.roomId as string),
      );

      const room = await getDocs(q);
      setRoom({
        name: room.docs[0].data().name,
        roomCode: personalized.data()?.roomId,
      });
      if (personalized.data()?.routineAssingned) {
        setRoutineAssinged(true);
        fetchCustomerWorkout();
      }
    }

    if (!personalized.data()?.bodyStats) {
      setBodyStats(false);
      return;
    } else {
      setBodyStats(true);
    }
  };

  const accessRoom = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(firestore, "rooms"),
        where("code", "==", code),
      );

      const room = await getDocs(q);

      if (!room.docs.length) {
        setLoading(false);
        return setErros({ message: "código no válido" });
      }

      const customerRef = doc(
        firestore,
        "customers",
        auth.currentUser?.uid as string,
      );

      await updateDoc(customerRef, {
        roomId: code,
      });
      setLoading(false);
      setCode("");
      setShowInput(false);
      await fetchUser();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const markCompleted = async ({
    indexBlock,
    indexExercise,
    indexSet,
    completed,
    docId,
  }: {
    docId: string;
    indexBlock: number;
    indexExercise: number;
    indexSet: number;
    completed: boolean;
  }) => {
    const updated = [...workouts];

    const modified = updated.map((item, iBlock) =>
      iBlock === indexBlock
        ? {
            ...item,
            exercises: item.exercises.map((e, iExercise) =>
              iExercise === indexExercise
                ? {
                    ...e,
                    sets: e.sets.map((s, iSet) =>
                      iSet === indexSet ? { ...s, completed } : s,
                    ),
                  }
                : e,
            ),
          }
        : item,
    );
    setWorkouts(modified);
    const workoutToSave = modified.find((w) => w.id === docId);
    const { id, ...dataToSave } = workoutToSave as WorkoutsCustomer;

    const workoutsLogRef = doc(
      firestore,
      "customers",
      auth.currentUser?.uid as string,
      "workoutLogs",
      docId,
    );
    await updateDoc(workoutsLogRef, dataToSave);
  };

  const exitToRoom = () => {
    Alert.alert("Salir de la sala", "¿Está seguro/a de salir de la sala?", [
      {
        onPress: () => {},
        text: "Cancelar",
      },
      {
        onPress: async () => {
          const customerRef = doc(
            firestore,
            "customers",
            auth.currentUser?.uid as string,
          );
          await updateDoc(customerRef, {
            roomId: "",
          });
          setRoom({ roomCode: "", name: "" });
          setWorkouts([]);

          Toast.show("Has salido de la sala", Toast.LONG, {
            backgroundColor: primary,
          });
        },
        text: "Aceptar",
      },
    ]);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setErros({ message: "" });
    }, 5000);
    return () => clearTimeout(id);
  }, [errors]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  return (
    <ThemedView>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={{ flex: 1 }}>
          {Boolean(room.name) ? room.name : "Tu sala"}
        </ThemedText>
        {Boolean(room.name) && (
          <Touchable
            type="danger"
            title="Salir de la sala"
            onPress={() => exitToRoom()}
          />
        )}
      </View>
      {!bodyStats && (
        <Link
          href="/personalized/body-stats"
          style={{
            color: blue,
            alignSelf: "center",
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            borderBottomWidth: 1,
            borderBottomColor: blue,
          }}
        >
          Completa tus datos físicos
        </Link>
      )}

      {Boolean(!room.name) && (
        <Touchable title="Unirse a sala" onPress={() => setShowInput(true)} />
      )}

      {showInput && (
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 12,
            alignItems: "center",
            gap: 15,
          }}
        >
          <ThemedInput
            placeholder="Ingrese el código"
            onChangeText={(code) => setCode(code)}
            style={{ flex: 1 }}
          />
          {Boolean(code.length) && (
            <>
              {loading ? (
                <ActivityIndicator size="small" color={tint} />
              ) : (
                <IconButton name="check" onPress={accessRoom} />
              )}
            </>
          )}
        </View>
      )}
      {Boolean(errors.message) && (
        <ThemedText
          darkColor={danger}
          lightColor={danger}
          style={{ alignSelf: "center" }}
        >
          {errors.message}
        </ThemedText>
      )}
      {routineAssingned && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {workouts?.map((block, indexBlock) => (
            <View key={indexBlock}>
              {/* <Touchable */}
              {/*   title="Ver progreso" */}
              {/*   icon="history" */}
              {/*   type="shadow" */}
              {/*   style={{ alignSelf: "flex-end" }} */}
              {/* /> */}
              <ThemedText>
                Hoy:{" "}
                {format(
                  block.plannedDate?.toDate() ?? new Date(),
                  "eeee d 'de' MMMM",
                  {
                    locale: es,
                  },
                )}
              </ThemedText>
              <ThemedText
                darkColor={tint}
                lightColor={tint}
                type="defaultSemiBold"
                style={{ marginBottom: 12 }}
              >
                {block.blockName}
              </ThemedText>
              <Table>
                {block.exercises.map((item, indexExercise) => (
                  <Card key={indexExercise} style={{ marginBottom: 20 }}>
                    <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                    <Row
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: primary,
                      }}
                      data={table.tableHead}
                    />
                    {item.sets.map((item, indexSet) => (
                      <TableWrapper
                        key={indexSet}
                        style={{
                          flexDirection: "row",
                          borderBottomWidth: 1,
                          paddingVertical: 8,
                          borderBottomColor: primary,
                        }}
                      >
                        <Cell
                          data={
                            <ThemedText style={{ textAlign: "center" }}>
                              {item.weight}
                            </ThemedText>
                          }
                        />
                        <Cell
                          data={
                            <ThemedText style={{ textAlign: "center" }}>
                              {item.reps}
                            </ThemedText>
                          }
                        />
                        <Cell
                          data={
                            <ThemedText style={{ textAlign: "center" }}>
                              {item.rir}
                            </ThemedText>
                          }
                        />
                        <Cell
                          data={
                            <Checkbox
                              style={{ alignSelf: "center" }}
                              color={primary}
                              value={item.completed}
                              onValueChange={(v) =>
                                markCompleted({
                                  indexBlock,
                                  indexExercise,
                                  indexSet,
                                  completed: v,
                                  docId: block.id,
                                })
                              }
                            />
                          }
                        />
                      </TableWrapper>
                    ))}
                  </Card>
                ))}
              </Table>
            </View>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    marginHorizontal: 12,
  },
});
