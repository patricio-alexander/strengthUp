import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { days } from "@/db/schema";
import { isValidName } from "@/helpers/inputValidation";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { eq } from "drizzle-orm";
import { ThemedCheckBox } from "@/components/ThemedCheckbox";
import { TrainingFacade } from "@/facades/TrainingFacade";

const useDayData = (id: number) => {
  const [day, setDay] = useState<{name: string, d: null | number}>({
    name: "",
    d: null,
  });

  useEffect(() => {
    const getData = async () => {
      const d = await TrainingFacade.getBlocks(id);
      if (!d.length) {
        return;
      }
      const { name, day } = d[0];
      setDay({ name, d: day });
    };
    getData();
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
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const { routineId, value, dayId } = useLocalSearchParams<{
    routineId: string;
    value: string;
    dayId: string;
  }>();
  const { day } = useDayData(Number(dayId));
  const navigation = useNavigation();

  useEffect(() => {
    if (day.name) {
      setValueInput(day.name);
      checkDay(day.d);
    }
  }, [day]);

  const addDayInDb = async () => {
    if (!isValidName(valueInput)) {
      return;
    }

    const day = daysWeek.find((day) => day.check);

    await TrainingFacade.addBlock({
      name: valueInput,
      routineId: Number(routineId),
      day: day?.index,
    });

    setValueInput("");
    navigation.goBack();
  };

  const updateDayInDb = async () => {
    const day = daysWeek.find((day) => day.check);
    await drizzleDb
      .update(days)
      .set({ name: valueInput, day: day?.index })
      .where(eq(days.id, Number(dayId)));
    navigation.goBack();
  };

  const checkDay = (i: number | null) => {
    setDaysWeek((prev) =>
      prev.map((day) =>
        day.index === i ? { ...day, check: true } : { ...day, check: false },
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
            await drizzleDb.delete(days).where(eq(days.id, Number(dayId)));
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
                  addDayInDb();
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
                handleChange={() => checkDay(index)}
                check={check}
              />
            ))}
          </View>
          <View style={{ gap: 10 }}>
            {daysWeek.slice(4).map(({ name, check, index }, i) => (
              <ThemedCheckBox
                key={i}
                title={name}
                handleChange={() => checkDay(index)}
                check={check}
              />
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
