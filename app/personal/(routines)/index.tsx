import { Card, CardTitle } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUserStore } from "@/store/userStore";
import { View, StyleSheet, ScrollView, Alert, Text } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Link } from "expo-router";
import { LevelProgressBar } from "@/components/LevelProgressBar";
import { IconButton } from "@/components/IconButton";
import { Modal } from "@/components/Modal";
import { Touchable } from "@/components/Touchable";
import { LineChart } from "react-native-gifted-charts";
import { useColors } from "@/hooks/useColors";
import { ItemList } from "@/components/ItemList";
import { ThemedInput } from "@/components/ThemedInput";
import { isValidName } from "@/helpers/inputValidation";
import { FilterBar } from "@/components/FilterBar";
import { useChartData } from "@/hooks/useChartData";
import { usePerformanceIndex } from "@/hooks/usePerformanceIndex";
import { useFilters } from "@/hooks/useFilters";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";
import { Set } from "@/types/set";
import { setsGroupByDay } from "@/utils/sets";
import { GroupSetsByDate } from "@/types/groupByDay";
import { Octicons } from "@expo/vector-icons";
import { Skeleton } from "@/components/Skeleton";

const useGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

const useWorkoutToTrain = (day: string, routineId: number | undefined) => {
  const [block, setBlock] = useState({ id: 0, name: "" });
  const [exist, setExist] = useState(false);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(true);
  const getBlock = async () => {
    const { data } = await supabase
      .from("workout_sessions")
      .select("id, name")
      .eq("routine_id", routineId)
      .eq("day", day)
      .single();

    if (!data) {
      setIsLoadingWorkout(false);
      return setExist(false);
    }
    const { name, id } = data;
    setBlock({ name, id });
    setExist(true);
    setIsLoadingWorkout(false);
  };

  useEffect(() => {
    if (routineId) {
      getBlock();
    }
  }, [day, routineId]);

  return { block, getBlock, exist, isLoadingWorkout };
};

const useDaysInRoutine = (days: number | undefined) => {
  if (days === 0) {
    return "0 días de entrenamiento";
  }
  if (days === 1) {
    return "1 día de entrenamiento";
  }
  return `${days} días de entrenamiento`;
};

type Routine = {
  id: string;
  name: string | null;
  user_id: string;
  countWorkoutSessions: number;
};

const useRoutines = (userId: string | undefined) => {
  const [routine, setRoutine] = useState<Routine | null>(null);

  const getRoutines = async () => {
    const { data } = await supabase
      .from("routines")
      .select(
        `
          id,
          user_id,
          name,
          workout_sessions(count)
        `,
      )
      .eq("user_id", userId)
      .single();
    setRoutine({
      id: data?.id,
      name: data?.name,
      user_id: data?.user_id,
      countWorkoutSessions: data?.workout_sessions[0].count ?? 0,
    });
  };

  useFocusEffect(
    useCallback(() => {
      getRoutines();
    }, [userId]),
  );

  return { routine, getRoutines };
};

const useWorkoutSetsData = (userId: string | undefined) => {
  const [workoutSets, setWorkoutSets] = useState<GroupSetsByDate[]>([]);

  const fetchWorkoutSets = async () => {
    const { data } = await supabase
      .from("exercise_sets")
      .select(
        `
          id,
          reps,
          weight,
          performed_at,
          workout_sessions_exercises(
            workout_sessions(
              routines(
              )
            )
          )
        `,
      )

      .eq(
        "workout_sessions_exercises.workout_sessions.routines.user_id",
        userId,
      );

    const d = setsGroupByDay(data as Set[]);

    setWorkoutSets(d);
  };

  useEffect(() => {
    fetchWorkoutSets();
  }, []);

  return { workoutSets };
};

export default function HomeScreen() {
  const { user } = useUserStore();
  const { routine, getRoutines } = useRoutines(user?.id);

  const { tint, foreground, text, primary, tertiary } = useColors();
  const [visibleIndex, setVisibleIndex] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [routineId, setRoutineId] = useState<string | undefined>("");
  const [showModalInfo, setShowModalInfo] = useState(false);
  const { workoutSets } = useWorkoutSetsData(user?.id);

  const progressIndex = usePerformanceIndex(workoutSets);
  const day = format(new Date(), "eeee", { locale: es });
  const { block, getBlock, exist, isLoadingWorkout } = useWorkoutToTrain(
    day,
    routine?.id,
  );

  const { filters, onChangeFilter, range } = useFilters();

  const lineChart = useChartData(range, workoutSets);
  const [show, setShow] = useState(false);
  // const { existHour, setHourToTraining } = useHourToTrain();

  const showPicker = () => {
    setShow(true);
  };

  const remove = async () => {
    Alert.alert(
      "Eliminar Rutina",
      `⚠️ Esta acción es irreversible.\n\n¿Estás seguro de que quieres eliminar la rutina permanentemente?`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            //await TrainingFacade.removeRoutine(routineId);
            getRoutines();
            //getBlock();

            setShowModalEdit(false);
          },
        },
      ],
    );
  };

  const updateRoutineNameFromDb = async () => {
    if (!isValidName(routineName)) {
      return;
    }

    //await TrainingFacade.updateRoutine({ name: routineName }, routineId);
    await getRoutines();

    setShowModalEdit(false);
  };

  return (
    <ThemedView>
      <ThemedText
        type="defaultSemiBold"
        style={{ marginHorizontal: 12, marginBottom: 12 }}
      >
        {useGreeting()} {user?.username}
      </ThemedText>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          marginHorizontal: 12,
          gap: 12,
        }}
      >
        <Skeleton isLoading={isLoadingWorkout}>
          {Boolean(!routine) ? (
            <Link
              href="/personal/new-routine"
              asChild
              style={{ marginHorizontal: 0 }}
            >
              <Touchable title="Agregar entrenamiento" icon="plus" />
            </Link>
          ) : (
            <Link
              href={{
                pathname: "/personal/routine/[...routine]",
                params: {
                  routine: [routine?.name as string, routine?.id as string],
                },
              }}
              asChild
            >
              <ItemList
                value={() => (
                  <View>
                    <ThemedText>{routine?.name}</ThemedText>
                    <ThemedText style={{ color: tertiary }}>
                      {useDaysInRoutine(routine?.countWorkoutSessions)}
                    </ThemedText>
                  </View>
                )}
                right={() => (
                  <IconButton
                    name="pencil"
                    size={26}
                    onPress={() => {
                      setRoutineId(routine?.id);
                      setRoutineName(routine?.name ?? "");
                      setShowModalEdit(true);
                    }}
                  />
                )}
              />
            </Link>
          )}
        </Skeleton>
        <Skeleton isLoading={isLoadingWorkout}>
          {exist ? (
            <Link
              href={{
                pathname: "/personal/workout/[...workout]",
                params: {
                  workout: [block.name, block.id],
                },
              }}
              asChild
            >
              <ItemList
                value={() => {
                  return (
                    <View>
                      <CardTitle>Entrenamiento para hoy</CardTitle>
                      <View style={styles.cardContent}>
                        <Octicons name="zap" size={20} color={tint} />
                        <ThemedText>{block.name}</ThemedText>
                      </View>
                    </View>
                  );
                }}
              />
            </Link>
          ) : (
            <Card>
              <CardTitle>Bloque ha entrenar (hoy)</CardTitle>
              <View style={styles.cardContent}>
                <Octicons name="zap" size={20} color={tint} />
                <ThemedText>No existe entrenamiento para hoy</ThemedText>
              </View>
            </Card>
          )}
        </Skeleton>
        <Skeleton isLoading={isLoadingWorkout}>
          <Card>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <CardTitle style={{ width: "90%", marginBottom: 8 }}>
                Rendimiento con respecto a la semana anterior
              </CardTitle>
              <IconButton
                name="info"
                size={18}
                onPress={() => setVisibleIndex(true)}
              />
            </View>
            <LevelProgressBar value={progressIndex} />
          </Card>
        </Skeleton>
        <Skeleton isLoading={isLoadingWorkout}>
          <Card>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <CardTitle>Progreso general</CardTitle>
              <IconButton
                name="info"
                size={18}
                onPress={() => setShowModalInfo(true)}
              />
            </View>

            <FilterBar
              filters={filters}
              onChange={(key) => onChangeFilter(key)}
            />
            <View>
              <LineChart
                width={260}
                color={tint}
                curved
                initialSpacing={30}
                areaChart
                startFillColor={tint}
                endFillColor={primary}
                data={lineChart}
                spacing={80}
                noOfSections={4}
                dataPointsColor={text}
                yAxisColor={foreground}
                xAxisColor={foreground}
                xAxisLabelTextStyle={{
                  fontFamily: "Inter_500Medium",

                  color: text,
                }}
                yAxisTextStyle={{
                  fontFamily: "Inter_500Medium",
                  color: text,
                }}
              />
            </View>
          </Card>
        </Skeleton>
      </ScrollView>
      <Modal
        visible={visibleIndex}
        onRequestClose={() => setVisibleIndex(false)}
      >
        <ThemedText type="defaultSemiBold">Índice de rendimiento</ThemedText>
        <ThemedText>
          Refleja tu nivel de rendimiento en las últimas dos semanas, comparando
          la semana actual con la anterior.
        </ThemedText>

        <Touchable
          title="cerrar"
          style={{ alignSelf: "flex-end" }}
          type="shadow"
          onPress={() => setVisibleIndex(false)}
        />
      </Modal>
      <Modal visible={showModalEdit}>
        <ThemedText type="defaultSemiBold">
          Actualizar nombre de la rutina
        </ThemedText>

        <ThemedInput onChangeText={setRoutineName} value={routineName} />
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Touchable title="Cancelar" onPress={() => setShowModalEdit(false)} />
          <Touchable
            disabled={!routineName.length}
            title="Guardar"
            onPress={() => updateRoutineNameFromDb()}
          />
        </View>

        <Touchable
          type="danger"
          title="Eliminar"
          disabled={!routineName.length}
          onPress={remove}
        />
      </Modal>

      <Modal
        visible={showModalInfo}
        onRequestClose={() => setShowModalInfo(false)}
      >
        <ThemedText type="subtitle">Cómo leer tu progreso</ThemedText>

        <View style={{ marginTop: 12, gap: 16 }}>
          <View>
            <ThemedText type="defaultSemiBold">Mensual</ThemedText>
            <ThemedText>
              Resume tu actividad del mes actual (
              {format(new Date(), "MMMM", { locale: es })}).
            </ThemedText>
          </View>

          <View>
            <ThemedText type="defaultSemiBold">3 meses</ThemedText>
            <ThemedText>
              Tendencia de tus entrenamientos de los últimos 90 días.
            </ThemedText>
          </View>

          <View>
            <ThemedText type="defaultSemiBold">6 meses</ThemedText>
            <ThemedText>
              Vista global de medio año para ver tu evolución a largo plazo.
            </ThemedText>
          </View>
        </View>
        <Touchable
          title="cerrar"
          style={{ alignSelf: "flex-end" }}
          type="shadow"
          onPress={() => setShowModalInfo(false)}
        />
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  buttonFilter: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
