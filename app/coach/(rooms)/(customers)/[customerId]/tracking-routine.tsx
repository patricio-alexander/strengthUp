import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { firestore } from "@/firebaseConfig";
import { Link, useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Block, ExercisesBlock } from "@/types/routine";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { ItemList } from "@/components/ItemList";
import { Touchable } from "@/components/Touchable";
import { ThemedText } from "@/components/ThemedText";
import { Card, CardTitle } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal } from "@/components/Modal";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { SegmentedButtons } from "@/components/SegmentedButtons";

type Filters = "today" | "week" | "month" | "custom" | "all";

type SegmentFilterDateButton = {
  label: string;
  value: Filters;
};

type WorkoutLog = {
  id: string;
  customerId: string;
  blockName: string;
  exercises: ExercisesBlock[];
  plannedDate?: Timestamp;
};

export default function TrackingRoutineScreen() {
  const { customerId } = useLocalSearchParams();
  const [blocks, setBlocks] = useState<
    { name: string; exercises: ExercisesBlock[] }[]
  >([]);
  const [visible, setVisible] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const { tint, green, danger } = useColors();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIdBlock, setSelectedIdBlock] = useState("");
  const [fetchingWorkouts, setFechingWorkouts] = useState(true);
  const [filter, setFilter] = useState<Filters>("today");
  const BUTTONS: SegmentFilterDateButton[] = [
    { label: "Hoy", value: "today" },
    { label: "Esta semana", value: "week" },
    { label: "Este mes", value: "month" },
    { label: "Todo", value: "all" },
  ];

  const fetchRoutine = async () => {
    const ref = doc(
      firestore,
      "customers",
      customerId as string,
      "routine",
      customerId as string,
    );
    const document = await getDoc(ref);

    const b = document.data()?.routine.blocks;
    const onlyBlockNames = b.length
      ? b.map((b: Block) => ({
          name: b.name,
          exercises: b.exercises.map((e) => ({ name: e.name, sets: [] })),
        }))
      : [];
    setBlocks(onlyBlockNames);
  };

  const fetchAllWorkouts = async () => {
    const workoutsFromFirestore = await getDocs(
      collection(firestore, "customers", customerId as string, "workoutLogs"),
    );
    const mapped = workoutsFromFirestore.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id as string,
    }));

    setWorkouts(mapped as WorkoutLog[]);
    setFechingWorkouts(false);
  };

  const fetchFilteredWorkouts = async (startDate: Date, endDate: Date) => {
    const workoutsRef = collection(
      firestore,
      "customers",
      customerId as string,
      "workoutLogs",
    );
    const q = query(
      workoutsRef,
      where("plannedDate", ">=", startDate),
      where("plannedDate", "<=", endDate),
    );
    const workoutsFromFirestore = await getDocs(q);

    const mapped = workoutsFromFirestore.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id as string,
    }));

    setWorkouts(mapped as WorkoutLog[]);
    setFechingWorkouts(false);
  };

  const addWorkout = async ({
    block,
    exercises,
  }: {
    block: string;
    exercises: ExercisesBlock[];
  }) => {
    setLoading(true);
    const data = {
      customerId: customerId as string,
      blockName: block,
      exercises,
    };

    const workout = await addDoc(
      collection(firestore, "customers", customerId as string, "workoutLogs"),
      data,
    );
    data.id = workout.id;

    const updated = [...workouts];
    updated.push(data as WorkoutLog);
    setWorkouts(updated);
    setLoading(false);
  };

  const addPlannedData = async ({
    plannedDate,
  }: {
    plannedDate: Timestamp;
  }) => {
    setLoading(true);
    const updated = workouts.map((w) =>
      w.id === selectedIdBlock ? { ...w, plannedDate } : w,
    );
    setWorkouts(updated);

    await updateDoc(
      doc(
        firestore,
        "customers",
        customerId as string,
        "workoutLogs",
        selectedIdBlock,
      ),
      {
        plannedDate,
      },
    );

    setLoading(false);
  };

  const removeBlock = async ({ idBlock }: { idBlock: string }) => {
    setLoading(true);
    setWorkouts((prev) => prev.filter((w) => w.id !== idBlock));
    await deleteDoc(
      doc(firestore, "customers", customerId as string, "workoutLogs", idBlock),
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchRoutine();
    //fetchWorkouts();
  }, [customerId]);

  useEffect(() => {
    if (filter === "today") {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());
      fetchFilteredWorkouts(todayStart, todayEnd);
    }
    if (filter === "week") {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      fetchFilteredWorkouts(weekStart, weekEnd);
    }
    if (filter === "month") {
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());
      fetchFilteredWorkouts(monthStart, monthEnd);
    }
    if (filter === "all") {
      fetchAllWorkouts();
    }
  }, [filter]);

  return (
    <ThemedView>
      <NavigationHeader
        title="Seguimiento"
        headerRight={() =>
          loading && <ActivityIndicator color={tint} size="small" />
        }
      />
      <Touchable
        title="Selecionar bloque"
        onPress={() => setVisible(!visible)}
        style={{ marginBottom: 12 }}
      />
      <SegmentedButtons
        value={filter}
        buttons={BUTTONS}
        onValueChange={(v) => setFilter(v as Filters)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            addPlannedData({ plannedDate: Timestamp.fromDate(selectedDate) });
          }}
        />
      )}

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(!visible)}
        statusBarTranslucent={true}
      >
        <ThemedText type="defaultSemiBold">Bloques disponibles</ThemedText>
        {Boolean(!blocks.length) ? (
          <ThemedText style={{ textAlign: "center", marginVertical: 20 }}>
            No existen bloques disponibles
          </ThemedText>
        ) : (
          <FlatList
            data={blocks}
            style={{ marginVertical: 12 }}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <ItemList
                value={item.name}
                onPress={() => {
                  setVisible(!visible);
                  addWorkout({
                    block: item.name,
                    exercises: item.exercises,
                  });
                }}
              />
            )}
          />
        )}
        <Touchable
          type="shadow"
          onPress={() => setVisible(!visible)}
          title="Cerrar"
          style={{ alignSelf: "flex-end" }}
        />
      </Modal>
      {fetchingWorkouts ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <ActivityIndicator size="large" color={tint} />
        </View>
      ) : !workouts.length ? (
        <ThemedText style={{ textAlign: "center" }}>
          Aún no has agregado bloques
        </ThemedText>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={workouts}
          style={{ marginHorizontal: 12 }}
          contentContainerStyle={{ gap: 12, paddingBottom: 150 }}
          renderItem={({ item }) => {
            const exercises = item.exercises;
            const allCompleted = exercises.length
              ? exercises.every((e) => {
                  if (e.sets?.length) {
                    return e?.sets?.every((s) => s?.completed);
                  }
                  return e.sets?.length;
                })
              : exercises.length;

            const date = item.plannedDate?.toDate?.();
            const formatedDate = date
              ? `Programado para ${format(date, "EEEE dd 'de' MMMM yyyy", { locale: es })}`
              : "Entrenamiento sin fecha asignada";

            return (
              <Card>
                <View
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <CardTitle>{item.blockName}</CardTitle>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      darkColor={tint}
                      lightColor={tint}
                      style={{ flex: 1 }}
                    >
                      {formatedDate}
                    </ThemedText>
                    <IconButton
                      type="contained"
                      name="calendar"
                      size={22}
                      onPress={() => {
                        setShowDatePicker(true);
                        setSelectedIdBlock(item.id);
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <ThemedText type="defaultSemiBold">
                      Estado del bloque:
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      darkColor={allCompleted ? green : danger}
                      lightColor={allCompleted ? green : danger}
                    >
                      {allCompleted ? "Completado" : "Sin terminar"}
                    </ThemedText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Link
                    href={{
                      pathname:
                        "/coach/[customerId]/workout-details/[workoutId]",
                      params: {
                        customerId: customerId as string,
                        workoutId: item.id,
                      },
                    }}
                    asChild
                  >
                    <Touchable title="Ver ejercicios" />
                  </Link>
                  <IconButton
                    name="trash"
                    type="contained"
                    onPress={() => removeBlock({ idBlock: item.id })}
                  />
                </View>
              </Card>
            );
          }}
        />
      )}
    </ThemedView>
  );
}
