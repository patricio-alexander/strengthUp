import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { Link, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { useColors } from "@/hooks/useColors";
import { ThemedText } from "@/components/ThemedText";
import { IconButton } from "@/components/IconButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { auth, firestore } from "@/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import GymnastIcon from "@/components/icons/Gymnast";
import { Routine } from "@/types/routine";
import { useSelectedExerciseStore } from "@/store/selectedExerciseStore";

export default function AssingRoutineScreen() {
  const [sucess, setSucess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRoutine, setLoadingRoutine] = useState(true);
  const { selectedExercise, indexBlock, reset } = useSelectedExerciseStore();

  const { customerId } = useLocalSearchParams();
  const [routine, setRoutine] = useState<Routine>({
    name: "",
    blocks: [],
  });

  const { primary, tint, icon, green } = useColors();

  const handleChangeDayName = (text: string, i: number) => {
    const updated = { ...routine };
    updated.blocks[i].name = text;
    setRoutine(updated);
  };

  const addBlock = () => {
    const updated = { ...routine };
    updated.name = updated.name;
    updated.blocks.push({ name: "Bloque x", exercises: [] });
    setRoutine(updated);
  };

  const addExerciseToDay = () => {
    const updated = { ...routine };

    updated.blocks[Number(indexBlock)].exercises.push({
      name: selectedExercise ?? "",
    });
    setRoutine(updated);

    reset();
  };

  useEffect(() => {
    if (indexBlock !== null && selectedExercise) {
      addExerciseToDay();
    }
  }, [indexBlock, selectedExercise]);

  const saveRoutine = async () => {
    const assignedRoutine = {
      customerId: customerId,
      assignedBy: auth.currentUser?.uid,
      routine: routine,
    };

    setLoading(true);

    await setDoc(
      doc(
        firestore,
        "customers",
        customerId as string,
        "routine",
        customerId as string,
      ),
      assignedRoutine,
    );

    await updateDoc(doc(firestore, "customers", customerId as string), {
      routineAssingned: true,
    });
    setLoading(false);
    setSucess(true);
  };

  const fetchRoutineAssigned = async () => {
    const ref = doc(
      firestore,
      "customers",
      customerId as string,
      "routine",
      customerId as string,
    );
    const docRoutine = await getDoc(ref);

    if (docRoutine.exists()) {
      setRoutine(docRoutine.data()?.routine);
      setLoadingRoutine(false);
    } else {
      setLoadingRoutine(false);
    }
  };

  const removeExercise = ({
    indexBlock,
    indexExercise,
  }: {
    indexBlock: number;
    indexExercise: number;
  }) => {
    const update = { ...routine };
    update.blocks[indexBlock].exercises = update.blocks[
      indexBlock
    ].exercises.filter((_, index) => index !== indexExercise);

    setRoutine(update);
  };

  const removeDay = ({ indexBlock }: { indexBlock: number }) => {
    const update = { ...routine };
    update.blocks = update.blocks.filter((_, index) => index !== indexBlock);
    setRoutine(update);
  };

  useEffect(() => {
    fetchRoutineAssigned();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setSucess(false);
    }, 5000);
    return () => clearTimeout(id);
  }, [sucess]);

  return (
    <ThemedView>
      <NavigationHeader
        title="Entrenamiento"
        headerRight={() =>
          loading ? (
            <ActivityIndicator size="small" color={tint} />
          ) : sucess ? (
            <ThemedText darkColor={green} lightColor={green}>
              Guardado con éxito
            </ThemedText>
          ) : !loadingRoutine ? (
            <Touchable title="Guardar" type="shadow" onPress={saveRoutine} />
          ) : null
        }
      />
      {loadingRoutine ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={tint} />
        </View>
      ) : (
        <View style={styles.container}>
          <ThemedInput
            placeholder="Nombre de la rutina"
            value={routine.name}
            onChangeText={(v) => setRoutine((prev) => ({ ...prev, name: v }))}
            style={{ marginBottom: 20 }}
          />

          {Boolean(routine.blocks.length) && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 20,
              }}
            >
              {/* <Link */}
              {/*   asChild */}
              {/*   href={{ */}
              {/*     pathname: */}
              {/*       "/coach/(rooms)/(customers)/[customerId]/workout-history", */}
              {/*     params: { */}
              {/*       customerId: customerId as string, */}
              {/*     }, */}
              {/*   }} */}
              {/* > */}
              {/*   <Touchable title="Ver desempeño" type="shadow" icon="graph" /> */}
              {/* </Link> */}
              <Link
                href={{
                  pathname: "/coach/[customerId]/tracking-routine",
                  params: {
                    customerId: customerId as string,
                  },
                }}
                asChild
              >
                <Touchable title="Dar seguimiento" type="shadow" icon="pulse" />
              </Link>
            </View>
          )}

          <KeyboardAwareScrollView
            contentContainerStyle={{ paddingBottom: 150, gap: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {routine.blocks?.map((day, indexBlock) => (
              <Card key={indexBlock} style={{ marginHorizontal: 0 }}>
                <ThemedText
                  type="defaultSemiBold"
                  darkColor={tint}
                  lightColor={tint}
                  style={{ marginBottom: 12 }}
                >
                  Bloque {indexBlock + 1}
                </ThemedText>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <ThemedInput
                    style={{ flex: 1, borderWidth: 2, borderColor: primary }}
                    value={day.name}
                    onChangeText={(v) => handleChangeDayName(v, indexBlock)}
                  />
                  <Touchable
                    title="Quitar bloque"
                    type="shadow"
                    icon="trash"
                    onPress={() => removeDay({ indexBlock })}
                  />
                </View>

                {day?.exercises.map((item, indexExercise) => (
                  <View key={indexExercise}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          flex: 1,
                        }}
                      >
                        <GymnastIcon color={icon} />
                        <ThemedText>{item.name}</ThemedText>
                      </View>
                      <IconButton
                        name="trash"
                        size={24}
                        onPress={() =>
                          removeExercise({ indexBlock, indexExercise })
                        }
                      />
                    </View>
                  </View>
                ))}
                <Link
                  href={{
                    pathname: "/coach/available-exercises",
                    params: {
                      indexBlock,
                    },
                  }}
                  asChild
                >
                  <Touchable
                    title="Añadir ejercicio"
                    icon="plus"
                    // onPress={() => {
                    //   setSelectedDayIndex(indexBlock);
                    //   setShow(!show);
                    // }}
                  />
                </Link>
              </Card>
            ))}
            <Touchable
              type="shadow"
              title="Añadir bloque"
              onPress={addBlock}
              style={{ marginVertical: 12 }}
            />
          </KeyboardAwareScrollView>
        </View>
      )}
      {/* <Modal */}
      {/*   visible={show} */}
      {/*   transparent={true} */}
      {/*   animationType="fade" */}
      {/*   onRequestClose={() => setShow(!show)} */}
      {/*   statusBarTranslucent={true} */}
      {/* > */}
      {/*   <BlurView */}
      {/*     tint="dark" */}
      {/*     style={{ */}
      {/*       flex: 1, */}
      {/*       justifyContent: "center", */}
      {/*       alignItems: "center", */}
      {/*     }} */}
      {/*     intensity={100} */}
      {/*   > */}
      {/*     <View */}
      {/*       style={{ */}
      {/*         backgroundColor: background, */}
      {/*         width: "90%", */}
      {/*         borderRadius: 10, */}
      {/*         padding: 20, */}
      {/*         position: "relative", */}
      {/*       }} */}
      {/*     > */}
      {/*       <View style={{ marginBottom: 12, gap: 6 }}> */}
      {/*         <ThemedText type="subtitle" style={{ alignSelf: "center" }}> */}
      {/*           Ejercicios disponibles */}
      {/*         </ThemedText> */}
      {/*         <ThemedInput */}
      {/*           placeholder="Buscar" */}
      {/*           value={search} */}
      {/*           onChangeText={setSearch} */}
      {/*         /> */}
      {/*       </View> */}
      {/*       <FlatList */}
      {/*         style={{ height: "50%" }} */}
      {/*         data={filterExercise} */}
      {/*         contentContainerStyle={{ gap: 6 }} */}
      {/*         showsVerticalScrollIndicator={false} */}
      {/*         renderItem={({ item }) => ( */}
      {/*           <ItemList */}
      {/*             value={item.name} */}
      {/*             onPress={() => addExerciseToDay(item.name)} */}
      {/*           /> */}
      {/*         )} */}
      {/*       /> */}
      {/*       <Touchable */}
      {/*         title="Cerrar" */}
      {/*         type="shadow" */}
      {/*         onPress={() => setShow(!show)} */}
      {/*         style={{ marginTop: 12, alignSelf: "flex-end" }} */}
      {/*       /> */}
      {/*     </View> */}
      {/*   </BlurView> */}
      {/* </Modal> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    flex: 1,
  },
  modal: {
    flex: 1,
  },
});
