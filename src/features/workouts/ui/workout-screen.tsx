import { ThemedView } from "@/components/ThemedView";
import { Link, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ItemList } from "@/components/ItemList";
import { NavigationHeader } from "@/components/NavigationHeader";
import DraggableFlatList from "react-native-draggable-flatlist";
import { IconButton } from "@/components/IconButton";
import { Skeleton } from "@/components/Skeleton";
import { View } from "react-native";
import { useExercisesVM } from "@features/workouts/ui/ViewModel/useExercisesVM";

export default function WorkoutScreen() {
  const { workout } = useLocalSearchParams();
  const [workoutName, workoutId] = workout;

  const {
    selectedExercises,
    isSelectedLoading: isLoading,
    orderSelectedExercises,
  } = useExercisesVM(workoutId);

  return (
    <ThemedView>
      <NavigationHeader title={workoutName} />
      <ThemedText
        style={{ marginBottom: 12, marginHorizontal: 12 }}
        type="defaultSemiBold"
      >
        Ejercicios
      </ThemedText>

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
      ) : (
        <DraggableFlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          onDragEnd={({ data }) => orderSelectedExercises(data)}
          keyExtractor={(item) => item.id.toString()}
          data={selectedExercises}
          renderItem={({ item, drag }) => (
            <Link
              href={`/personal/exercise/${item.name}/${item.workoutSessionExerciseId}`}
              asChild
              style={{ marginBottom: 12, marginHorizontal: 12 }}
            >
              <ItemList value={item.name} onTouchMove={drag} />
            </Link>
          )}
        />
      )}

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
