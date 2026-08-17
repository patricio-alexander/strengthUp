import { IconButton } from "@/components/IconButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import OpenAI from "react-native-openai";

import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { NavigationHeader } from "@/components/NavigationHeader";
import { Modal } from "@/components/Modal";
import { Card, CardTitle } from "@/components/Card";
import { ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/useColors";
import { LevelProgressBar } from "@/components/LevelProgressBar";
import Paywall from "react-native-purchases-ui";
import Markdown from "react-native-markdown-display";
import { useUserStore } from "@/store/userStore";
import { usePerformanceIndex } from "@/hooks/usePerformanceIndex";
import { useSetsToEdit } from "@/hooks/useSetsToEdit";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { FilterSets } from "@/types/filterSets";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useSetsVM } from "./ViewModel/useSetVM";

const prompt = `
      Eres un entrenador experto en fitness y sobrecarga progresiva, 
      genera una recomendación en base a las ultimos 15 dias.
      Haz un analisis y haz una recomendación sintetica de lo que debe hacer
      sin rodeos.
      - Genera un texto perfecto
`;

export default function ExerciseScreen() {
  const { tint, green, primary, secondary, tertiary, danger, background } =
    useColors();
  const { isPremium } = useUserStore();

  const [form, setForm] = useState({ weight: "", reps: "" });

  const formatNowDate = format(new Date(), "MMM dd, yyyy", {
    locale: es,
  });

  const { exercise } = useLocalSearchParams();
  const [exerciseName, workoutSessionExerciseId] = exercise;

  const [visible, setVisible] = useState(false);

  const {
    sets: todaySets,
    isLoading: isLoadingTodaySets,
    error: errorTodaySets,
    getSets: getSetsToday,
    addNewSet,
    removeSet,
  } = useSetsVM(Number(workoutSessionExerciseId), FilterSets.today);

  const {
    sets: allSets,
    isLoading: isLoadingAllSets,
    error: errorAllSets,
    getSets: getAllSets,
  } = useSetsVM(Number(workoutSessionExerciseId), FilterSets.all);

  const { lastSession, isLastSessionLoading, getLastSession } = useSetsVM(
    Number(workoutSessionExerciseId),
    FilterSets.all,
  );

  const [isEdit, setIsEdit] = useState(false);
  const [recomendation, setRecomendation] = useState("");
  const [waitRecomendation, setWaitRecomendation] = useState(false);

  const indexPerformance = usePerformanceIndex(allSets);

  const { setsToEdit, updateOnlyValuesToEdit } = useSetsToEdit();

  const checkIfProgressSets = lastSession?.sets.map((s, i) => {
    if (todaySets[0]?.sets.length && todaySets[0]?.sets[i]) {
      return {
        weight: s.weight,
        reps: s.reps,
        progresed:
          Number(todaySets[0].sets[i].weight) *
            Number(todaySets[0].sets[i].reps) >
          Number(s.reps) * Number(s.weight),
      };
    }
    return {
      weight: s.weight,
      reps: s.reps,
      progresed: false,
    };
  });

  const lastWorkoutProgress = {
    label: lastSession?.label,
    sets: checkIfProgressSets,
  };

  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 15);

  const [focusInput, setFocusInput] = useState({ index: 0, field: "" });

  const resetForm = () => {
    setForm({ weight: "", reps: "" });
  };

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setForm({ ...form, [name]: value });
  };

  const saveChanges = async () => {
    await Promise.all(
      setsToEdit.map((s) =>
        supabase.from("exercise_sets").update(s.values).eq("id", s.id),
      ),
    )
      .then(() => {
        setIsEdit(false);
      })
      .finally(() => {
        Keyboard.dismiss();
        getAllSets();
        getSetsToday();
      });
  };

  const openAI = useMemo(
    () =>
      new OpenAI({
        apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY as string,
        organization: process.env.EXPO_PUBLIC_OPENAI_ORGANIZATION as string,
      }),
    [],
  );

  const generateAtlasRecomendation = async () => {
    setWaitRecomendation(true);
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 15);

    const setsCurrent15Days = allSets[0].sets.filter((s) => {
      const date = new Date(s.performed_at);
      return date >= start && date <= end;
    });

    openAI.chat.stream({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `
            ¿Qué patrones puedes ver en mis entrenamientos de ${exerciseName}?
            ¿Estoy progresando o estancado? Todo esto en base a
            ${JSON.stringify(setsCurrent15Days)}
          `,
        },
      ],
      model: "gpt-4o-mini",
    });
  };

  useEffect(() => {
    const handleMessage = (payload: any) => {
      setRecomendation((messages) => {
        const newMessage = payload.choices[0]?.delta.content;
        if (newMessage) {
          messages += newMessage;
        }

        if (payload.choices[0]?.finishReason === null) {
          console.log(payload.choices[0]?.finishReason);
          setWaitRecomendation(false);
        }
        return messages;
      });
    };

    openAI.chat.addListener("onChatMessageReceived", handleMessage);

    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI]);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setFocusInput({ field: "", index: 0 });
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  return (
    <ThemedView>
      <NavigationHeader
        style={{ marginBottom: 16 }}
        title={exerciseName}
        headerRight={() => {
          if (isLoadingTodaySets) {
            return (
              <ActivityIndicator
                size="large"
                color={tint}
                style={{ marginTop: 20 }}
              />
            );
          }

          return (
            <IconButton
              name={!isEdit ? "plus" : "check"}
              onPress={() => (!isEdit ? setVisible(true) : saveChanges())}
              type="contained"
            />
          );
        }}
      />

      <Modal
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>
          Datos de la serie
        </ThemedText>

        <ThemedInput
          placeholder="Peso (kg)"
          keyboardType="number-pad"
          value={form.weight.toString()}
          onChangeText={(value) => handleChange({ name: "weight", value })}
          style={{ marginBottom: 12 }}
        />
        <ThemedInput
          placeholder="Reps"
          keyboardType="number-pad"
          value={form.reps.toString()}
          onChangeText={(value) => handleChange({ name: "reps", value })}
        />

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Touchable title="Cancelar" onPress={() => setVisible(false)} />
          <Touchable
            title="Guardar"
            disabled={!Boolean(form.reps.length && form.weight.length)}
            onPress={async () => {
              resetForm();
              setVisible(false);
              addNewSet(Number(workoutSessionExerciseId), {
                weight: form.weight.replace(",", "."),
                reps: form.reps.replace(",", "."),
                performed_at: new Date().toISOString(),
              }).then(() => {
                getSetsToday();
              });
            }}
          />
        </View>
      </Modal>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          marginHorizontal: 12,
        }}
      >
        <ThemedText type="defaultSemiBold" style={{ color: tertiary }}>
          {formatNowDate}
        </ThemedText>
        <Link href={`/personal/history/${workoutSessionExerciseId}`} asChild>
          <Touchable
            type="shadow"
            title="Entrenamientos previos"
            icon="history"
          />
        </Link>
      </View>
      <ScrollView
        style={{ marginHorizontal: 12 }}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 6 }}>
          {todaySets[0]?.sets.map((item, index) => (
            <View style={Styles.row} key={index}>
              <ThemedText type="defaultSemiBold" style={Styles.cell}>
                Serie {index + 1}
              </ThemedText>
              <View style={Styles.cell}>
                <ThemedInput
                  type="shadow"
                  style={[
                    {
                      textAlign: "right",
                      paddingRight: 35,
                      backgroundColor: secondary,
                      borderRadius: 10,
                    },
                    focusInput.index === index &&
                      focusInput.field === "weight" && {
                        borderColor: tint,
                        borderWidth: 1,
                      },
                  ]}
                  onFocus={() => setFocusInput({ index, field: "weight" })}
                  defaultValue={item.weight.toString()}
                  keyboardType="number-pad"
                  onChangeText={(weight) => {
                    setIsEdit(true);
                    updateOnlyValuesToEdit({
                      setId: Number(item.id),
                      weight: Number(weight.replace(",", ".")),
                    });
                  }}
                />
                <ThemedText
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    color: tint,
                  }}
                >
                  kg
                </ThemedText>
              </View>
              <View style={Styles.cell}>
                <ThemedInput
                  type="shadow"
                  style={[
                    {
                      textAlign: "right",
                      paddingRight: 50,
                      backgroundColor: secondary,
                      borderRadius: 10,
                    },
                    focusInput.index === index &&
                      focusInput.field === "reps" && {
                        borderColor: tint,
                        borderWidth: 1,
                      },
                  ]}
                  defaultValue={item.reps.toString()}
                  keyboardType="number-pad"
                  onFocus={() => setFocusInput({ index, field: "reps" })}
                  onChangeText={(reps) => {
                    setIsEdit(true);
                    updateOnlyValuesToEdit({
                      setId: Number(item.id),
                      reps: Number(reps.replace(",", ".")),
                    });
                  }}
                />
                <ThemedText
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    color: tint,
                  }}
                >
                  reps
                </ThemedText>
              </View>
              <IconButton
                name="x"
                type="contained"
                size={20}
                color={danger}
                style={{ backgroundColor: "#ef44441a" }}
                onPress={async () => {
                  await removeSet(Number(item.id));
                  getSetsToday();
                }}
              />
            </View>
          ))}
        </View>

        <View>
          {isLoadingTodaySets || isLoadingAllSets ? (
            <ActivityIndicator
              size="large"
              color={tint}
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              <Card style={{ marginTop: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <Octicons name="calendar" color={tint} size={24} />
                  <CardTitle>Anterior entrenamiento</CardTitle>
                </View>
                {!lastSession ? (
                  <ThemedText style={{ color: tint }}>
                    No existe entrenamiento previo
                  </ThemedText>
                ) : (
                  <>
                    <ThemedText style={{ marginBottom: 12 }}>
                      {lastWorkoutProgress.label}
                    </ThemedText>
                    {lastWorkoutProgress?.sets?.map((s, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          marginBottom: 12,
                        }}
                      >
                        <ThemedText
                          style={{
                            backgroundColor: primary,
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            paddingVertical: 7,
                          }}
                        >
                          Serie {i + 1}
                        </ThemedText>
                        <ThemedText
                          style={{
                            backgroundColor: primary,
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            paddingVertical: 7,
                          }}
                        >
                          {s.weight} kg
                        </ThemedText>
                        <ThemedText
                          style={{
                            backgroundColor: primary,
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            paddingVertical: 7,
                          }}
                        >
                          {s.reps} reps
                        </ThemedText>
                        <ThemedText
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 7,
                          }}
                        >
                          <Octicons
                            name={s?.progresed ? "chevron-up" : "dash"}
                            color={s?.progresed ? green : tint}
                            size={24}
                          />
                        </ThemedText>
                      </View>
                    ))}
                  </>
                )}
              </Card>
              <Card style={{ marginTop: 12 }}>
                <View
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <CardTitle>Rendimiento</CardTitle>
                  <ThemedText style={{ color: tertiary }}>
                    Comparado con tu ultima sesión
                  </ThemedText>
                </View>

                <LevelProgressBar
                  value={indexPerformance}
                  style={{ marginBottom: 12 }}
                />
              </Card>
            </>
          )}

          <Card
            style={{
              marginVertical: 12,
              overflow: "hidden",
              padding: 16,
              borderRadius: 16,
            }}
          >
            <LinearGradient
              colors={[tint, tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View>
              <MaterialCommunityIcons
                name="star-shooting-outline"
                color={background}
                size={24}
              />

              <ThemedText
                type="subtitle"
                style={{ marginBottom: 8, color: background }}
              >
                Coach Atlas
              </ThemedText>
            </View>

            {/* Mensaje motivador */}
            {isPremium ? (
              <ThemedText
                style={{
                  marginBottom: 12,
                  fontStyle: "italic",
                  color: background,
                }}
              >
                ¡Estoy listo para decirte tu próximo paso 💪!
              </ThemedText>
            ) : (
              <ThemedText style={{ marginBottom: 12, color: background }}>
                Desbloquea recomendaciones inteligentes basadas en tu fatiga y
                progresión histórica para maximizar cada serie.
              </ThemedText>
            )}

            {/* Caja de recomendación */}
            {Boolean(recomendation) && (
              <Markdown
                style={{
                  body: {
                    color: background,
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: "Inter_400Regular",
                    padding: 2,
                  },

                  heading1: {
                    color: background,

                    marginTop: 10,
                    fontSize: 19,
                    fontFamily: "Inter_700Bold",
                  },

                  heading2: {
                    color: background,

                    marginTop: 10,
                    fontSize: 19,
                    fontFamily: "Inter_700Bold",
                  },

                  heading3: {
                    color: background,

                    marginTop: 10,
                    fontSize: 18,
                    fontFamily: "Inter_700Bold",
                  },

                  strong: {
                    color: background,

                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: "Inter_600SemiBold",
                  },
                }}
              >
                {recomendation}
              </Markdown>
            )}

            {/* Blur para no premium */}

            {/* Botón de acción */}
            {isPremium && !Boolean(recomendation) && (
              <Touchable
                title="GENERAR RECOMENDACIÓN"
                style={{ marginBottom: 12 }}
                disabled={waitRecomendation}
                onPress={() => generateAtlasRecomendation()}
              />
            )}
            {waitRecomendation && (
              <ActivityIndicator
                size="large"
                color={tint}
                style={{ marginTop: 20 }}
              />
            )}

            {!isPremium && (
              <Touchable
                title="OBTENER PREMIUM"
                onPress={() => Paywall.presentPaywall()}
              />
            )}
          </Card>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const Styles = StyleSheet.create({
  text: { marginBottom: 8, marginHorizontal: 12 },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 12,
  },
  cell: {
    width: "25%",
    textAlign: "center",
  },
  header: {
    width: "25%",
    textAlign: "center",
  },

  list: {
    marginHorizontal: 12,
  },
  buttonFilter: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
