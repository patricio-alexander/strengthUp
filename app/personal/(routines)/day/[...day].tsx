import { ThemedView } from "@/components/ThemedView";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ItemList } from "@/components/ItemList";
import { SelectedExercise, useRoutineStore } from "@/store/routineStore";
import { daysExcercises } from "@/db/schema";
import { NavigationHeader } from "@/components/NavigationHeader";
import DraggableFlatList from "react-native-draggable-flatlist";
import { eq } from "drizzle-orm";
import { IconButton } from "@/components/IconButton";
import { useDrizzleDB } from "@/hooks/useDrizzleDB";

export default function DayScreen() {
  const { day } = useLocalSearchParams();
  const drizzleDb = useDrizzleDB();
  const [dayName, dayId] = day;

  const { loadSelectedExercises, selectedExercises, setSelectedExercises } =
    useRoutineStore();

  const sorterInDb = async (data: SelectedExercise[]) => {
    setSelectedExercises({ data });

    await Promise.all(
      data.map((item, index) =>
        drizzleDb
          .update(daysExcercises)
          .set({ sorted: index })
          .where(eq(daysExcercises.id, item.dayExerciseId)),
      ),
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadSelectedExercises({ dayId: Number(dayId) });
    }, []),
  );

  return (
    <ThemedView>
      <NavigationHeader title={dayName} />
      <ThemedText
        style={{ marginBottom: 12, marginHorizontal: 12 }}
        type="defaultSemiBold"
      >
        Ejercicios
      </ThemedText>
      <DraggableFlatList
        contentContainerStyle={{ paddingBottom: 200 }}
        onDragEnd={({ data }) => sorterInDb(data)}
        keyExtractor={(item) => item.id.toString()}
        data={selectedExercises}
        renderItem={({ item, drag }) => (
          <Link
            href={`/personal/exercise/${item.name}/${item.dayExerciseId}/${item.gifId ?? ""}`}
            asChild
            style={{ marginBottom: 12, marginHorizontal: 12 }}
          >
            <ItemList value={item.name} onTouchMove={drag} />
          </Link>
        )}
      />
      <Link
        href={{pathname: '/list-exercises', params: {
          dayId
        }}}
        asChild
        style={{
          position: "absolute",
          alignSelf: "flex-end",
          bottom: 20,
          right: 20,
        }}
      >
        <IconButton size={28} name="plus" type="contained" />
      </Link>
    </ThemedView>
  );
}
