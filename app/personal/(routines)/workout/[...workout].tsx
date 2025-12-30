import { ThemedView } from "@/components/ThemedView";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ItemList } from "@/components/ItemList";
import { NavigationHeader } from "@/components/NavigationHeader";
import DraggableFlatList from "react-native-draggable-flatlist";
import { IconButton } from "@/components/IconButton";
import { useSelectedExercises } from "@/hooks/useSelectedExercises";
import { SelectedExercises } from "@/types/selectedExercises";
import { supabase } from "@/lib/supabase";

export default function DayScreen() {
  const { workout } = useLocalSearchParams();
  const [workoutName, workoutId] = workout;

  const { selectedExercises, fetchSelectedExercises } =
    useSelectedExercises(workoutId);

  const sort = async (data: SelectedExercises[]) => {
    await Promise.all(
      data.map((item, index) =>
        supabase
          .from("workout_sessions_exercises")
          .update({ sorted: index })
          .eq("id", item.workoutSesssionExerciseId),
      ),
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchSelectedExercises();
    }, []),
  );

  return (
    <ThemedView>
      <NavigationHeader title={workoutName} />
      <ThemedText
        style={{ marginBottom: 12, marginHorizontal: 12 }}
        type="defaultSemiBold"
      >
        Ejercicios
      </ThemedText>
      <DraggableFlatList
        contentContainerStyle={{ paddingBottom: 200 }}
        onDragEnd={({ data }) => sort(data)}
        keyExtractor={(item) => item.id.toString()}
        data={selectedExercises}
        renderItem={({ item, drag }) => (
          <Link
            href={`/personal/exercise/${item.name}/${item.workoutSesssionExerciseId}`}
            asChild
            style={{ marginBottom: 12, marginHorizontal: 12 }}
          >
            <ItemList value={item.name} onTouchMove={drag} />
          </Link>
        )}
      />
      <Link
        href={{
          pathname: "/list-exercises",
          params: {
            workoutId,
          },
        }}
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
