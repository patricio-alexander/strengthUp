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
import { useBlockVM } from "./ViewModel/useBlockVM";

export default function NewWorkoutSessionScreen() {
  const [valueInput, setValueInput] = useState("");

  const [daysWeek, setDaysWeek] = useState([
    { name: "Lunes", check: false, key: "monday" },
    { name: "Martes", check: false, key: "tuesday" },
    { name: "Miércoles", check: false, key: "wednesday" },
    { name: "Jueves", check: false, key: "thursday" },
    { name: "Viernes", check: false, key: "friday" },
    { name: "Sábado", check: false, key: "saturday" },
    { name: "Domingo", check: false, key: "sunday" },
  ]);
  const { routineId, value, workoutSessionId } = useLocalSearchParams<{
    routineId: string;
    value: string;
    workoutSessionId: string;
  }>();
  const navigation = useNavigation();

  const { addBlock, updateBlock, removeBlock, block, error } = useBlockVM({
    blockId: Number(workoutSessionId),
  });

  useEffect(() => {
    if (block) {
      setValueInput(block.name);
      checkDay(block.day);
    }
  }, [block]);

  const addBlockToDb = async () => {
    if (!isValidName(valueInput)) {
      return;
    }

    const day = daysWeek.find((day) => day.check);
    if (!day) {
      return;
    }

    const success = await addBlock({
      name: valueInput,
      dayKey: day?.key,
      workoutId: routineId,
    });

    if (!success) return;

    setValueInput("");
    navigation.goBack();
  };

  const updateDayInDb = async () => {
    const day = daysWeek.find((day) => day.check);
    if (!day) {
      return;
    }

    const success = await updateBlock({
      id: Number(workoutSessionId),
      name: valueInput,
      day: day.key,
    });

    if (success) {
      navigation.goBack();
    }
  };

  const checkDay = (d: string | null) => {
    setDaysWeek((prev) =>
      prev.map((day) =>
        day.key === d ? { ...day, check: true } : { ...day, check: false },
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
            const success = await removeBlock(Number(workoutSessionId));
            if (success) {
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  return (
    <ThemedView>
      <NavigationHeader
        title={value ? "Editar entrenamiento" : "Agregar entrenamiento"}
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
                  addBlockToDb();
                }}
              />
            </View>
          )
        }
      />

      {error && (
        <ThemedText
          type="error"
          style={{ marginHorizontal: 12, marginBottom: 12 }}
        >
          {error}
        </ThemedText>
      )}

      <View style={{ gap: 12, marginHorizontal: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText type="defaultSemiBold">Nombre</ThemedText>
        </View>
        <ThemedInput
          placeholder="Ej: Push A, Pull B, Piernas"
          value={valueInput}
          onChangeText={setValueInput}
        />
        <ThemedText type="defaultSemiBold">¿Qué día entrenarás?</ThemedText>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ gap: 10 }}>
            {daysWeek.slice(0, 4).map(({ name, check, key }, i) => (
              <ThemedCheckBox
                key={i}
                title={name}
                handleChange={() => checkDay(key)}
                check={check}
              />
            ))}
          </View>
          <View style={{ gap: 10 }}>
            {daysWeek.slice(4).map(({ name, check, key }, i) => (
              <ThemedCheckBox
                key={i}
                title={name}
                handleChange={() => checkDay(key)}
                check={check}
              />
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
