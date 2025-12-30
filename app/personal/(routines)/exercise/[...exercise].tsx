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
import { BlurView } from "expo-blur";
import Paywall from "react-native-purchases-ui";
import Markdown from "react-native-markdown-display";
import { useUserStore } from "@/store/userStore";
import { usePerformanceIndex } from "@/hooks/usePerformanceIndex";
import { useSetsToEdit } from "@/hooks/useSetsToEdit";
import { Octicons } from "@expo/vector-icons";
import { setsGroupByDay } from "@/utils/sets";
import { FilterSets } from "@/types/filterSets";
import { Remove } from "@/components/icons/Remove";
import { useSets } from "@/hooks/useSets";
import { supabase } from "@/lib/supabase";
import { Set } from "@/types/set";

interface LastWorkout {
  label: string;
  sets: Set[] | [];
}

const useLastWorkout = (id: number) => {
  const [lastWorkout, setLastWorkout] = useState<LastWorkout>({
    label: "",
    sets: [],
  });

  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const getLastWorkout = async () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);

      const { data, error } = await supabase
        .from("exercise_sets")
        .select()
        .eq("workout_session_exercise_id", id)
        .lt("performed_at", new Date().toISOString())
        .limit(30);

      if (!data?.length) {
        return setEmpty(true);
      }

      const sorted = data.sort(
        (a, b) =>
          new Date(a.performed_at).getTime() -
          new Date(b.performed_at).getTime(),
      );

      const result = setsGroupByDay(sorted);

      const today = format(new Date(), "MMM dd yyyy", { locale: es });

      const filter = result.filter(
        (s) =>
          format(new Date(s.date), "MMM dd yyyy", { locale: es }) !== today,
      );

      const slice = filter.slice(filter.length - 1);

      if (!slice.length) {
        return setEmpty(true);
      }

      const lastSet = slice.flatMap((m) => ({
        label: format(new Date(m.date), "MMM dd yyyy", { locale: es }),
        sets: m.sets.filter((s) => new Date(s.performed_at) < new Date()),
      }));
      const [{ label, sets }] = lastSet;

      //
      setLastWorkout({
        label,
        sets,
      });
    };
    getLastWorkout();
  }, []);

  return { lastWorkout, empty };
};

export default function ExerciseScreen() {
  const { tint, green, primary } = useColors();
  const { isPremium } = useUserStore();

  const [form, setForm] = useState({ weight: "", reps: "" });

  const formatNowDate = format(new Date(), "MMM dd, yyyy", {
    locale: es,
  });

  const { exercise } = useLocalSearchParams();
  const [exerciseName, workoutSessionExerciseId] = exercise;

  const [visible, setVisible] = useState(false);

  const { sets: setsStore, getSets: getSetsToday } = useSets(
    Number(workoutSessionExerciseId),
    FilterSets.today,
  );
  const {
    sets: allSets,
    isLoading,
    getSets: getAllSets,
  } = useSets(Number(workoutSessionExerciseId), FilterSets.all);

  const [isEdit, setIsEdit] = useState(false);
  const [recomendation, setRecomendation] = useState("");
  const [waitRecomendation, setWaitRecomendation] = useState(false);

  const { text } = useColors();

  const indexPerformance = usePerformanceIndex(allSets);

  const { setsToEdit, updateOnlyValuesToEdit } = useSetsToEdit();
  const { lastWorkout, empty } = useLastWorkout(
    Number(workoutSessionExerciseId),
  );

  const checkIfProgressSets = lastWorkout.sets.map((s, i) => {
    if (setsStore[0]?.sets.length && setsStore[0]?.sets[i]) {
      return {
        weight: s.weight,
        reps: s.reps,
        progresed:
          setsStore[0].sets[i].weight * setsStore[0].sets[i].reps >
          s.reps * s.weight,
      };
    }
    return {
      weight: s.weight,
      reps: s.reps,
      progresed: false,
    };
  });

  const lastWorkoutProgress = {
    label: lastWorkout.label,
    sets: checkIfProgressSets,
  };

  const prompt = `
      Eres un entrenador experto en fitness y sobrecarga progresiva, 
      genera una recomendación en base a las ultimos 15 dias.
      Haz un analisis y haz una recomendación sintetica de lo que debe hacer
      sin rodeos.
      - Genera un texto perfecto
`;

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

  const addNewSet = async () => {
    await supabase.from("exercise_sets").insert({
      weight: Number(form.weight.replace(",", ".")),
      reps: Number(form.reps.replace(",", ".")),
      performed_at: new Date().toISOString(),
      workout_session_exercise_id: Number(workoutSessionExerciseId),
    });
    getSetsToday();
    resetForm();
    setVisible(false);
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

  const removeSet = async () => {
    await getSetsToday();
  };

  return (
    <ThemedView>
      <NavigationHeader
        title={exerciseName}
        headerRight={() => (
          <IconButton
            name={!isEdit ? "plus" : "check"}
            onPress={() => (!isEdit ? setVisible(true) : saveChanges())}
          />
        )}
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
            onPress={() => addNewSet()}
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
        <ThemedText type="defaultSemiBold">{formatNowDate}</ThemedText>
        <Link href={`/personal/history/${workoutSessionExerciseId}`} asChild>
          <Touchable type="shadow" title="Entrenamientos previos" />
        </Link>
      </View>
      <ScrollView
        style={{ marginHorizontal: 12 }}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 6 }}>
          {setsStore[0]?.sets.map((item, index) => (
            <View style={Styles.row} key={index}>
              <ThemedText type="defaultSemiBold" style={Styles.cell}>
                Serie {index + 1}
              </ThemedText>
              <View style={Styles.cell}>
                <ThemedInput
                  style={[
                    { textAlign: "right", paddingRight: 35 },
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
                      setId: item.id,
                      weight: Number(weight.replace(",", ".")),
                    });
                  }}
                />
                <ThemedText
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 13,
                    color: tint,
                  }}
                >
                  kg
                </ThemedText>
              </View>
              <View style={Styles.cell}>
                <ThemedInput
                  style={[
                    { textAlign: "right", paddingRight: 50 },
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
                      setId: item.id,
                      reps: Number(reps.replace(",", ".")),
                    });
                  }}
                />
                <ThemedText
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 13,
                    color: tint,
                  }}
                >
                  reps
                </ThemedText>
              </View>

              <Remove
                style={Styles.cell}
                width={30}
                height={30}
                onPress={async () => {
                  removeSet();
                }}
              />
            </View>
          ))}
        </View>

        <View>
          {isLoading ? (
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
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CardTitle>Anterior entrenamiento</CardTitle>
                </View>
                {empty ? (
                  <ThemedText style={{ color: tint }}>
                    No existe entrenamiento previo
                  </ThemedText>
                ) : (
                  <>
                    <ThemedText style={{ marginBottom: 12 }}>
                      {lastWorkoutProgress.label}
                    </ThemedText>
                    {lastWorkoutProgress.sets.map((s, i) => (
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
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CardTitle>
                    Rendimiento con respecto a tu ultima sesión
                  </CardTitle>
                </View>

                <LevelProgressBar
                  value={indexPerformance}
                  style={{ marginBottom: 12 }}
                />
              </Card>
              {/* {gifId && ( */}
              {/*   <Card */}
              {/*     style={{ */}
              {/*       marginTop: 12, */}
              {/*       alignItems: "center", */}
              {/*     }} */}
              {/*   > */}
              {/*     <View */}
              {/*       style={{ */}
              {/*         width: 150, */}
              {/*         height: 150, */}
              {/*         borderRadius: 10, */}
              {/*         overflow: "hidden", */}
              {/*         alignItems: "center", */}
              {/*         justifyContent: "center", */}
              {/*       }} */}
              {/*     > */}
              {/*       {isLoadingImage && ( */}
              {/*         <View */}
              {/*           style={{ */}
              {/*             position: "absolute", */}
              {/*           }} */}
              {/*         > */}
              {/*           <ActivityIndicator color={tint} size={"large"} /> */}
              {/*           <ThemedText>Cargando figura</ThemedText> */}
              {/*         </View> */}
              {/*       )} */}
              {/*       <Image */}
              {/*         style={{ width: "100%", height: "100%" }} */}
              {/*         source={{ */}
              {/*           uri: `https://catalog-routines.netlify.app/exercises/${gifId}.gif`, */}
              {/*         }} */}
              {/*         onLoadEnd={() => setIsLoadingImage(false)} */}
              {/*       /> */}
              {/*     </View> */}
              {/*   </Card> */}
              {/* )} */}
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
            {/* Título */}
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
              Coach Atlas
            </ThemedText>

            {/* Mensaje motivador */}
            {isPremium ? (
              <ThemedText
                style={{ marginBottom: 12, fontStyle: "italic", color: "#ccc" }}
              >
                ¡Estoy listo para decirte tu próximo paso 💪!
              </ThemedText>
            ) : (
              <ThemedText style={{ marginBottom: 12 }}>
                🔒 Las recomendaciones de Atlas son parte del plan premium.
              </ThemedText>
            )}

            {/* Caja de recomendación */}
            {Boolean(recomendation) && (
              <Markdown
                style={{
                  body: {
                    color: text,
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: "Inter_400Regular",
                    padding: 2,
                  },

                  heading1: {
                    marginTop: 10,
                    fontSize: 19,
                    fontFamily: "Inter_700Bold",
                  },

                  heading2: {
                    marginTop: 10,
                    fontSize: 19,
                    fontFamily: "Inter_700Bold",
                  },

                  heading3: {
                    marginTop: 10,
                    color: text,
                    fontSize: 18,
                    fontFamily: "Inter_700Bold",
                  },

                  strong: {
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: "Inter_600SemiBold",
                    color: tint,
                  },
                }}
              >
                {recomendation}
              </Markdown>
            )}

            {/* Blur para no premium */}
            {!isPremium && (
              <BlurView
                style={StyleSheet.absoluteFill}
                intensity={60}
                tint="dark"
              />
            )}

            {/* Botón de acción */}
            {isPremium && !Boolean(recomendation) && (
              <Touchable
                title="Ver recomendación"
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
              <IconButton
                name="lock"
                type="contained"
                onPress={() => Paywall.presentPaywall()}
                style={{ alignSelf: "flex-end" }}
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
