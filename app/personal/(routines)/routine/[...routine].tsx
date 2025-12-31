import { ItemList } from "@/components/ItemList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
type WorkoutSessions = {
  id: string;
  name: string;
  exercisesInDay: number;
};

import DraggableFlatList from "react-native-draggable-flatlist";
import { IconButton } from "@/components/IconButton";
import { useColorScheme, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/Skeleton";

const useRoutineDays = (routineId: string) => {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSessions[]>([]);
  const [isLoading, setLoading] = useState(true);
  const loadWorkoutSessions = async () => {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(`id, name, workout_sessions_exercises(count) `)
      .eq("routine_id", routineId);

    const workouts = data?.map((w) => ({
      id: w.id,
      name: w.name,
      exercisesInDay: w.workout_sessions_exercises[0].count,
    }));
    setWorkoutSessions(workouts ?? []);
    setLoading(false);
  };

  const sort = async (data: WorkoutSessions[]) => {
    await Promise.all(
      data.map((w, index) =>
        supabase
          .from("workout_sessions")
          .update({ sorted: index })
          .eq("id", w.id),
      ),
    );
  };

  useEffect(() => {
    loadWorkoutSessions();
  }, [routineId]);

  return { workoutSessions, loadWorkoutSessions, sort, isLoading };
};

const useExercisesInDay = (total: number) => {
  if (total === 0) {
    return "No tiene ejercicios";
  }

  if (total === 1) {
    return "1 ejercicio";
  }

  return `${total} ejercicios`;
};

export default function RoutineScreen() {
  const { routine } = useLocalSearchParams();
  const router = useRouter();

  const [routineName, routineId] = routine;
  const colorScheme = useColorScheme() ?? "light";
  const { tertiary } = Colors[colorScheme];
  const { workoutSessions, loadWorkoutSessions, sort, isLoading } =
    useRoutineDays(routineId);

  useFocusEffect(
    useCallback(() => {
      loadWorkoutSessions();
    }, []),
  );

  return (
    <ThemedView>
      <NavigationHeader title={routineName} />
      <ThemedText
        style={{ marginHorizontal: 12, marginBottom: 12 }}
        type="defaultSemiBold"
      >
        Bloques
      </ThemedText>
      {isLoading ? (
        <View style={{ marginHorizontal: 12, gap: 12 }}>
          <Skeleton isLoading={isLoading}>
            <ItemList
              value={() => {
                return (
                  <View>
                    <ThemedText />
                    <ThemedText />
                  </View>
                );
              }}
            />
          </Skeleton>
          <Skeleton isLoading={isLoading}>
            <ItemList
              value={() => {
                return (
                  <View>
                    <ThemedText />
                    <ThemedText />
                  </View>
                );
              }}
            />
          </Skeleton>
        </View>
      ) : (
        <DraggableFlatList
          onDragEnd={({ data }) => sort(data)}
          keyExtractor={(item) => item.id.toString()}
          extraData={workoutSessions}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
          data={workoutSessions}
          style={{ marginHorizontal: 12 }}
          renderItem={({ item, drag }) => (
            <Link
              href={`/personal/workout/${item.name}/${item.id}`}
              asChild
              style={[{ marginBottom: 12 }]}
            >
              <ItemList
                value={() => (
                  <View>
                    <ThemedText>{item.name}</ThemedText>
                    <ThemedText style={{ color: tertiary }}>
                      {useExercisesInDay(item.exercisesInDay)}
                    </ThemedText>
                  </View>
                )}
                onTouchMove={drag}
                right={() => (
                  <IconButton
                    name="kebab-horizontal"
                    size={26}
                    onPress={() => {
                      router.navigate({
                        pathname: "/personal/new-workout-session",
                        params: {
                          routineId,
                          workoutSessionId: item.id,
                          value: item.name,
                        },
                      });
                    }}
                  />
                )}
              />
            </Link>
          )}
        />
      )}
      <Link
        href={{
          pathname: "/personal/new-workout-session",
          params: {
            routineId,
          },
        }}
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "flex-end",
          right: 20,
        }}
        asChild
      >
        <IconButton name="plus" type="contained" size={28} />
      </Link>
    </ThemedView>
  );
}
