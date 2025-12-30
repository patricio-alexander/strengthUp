import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { isValidName } from "@/helpers/inputValidation";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ThemedCheckBox } from "@/components/ThemedCheckbox";
import { supabase } from "@/lib/supabase";

const useWorkoutSession = (id: string) => {
  const [day, setDay] = useState<{ name: string; d: null | string }>({
    name: "",
    d: null,
  });

  useEffect(() => {
    const getOneWorkouSession = async () => {
      const { data } = await supabase
        .from("workout_sessions")
        .select("name, day")
        .eq("id", id)
        .single();

      if (!data) return;

      const { name, day } = data;
      setDay({ name, d: day });
    };
    getOneWorkouSession();
  }, [id]);

  return { day };
};

export default function NewDayModal() {
  const [valueInput, setValueInput] = useState("");

  const [daysWeek, setDaysWeek] = useState([
    { name: "Lunes", index: 1, check: false },
    { name: "Martes", index: 2, check: false },
    { name: "Miércoles", index: 3, check: false },
    { name: "Jueves", index: 4, check: false },
    { name: "Viernes", index: 5, check: false },
    { name: "Sábado", index: 6, check: false },
    { name: "Domingo", index: 0, check: false },
  ]);
  const { routineId, value, workoutSessionId } = useLocalSearchParams<{
    routineId: string;
    value: string;
    workoutSessionId: string;
  }>();

  const { day } = useWorkoutSession(workoutSessionId);
  const navigation = useNavigation();

  useEffect(() => {
    if (day.name) {
      setValueInput(day.name);
      checkDay(day.d);
    }
  }, [day]);

  const addWorkoutSession = async () => {
    if (!isValidName(valueInput)) {
      return;
    }

    const day = daysWeek.find((day) => day.check);

    const { data, error } = await supabase.from("workout_sessions").insert({
      name: valueInput,
      day: day?.name.toLocaleLowerCase(),
      routine_id: routineId,
    });

    setValueInput("");
    navigation.goBack();
  };

  const updateDayInDb = async () => {
    const day = daysWeek.find((day) => day.check);
    await supabase
      .from("workout_sessions")
      .update({ name: valueInput, day: day?.name.toLocaleLowerCase() })
      .eq("id", workoutSessionId);

    navigation.goBack();
  };

  const checkDay = (d: string | null) => {
    setDaysWeek((prev) =>
      prev.map((day) =>
        day.name.toLocaleLowerCase() === d?.toLocaleLowerCase()
          ? { ...day, check: true }
          : { ...day, check: false },
      ),
    );
  };

  const removeDay = async () => {
    Alert.alert(
      "Eliminar Día",
      `⚠️ Esta acción es irreversible.\n\n¿Estás seguro de que quieres eliminar el día?`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            const response = await supabase
              .from("workout_sessions")
              .delete()
              .eq("id", workoutSessionId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <ThemedView>
      <NavigationHeader
        title={value ? "Editar día" : "Agregar bloque"}
        headerRight={() =>
          Boolean(valueInput?.length) &&
          daysWeek.some((day) => day.check) && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              {Boolean(value) && (
                <Touchable
                  title="Eliminar"
                  type="danger"
                  onPress={() => removeDay()}
                />
              )}
              <Touchable
                title={value ? "Confirmar" : "Guardar"}
                type="shadow"
                onPress={() => {
                  if (value) {
                    updateDayInDb();
                    return;
                  }
                  addWorkoutSession();
                }}
              />
            </View>
          )
        }
      />

      <View style={{ gap: 12, marginHorizontal: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText type="defaultSemiBold">Nombre del bloque</ThemedText>
        </View>
        <ThemedInput
          placeholder="Ej: Push A, Pull B, Piernas"
          value={valueInput}
          onChangeText={setValueInput}
        />
        <ThemedText type="defaultSemiBold">
          ¿Qué día entrenarás este bloque?
        </ThemedText>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ gap: 10 }}>
            {daysWeek.slice(0, 4).map(({ name, check, index }, i) => (
              <ThemedCheckBox
                key={i}
                title={name}
                handleChange={() => checkDay(name)}
                check={check}
              />
            ))}
          </View>
          <View style={{ gap: 10 }}>
            {daysWeek.slice(4).map(({ name, check, index }, i) => (
              <ThemedCheckBox
                key={i}
                title={name}
                handleChange={() => checkDay(name)}
                check={check}
              />
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
