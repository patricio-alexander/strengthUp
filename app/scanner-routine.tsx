import { NavigationHeader } from "@/components/NavigationHeader";
import { CameraView } from "expo-camera";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { importRoutieFromCatalog } from "@/utils/importRoutineFromCatalog";
import { useUserStore } from "@/store/userStore";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useColors } from "@/hooks/useColors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width, height } = Dimensions.get("window");

export default function ScannerRoutineScreen() {
  const { userId } = useUserStore();
  const scanSize = 300;
  const scanTop = height * 0.3;
  const scanLeft = (width - scanSize) / 2;
  const qrLock = useRef(false);
  const [loading, setLoading] = useState(false);
  const { tint } = useColors();
  const [showCamera, setShowCamera] = useState(false);

  const importRoutine = async (code: string) => {
    setLoading(true);
    await importRoutieFromCatalog({ code, userId });
    setLoading(false);
    router.replace("/personal/(routines)");
  };

  useFocusEffect(
    useCallback(() => {
      qrLock.current = false;
      setShowCamera(true);
      return () => setShowCamera(false);
    }, []),
  );

  if (loading) {
    return (
      <ThemedView
        style={{ alignItems: "center", justifyContent: "center", gap: 10 }}
      >
        <ActivityIndicator color={tint} size="large" />
        <ThemedText>Importando rutina</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {showCamera && (
        <CameraView
          facing="back"
          style={styles.camera}
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              importRoutine(data);
            }
          }}
        />
      )}

      {/* Cuatro overlays alrededor del scanner */}
      {/* Top */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: scanTop,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />
      {/* Bottom */}
      <View
        style={{
          position: "absolute",
          top: scanTop + scanSize,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />
      {/* Left */}
      <View
        style={{
          position: "absolute",
          top: scanTop,
          left: 0,
          width: scanLeft,
          height: scanSize,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />
      {/* Right */}
      <View
        style={{
          position: "absolute",
          top: scanTop,
          left: scanLeft + scanSize,
          width: scanLeft,
          height: scanSize,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      {/* Borde del scanner */}

      <View
        style={{
          position: "absolute",
          top: scanTop,
          left: scanLeft,
          width: scanSize,
          height: scanSize,
        }}
      />

      <NavigationHeader
        title="Escanea tu rutina"
        style={{
          top: Constants.statusBarHeight,
          position: "absolute",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
