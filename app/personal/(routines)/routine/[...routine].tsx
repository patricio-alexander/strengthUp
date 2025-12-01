import { ItemList } from "@/components/ItemList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { days, daysExcercises } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NavigationHeader } from "@/components/NavigationHeader";
type Day = {
  id: number;
  name: string;
  exercisesInDay: number;
};

import DraggableFlatList from "react-native-draggable-flatlist";
import { IconButton } from "@/components/IconButton";
import { useColorScheme, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

const useRoutineDays = (routineId: number) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const [listDays, setListDays] = useState<Day[]>([]);
  const loadDays = async () => {
    const routineDays = await drizzleDb
      .select({
        id: days.id,
        name: days.name,
        exercisesInDay: sql<number>`cast(count(${daysExcercises.id}) as int)`,
      })
      .from(days)
      .leftJoin(daysExcercises, eq(days.id, daysExcercises.dayId))

      .where(eq(days.routineId, routineId))
      .orderBy(days.sorted)
      .groupBy(days.id);

    setListDays(routineDays);
  };

  const sort = async (data: Day[]) => {
    setListDays(data);
    await Promise.all(
      data.map((item, index) =>
        drizzleDb
          .update(days)
          .set({ sorted: index })
          .where(eq(days.id, item.id)),
      ),
    );
  };

  useEffect(() => {
    loadDays();
  }, [routineId]);

  return { listDays, loadDays, sort };
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
  const { listDays, loadDays, sort } = useRoutineDays(Number(routineId));

  useFocusEffect(
    useCallback(() => {
      loadDays();
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

      <DraggableFlatList
        onDragEnd={({ data }) => sort(data)}
        keyExtractor={(item) => item.id.toString()}
        extraData={listDays}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        data={listDays}
        style={{ marginHorizontal: 12 }}
        renderItem={({ item, drag }) => (
          <Link
            href={`/personal/day/${item.name}/${item.id}`}
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
                      pathname: "/personal/new-day",
                      params: {
                        routineId,
                        value: item.name,
                        dayId: item.id,
                      },
                    });
                  }}
                />
              )}
            />
          </Link>
        )}
      />
      <Link
        href={{
          pathname: "/personal/new-day",
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
