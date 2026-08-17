import { IconButton } from "@/components/IconButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { router } from "expo-router";

import { useEffect, useState } from "react";
import Purchases from "react-native-purchases";

import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useUserStore } from "@/store/userStore";

import { NavigationHeader } from "@/components/NavigationHeader";
import { isValidName } from "@/helpers/inputValidation";
import { useColors } from "@/hooks/useColors";
import { QrCodeScan } from "@/components/icons/QrCode";
import { useCameraPermissions } from "expo-camera";
import { importRoutieFromCatalog } from "@/utils/importRoutineFromCatalog";
import { useWorkoutVM } from "./ViewModel/useWorkoutVM";

export default function NewRoutineScreen() {
  const { user, setIsPremium } = useUserStore();

  const { tint, secondary, primary } = useColors();
  const [value, setValue] = useState("");
  const [importRoutine, setImportRoutine] = useState<boolean>(false);
  const [_, requestPermission] = useCameraPermissions();
  const [typeCreate, setTypeCreate] = useState<"create" | "import">("create");
  const { addWorkout, error } = useWorkoutVM();

  const [codeRoutine, setCodeRoutine] = useState("");

  const addRoutine = async () => {
    if (!isValidName(value)) {
      return;
    }

    const success = await addWorkout(value, user?.id ?? "");
    if (success) {
      router.back();
    }
  };

  const openCatalog = () => {
    Linking.openURL("https://catalog-routines.netlify.app/");
  };

  const importRoutineInDevice = async () => {
    setImportRoutine(true);
    await importRoutieFromCatalog({
      code: codeRoutine,
      userId: user?.id ?? "",
    });

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
        headerRight={() => {
          if (value.length) {
            return <IconButton name="check" onPress={() => addRoutine()} />;
          }
        }}
      />
      {error && (
        <ThemedText
          type="error"
          style={{ marginHorizontal: 12, marginBottom: 12 }}
        >
          {error}
        </ThemedText>
      )}
      <View style={[Styles.typeCreateRoutine, { backgroundColor: secondary }]}>
        <Touchable
          title="Crear"
          style={Styles.buttton}
          onPress={() => setTypeCreate("create")}
          type={typeCreate === "create" ? "default" : "shadow"}
        />
        <Touchable
          title="Importar"
          style={Styles.buttton}
          onPress={() => setTypeCreate("import")}
          type={typeCreate === "import" ? "default" : "shadow"}
        />
      </View>

      <View style={{ marginHorizontal: 12, gap: 12, marginBottom: 12 }}>
        {typeCreate === "create" && (
          <>
            <ThemedText type="defaultSemiBold">Nombre de la rutina</ThemedText>

            <ThemedInput
              placeholder="Coloque aquí el nombre de su rutina "
              onChangeText={setValue}
              value={value}
            />
          </>
        )}
        {typeCreate === "import" && (
          <>
            <ThemedText type="defaultSemiBold">ID de rutina</ThemedText>

            <View>
              <ThemedInput
                onChangeText={setCodeRoutine}
                value={codeRoutine}
                placeholder="Coloque aquí el código de la rutina"
              />

              {!importRoutine && (
                <IconButton
                  onPress={() => importRoutineInDevice()}
                  disabled={Boolean(!codeRoutine.length)}
                  name="download"
                  color={tint}
                  style={{
                    position: "absolute",
                    top: "8%",
                    alignSelf: "flex-end",
                    right: 20,
                  }}
                />
              )}

              {importRoutine && (
                <ActivityIndicator
                  size="small"
                  color={tint}
                  style={{
                    position: "absolute",
                    top: "30%",
                    alignSelf: "flex-end",
                    right: 20,
                  }}
                />
              )}
            </View>
            <Pressable
              onPress={requestPermissionCamera}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  alignSelf: "center",
                  flexDirection: "row",
                  gap: 10,
                  backgroundColor: primary,
                  padding: 15,
                  borderRadius: 10,
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: 15,
                },
              ]}
            >
              <QrCodeScan fill={tint} />
              <ThemedText>Escanear QR</ThemedText>
            </Pressable>
            <Touchable
              type="shadow"
              title="Explorar rutinas públicas"
              icon="globe"
              onPress={openCatalog}
            />
          </>
        )}
      </View>
    </ThemedView>
  );
}

const Styles = StyleSheet.create({
  typeCreateRoutine: {
    borderRadius: 10,
    gap: 10,
    padding: 10,
    marginHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  buttton: {
    flex: 1,
  },
});
