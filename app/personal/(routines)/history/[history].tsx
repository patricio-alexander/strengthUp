import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { View, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { HeaderTable } from "@/components/HeaderTable";
import { ThemedInput } from "@/components/ThemedInput";
import { IconButton } from "@/components/IconButton";
import { useLocalSearchParams } from "expo-router";
import { sets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NavigationHeader } from "@/components/NavigationHeader";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSetsToEdit } from "@/hooks/useSetsToEdit";
import { useColors } from "@/hooks/useColors";
import { useDrizzleDB } from "@/hooks/useDrizzleDB";
import { useFilteredSets } from "@/hooks/useFilteredSets";

export default function HistoryScreen() {
  const { tint } = useColors();
  const { history } = useLocalSearchParams();
  const [isEdit, setIsEdit] = useState(false);
  const drizzleDb = useDrizzleDB();
  const [focusInput, setFocusInput] = useState({
    field: "",
    row: 0,
    position: 0,
  });

  const { setsToEdit, updateOnlyValuesToEdit } = useSetsToEdit();
  const { listSets } = useFilteredSets(Number(history), "past");

  const saveChanges = async () => {
    for (const set of setsToEdit) {
      await drizzleDb.update(sets).set(set.values).where(eq(sets.id, set.id));
    }
    setIsEdit(false);
  };

  return (
    <ThemedView>
      <NavigationHeader
        title="Entrenamientos previos"
        headerRight={() =>
          isEdit && <IconButton name="check" onPress={() => saveChanges()} />
        }
      />
      {!listSets.length ? (
        <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
          Todavía no hay progreso registrado
        </ThemedText>
      ) : (
        <FlatList
          data={listSets}
          renderScrollComponent={(props) => (
            <KeyboardAwareScrollView {...props} />
          )}
          contentContainerStyle={{
            gap: 12,
            marginHorizontal: 12,
            paddingBottom: 100,
          }}
          renderItem={({ item, index: position }) => {
            const formatNowDate = format(new Date(item.date), "MMM dd, yyyy", {
              locale: es,
            });

            return (
              <View>
                <ThemedText type="subtitle" style={{ marginBottom: 22 }}>
                  {formatNowDate}
                </ThemedText>

                <FlatList
                  data={item.sets}
                  ListHeaderComponent={<HeaderTable />}
                  renderItem={({ item, index }) => (
                    <View style={Styles.row}>
                      <ThemedText type="defaultSemiBold" style={Styles.header}>
                        {index + 1}
                      </ThemedText>
                      <View style={Styles.cell}>
                        <ThemedInput
                          style={[
                            { textAlign: "center", height: 35 },
                            focusInput.field === "weight" &&
                              focusInput.row === index &&
                              focusInput.position === position && {
                                borderColor: tint,
                                borderWidth: 1,
                              },
                          ]}
                          keyboardType="number-pad"
                          onFocus={() =>
                            setFocusInput({
                              field: "weight",
                              position,
                              row: index,
                            })
                          }
                          defaultValue={item.weight.toString()}
                          onChangeText={(weight) => {
                            setIsEdit(true);
                            updateOnlyValuesToEdit({
                              setId: item.id,
                              weight: Number(weight.replace(",", ".")),
                            });
                          }}
                        />
                      </View>
                      <View style={Styles.cell}>
                        <ThemedInput
                          style={[
                            { textAlign: "center", height: 35 },
                            focusInput.field === "reps" &&
                              focusInput.row === index &&
                              focusInput.position === position && {
                                borderColor: tint,
                                borderWidth: 1,
                              },
                          ]}
                          onFocus={() =>
                            setFocusInput({
                              field: "reps",
                              position,
                              row: index,
                            })
                          }
                          defaultValue={item.reps.toString()}
                          keyboardType="number-pad"
                          onChangeText={(reps) => {
                            setIsEdit(true);
                            updateOnlyValuesToEdit({
                              setId: item.id,
                              reps: Number(reps.replace(",", ",")),
                            });
                          }}
                        />
                      </View>
                    </View>
                  )}
                />
              </View>
            );
          }}
        />
      )}
    </ThemedView>
  );
}

const Styles = StyleSheet.create({
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
  footer: {
    marginTop: 10,
  },
});
