import { ItemList } from "@/components/ItemList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { NavigationHeader } from "@/components/NavigationHeader";

import DraggableFlatList from "react-native-draggable-flatlist";
import { IconButton } from "@/components/IconButton";
import { View } from "react-native";
import { Skeleton } from "@/components/Skeleton";
import { useBlockVM } from "./ViewModel/useBlockVM";
import { useColors } from "@/hooks/useColors";

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
  const { tertiary } = useColors();
  const { blocks, isLoading, error, order } = useBlockVM({
    workoutId: Number(routineId),
  });

  return (
    <ThemedView>
      <NavigationHeader title={routineName} />
      <ThemedText
        style={{ marginHorizontal: 12, marginBottom: 12 }}
        type="defaultSemiBold"
      >
        Bloques
      </ThemedText>
      {error && (
        <ThemedText
          type="error"
          style={{ marginHorizontal: 12, marginBottom: 12 }}
        >
          {error}
        </ThemedText>
      )}
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
          onDragEnd={({ data }) => order(data)}
          keyExtractor={(item) => item.id.toString()}
          extraData={blocks}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
          data={blocks}
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
                      {useExercisesInDay(item.totalExercises ?? 0)}
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
