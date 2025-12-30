import { IconButton } from "@/components/IconButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { useRoutineStore } from "@/store/routineStore";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import Paywall from "react-native-purchases-ui";
import Purchases from "react-native-purchases";

import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  SectionList,
  Alert,
  Linking,
} from "react-native";
import { useUserStore } from "@/store/userStore";
import Checkbox from "expo-checkbox";
import { useMemo } from "react";
import OpenAI from "react-native-openai";
import { NavigationHeader } from "@/components/NavigationHeader";
import { isValidName } from "@/helpers/inputValidation";
import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { QrCodeScan } from "@/components/icons/QrCode";
import { useCameraPermissions } from "expo-camera";
import { importRoutieFromCatalog } from "@/utils/importRoutineFromCatalog";
import { supabase } from "@/lib/supabase";

type sets = {
  reps: number;
  weight: number;
};

type days = {
  name: string;
  exercises: Array<string>;
  sets: sets[];
};

type routineIA = {
  days: days[];
  routinename: string;
  exercises: [];
};

export default function ModalNewRoutine() {
  const { user, setIsPremium, isPremium } = useUserStore();

  const { tint } = useColors();
  const [generateAI, setGenerateAI] = useState(false);
  const [checkAllInputs, setCheckAllInputs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [importRoutine, setImportRoutine] = useState<boolean>(false);
  const [_, requestPermission] = useCameraPermissions();

  const [isCompleteGenerateRoutine, setIsCompleteGenerateRoutine] =
    useState(false);

  const [codeRoutine, setCodeRoutine] = useState("");

  const [questions, setQuestions] = useState([
    {
      title: "¿Cuál es tu objetivo principal de entrenamiento?",
      data: [
        {
          option: "Ganar masa muscular",
          check: false,
        },
        {
          option: "Mejorar resistencia",
          check: false,
        },
        {
          option: "Mantenerme en forma",
          check: false,
        },
      ],
    },
    {
      title: "¿Cuántos días a la semana puedes entrenar?",
      data: [
        {
          option: "3 días",
          check: false,
        },
        {
          option: "4 días",
          check: false,
        },
        {
          option: "5 días",
          check: false,
        },
        {
          option: "6 días",
          check: false,
        },
      ],
    },
    {
      title: "¿Cuál es tu nivel de experiencia en el entrenamiento?",
      data: [
        {
          option: "Principiante (nunca he entrenado o llevo poco tiempo)",
          check: false,
        },
        {
          option:
            "Intermedio (ya entreno regularmente, pero aún estoy aprendiendo)",
          check: false,
        },
        {
          option: "Avanzado (entreno intensamente y tengo experiencia)",
          check: false,
        },
      ],
    },
  ]);

  const openAI = useMemo(
    () =>
      new OpenAI({
        apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY as string,
        organization: process.env.EXPO_PUBLIC_OPENAI_ORGANIZATION as string,
      }),
    [],
  );

  const handlePremium = () => {
    if (!isPremium) {
      Paywall.presentPaywall();
    }
  };

  // const addRoutineGenerateByIA = async (routine: routineIA) => {
  //   //console.log("Agregando rutina a DB");
  //   //console.log(routine);
  //   const [{ rouId }] = await drizzleDb
  //     .insert(routines)
  //     .values({
  //       name: routine.routinename,
  //       userId,
  //     })
  //     .returning({ rouId: routines.id });
  //
  //   const daysInsert = routine.days.map((d: days) => ({
  //     name: d.name,
  //     routineId: rouId,
  //   }));
  //
  //   const daysReturn = await drizzleDb
  //     .insert(days)
  //     .values(daysInsert)
  //     .returning({ id: days.id, name: days.name });
  //
  //   const exercisesInsert = routine.days
  //     .map((d) => d.exercises.map((e) => ({ name: e })))
  //     .flat();
  //
  //   const exercisesReturn = await drizzleDb
  //     .insert(exercises)
  //     .values(exercisesInsert)
  //     .returning({ name: exercises.name, id: exercises.id });
  //
  //   const daysExercisesInsert = exercisesReturn.map((e) => ({
  //     dayId: Number(
  //       daysReturn.find((_, i) => routine.days[i].exercises.includes(e.name))
  //         ?.id,
  //     ),
  //     exerciseId: e.id,
  //   }));
  //
  //   const formatNowDate = new Date();
  //   const daysExersisesReturn = await drizzleDb
  //     .insert(daysExcercises)
  //     .values(daysExercisesInsert)
  //     .returning({
  //       dayExerciseId: daysExcercises.id,
  //       exerciseId: daysExcercises.exerciseId,
  //     });
  //
  //   const setsInsert = routine.days.flatMap((d) =>
  //     d.exercises.flatMap((de) => {
  //       const exerciseId = exercisesReturn.find((e) => e.name === de)?.id;
  //
  //       const dayExerciseId = daysExersisesReturn.find(
  //         (e) => e.exerciseId === exerciseId,
  //       )?.dayExerciseId;
  //
  //       return d.sets.map((s) => ({
  //         dayExerciseId: dayExerciseId as number,
  //         reps: s.reps as number,
  //         weight: s.weight as number,
  //         date: formatNowDate,
  //       }));
  //     }),
  //   );
  //
  //   await drizzleDb.insert(sets).values(setsInsert);
  //
  //
  //   setIsCompleteGenerateRoutine(true);
  // };

  const handleCheck = (questionId: number, optionId: number) => {
    setQuestions((questions) =>
      questions.map((q, i) =>
        i === questionId
          ? {
              ...q,
              data: q.data.map((option, id) =>
                id === optionId
                  ? { ...option, check: !option.check }
                  : { ...option, check: false },
              ),
            }
          : q,
      ),
    );
  };

  const addRoutine = async ({ name }: { name: string }) => {
    if (generateAI) {
      setLoading(true);
      const level = questions
        .find((q) => q.title.includes("nivel"))
        ?.data.filter((o) => o.check);
      const objetive = questions
        .find((q) => q.title.includes("objetivo"))
        ?.data.filter((o) => o.check);

      const days = questions
        .find((q) => q.title.includes("días"))
        ?.data.filter((o) => o.check);

      const prompt = `
        Eres un entrenador personal experto en
        sobrecarga progresiva y fitness. Basado en la
        siguiente información del usuario, genera una
        rutina de entrenamiento personalizada y realista.

        Nivel del usuario: ${JSON.stringify(level)},
        Objetivo: ${JSON.stringify(objetive)},
        Días disponibles: ${JSON.stringify(days)}

        Si es para ganar mas muscular que no exceda de mas de 4 series.
        Devuélveme la rutina en formato JSON puro, perfectamente parseable con JSON.parse() en JavaScript.
        No agregues texto adicional antes o después del JSON.
        El JSON tiene que ser perfecto que no le falta ninguna coma, ni llaves.
        La estructura debe ser así:
        {
            "routinename": "nombre de la rutina",
            "days": [{
                name: "nombre del día", 
                exercises: "lista de ejercicios que le toca hacer, en array", 
                "sets": [
                  {
                    "reps": "aqui numero de reps solo un numero no en un rango solo un numero por ejemplo 12 no 10-12, es tipo number no string",
                    "weight": "el peso pon en todos 0, es tipo number no string"
                  }
                ]
              }],
            
        }

      `;

      openAI.chat.stream({
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        model: "gpt-4o-mini",
      });

      setCheckAllInputs(false);
      return;
    }

    if (!isValidName(name)) {
      return;
    }

    await supabase.from("routines").insert({ name, user_id: user?.id });

    router.back();
  };

  const openCatalog = () => {
    Linking.openURL("https://catalog-routines.netlify.app/");
  };

  const importRoutineInDevice = async () => {
    setImportRoutine(true);
    //await importRoutieFromCatalog({ code: codeRoutine, userId });

    setImportRoutine(false);

    router.back();
  };

  const requestPermissionCamera = async () => {
    const permission = await requestPermission();
    if (permission.granted) {
      return router.push("/scanner-routine");
    }
  };

  useEffect(() => {
    const allCheck = questions.every((q) =>
      q.data.some((option) => option.check),
    );

    setCheckAllInputs(allCheck);
  }, [questions]);

  useEffect(() => {
    let message = "";
    const handle = (payload: any) => {
      const newMessage = payload.choices[0]?.delta.content;
      if (newMessage) {
        message += newMessage;
      }

      if (!payload.choices[0]?.finishReason) {
        try {
          //addRoutineGenerateByIA(JSON.parse(message));
          setLoading(false);
        } catch (error) {
          Alert.alert(
            "Error",
            "Al parecer ocurrió un error intente nuevamente",
            [
              {
                text: "Cerrar",
                onPress: () => {
                  console.log("Cerrar");
                },
              },
            ],
          );
          setLoading(false);
        }
      }
    };

    openAI.chat.addListener("onChatMessageReceived", handle);

    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI]);

  useEffect(() => {
    const customerInfoUpdated = (customerInfo: any) => {
      const isUserPremium =
        customerInfo?.entitlements.active["premium"] !== undefined;
      setIsPremium({ premium: isUserPremium });
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, []);

  return (
    <ThemedView>
      <NavigationHeader
        title="Agregar rutina"
        headerRight={() =>
          value.length > 0 || checkAllInputs ? (
            <IconButton
              name="check"
              onPress={() => {
                addRoutine({ name: value });
              }}
            />
          ) : (
            loading && (
              <ActivityIndicator color={tint} style={{ marginRight: 10 }} />
            )
          )
        }
      />

      {!generateAI && (
        <View style={{ marginHorizontal: 12, gap: 12, marginBottom: 12 }}>
          <Card>
            <ThemedText type="defaultSemiBold">Nombre de la rutina</ThemedText>
            <ThemedInput
              placeholder="Coloque aquí el nombre de su rutina "
              onChangeText={setValue}
              value={value}
              type="shadow"
            />
          </Card>

          <Card>
            <ThemedText type="defaultSemiBold">Código de la rutina</ThemedText>

            <View>
              <ThemedInput
                style={{ marginBottom: 16 }}
                onChangeText={setCodeRoutine}
                value={codeRoutine}
                placeholder="Coloque aquí el código de la rutina"
                type="shadow"
              />
              {Boolean(codeRoutine.length) && !importRoutine ? (
                <IconButton
                  color={tint}
                  onPress={importRoutineInDevice}
                  name="download"
                  style={{
                    position: "absolute",
                    top: "8%",
                    alignSelf: "flex-end",
                    right: 20,
                  }}
                />
              ) : !importRoutine ? (
                <Pressable
                  onPress={requestPermissionCamera}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      position: "absolute",
                      top: "25%",
                      alignSelf: "flex-end",
                      right: 10,
                    },
                  ]}
                >
                  <QrCodeScan fill={tint} />
                </Pressable>
              ) : null}
              {importRoutine && (
                <ActivityIndicator
                  size="small"
                  color={tint}
                  style={{
                    position: "absolute",
                    top: "25%",
                    alignSelf: "flex-end",
                    right: 10,
                  }}
                />
              )}
            </View>
            <Touchable
              type="shadow"
              title="Explorar  rutinas"
              icon="globe"
              onPress={openCatalog}
            />
          </Card>
        </View>
      )}

      {generateAI && (
        <View style={{ marginHorizontal: 10 }}>
          {loading ? (
            <View
              style={[
                {
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                },
                Styles.gap,
              ]}
            >
              <ThemedText>
                Porfavor no cierre la aplicación, esto puede tardar unos
                segundos...
              </ThemedText>
            </View>
          ) : isCompleteGenerateRoutine ? (
            <ThemedText style={[Styles.gap, { textAlign: "center" }]}>
              Rutina generada con éxito
            </ThemedText>
          ) : (
            <SectionList
              sections={questions}
              keyExtractor={(item, index) => item.option + index}
              renderSectionHeader={({ section: { title } }) => (
                <ThemedText type="defaultSemiBold" style={Styles.gap}>
                  {title}
                </ThemedText>
              )}
              renderItem={({ item, index, section }) => {
                const questionIndex = questions.findIndex(
                  (q) => q.title === section.title,
                );

                return (
                  <Pressable
                    style={Styles.section}
                    onPress={() => handleCheck(questionIndex, index)}
                  >
                    <Checkbox
                      onValueChange={() => handleCheck(questionIndex, index)}
                      color={item.check ? tint : undefined}
                      value={item.check}
                      style={{ margin: 8 }}
                    />
                    <ThemedText>{item.option}</ThemedText>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      )}

      {!generateAI && (
        <Touchable
          title={
            isPremium
              ? "Crear rutina con Atlas IA"
              : "Crea tu rutina más fácil con Atlas IA"
          }
          onPress={() => {
            if (isPremium) {
              setGenerateAI(true);
              return;
            }

            handlePremium();
          }}
        />
      )}
    </ThemedView>
  );
}

const Styles = StyleSheet.create({
  gap: {
    marginTop: 12,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
});
