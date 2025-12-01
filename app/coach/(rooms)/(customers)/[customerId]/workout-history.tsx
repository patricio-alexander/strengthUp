import { ItemList } from "@/components/ItemList";
import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { firestore } from "@/firebaseConfig";
import { useColors } from "@/hooks/useColors";
import { WorkoutLog } from "@/types/workoutlog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link, useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

type WorkoutsCustomer = WorkoutLog & {
  id: string;
};

export default function WorkoutHistoryScreen() {
  const { customerId } = useLocalSearchParams();
  const [workouts, setWorkouts] = useState<WorkoutsCustomer[]>([]);
  const { green, danger } = useColors();

  const fetchWorkouts = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ref = collection(
      firestore,
      "customers",
      customerId as string,
      "workoutLogs",
    );
    const q = query(ref, where("plannedDate", "<", today));
    const snapshotWorkouts = await getDocs(q);
    const works = snapshotWorkouts.docs.map((d) => ({ id: d.id, ...d.data() }));
    setWorkouts(works as WorkoutsCustomer[]);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <ThemedView>
      <NavigationHeader title="Desempeño" />
      <FlatList
        data={workouts}
        style={{ marginHorizontal: 12 }}
        renderItem={({ item }) => (
          <Link
            asChild
            href={{
              pathname: "/coach/[customerId]/workout-details/[workoutId]",
              params: {
                customerId: customerId as string,
                workoutId: item.id as string,
              },
            }}
          >
            <ItemList
              value={() => {
                const plannedDate = format(
                  item.plannedDate?.toDate() ?? new Date(),
                  "eeee d 'de' MMMM",
                  { locale: es },
                );
                return (
                  <View>
                    <ThemedText>{item.blockName}</ThemedText>
                    <ThemedText>{plannedDate}</ThemedText>
                  </View>
                );
              }}
              right={() => {
                const allCompleted = item.exercises.every((e) =>
                  e.sets.every((s) => s.completed),
                );

                return (
                  <ThemedText
                    type="defaultSemiBold"
                    darkColor={allCompleted ? green : danger}
                    lightColor={allCompleted ? green : danger}
                  >
                    {allCompleted ? "Completado" : "Sin terminar"}
                  </ThemedText>
                );
              }}
            />
          </Link>
        )}
      />
    </ThemedView>
  );
}
