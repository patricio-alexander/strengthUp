import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, useColorScheme, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";

import Svg, { Circle, Rect } from "react-native-svg";
import { useState } from "react";

type LevelProgressBarProps = ViewProps & {
  value: number;
};

const badgeColors = {
  light: {
    max: "#00e606",
    medium: "#86efac",
    stable: "#ffff00",
    low: "#ffc7c7",
    veryLow: "#ff5757",
  },
  dark: {
    max: "#00e606",
    medium: "#bfff50",
    stable: "#ffff00",
    low: "#ffb232",
    veryLow: "#ff5757",
  },
};

export const LevelProgressBar = ({ value, style }: LevelProgressBarProps) => {
  const { text, secondary } = useColors();
  const [barWidth, setBarWidth] = useState(0);

  const theme = useColorScheme() ?? "light";

  const x = Math.max(-1, Math.min(1, value));
  const porcentage = ((x + 1) / 2) * 100;

  const left = (porcentage / 100) * barWidth;
  const safeLeft = Math.min(Math.max(left, 0), barWidth - 10);

  const getMessageStatusProgres = () => {
    if (porcentage >= 80) {
      return "excelente";
    }
    if (porcentage > 50) {
      return "avanzando";
    }
    if (porcentage > 30 && porcentage <= 50) {
      return "estable";
    }
    if (porcentage <= 20) {
      return "Necesita atención";
    }

    if (porcentage <= 30) {
      return "Descendiendo";
    }
  };

  const getColorBadge = () => {
    if (porcentage >= 80) {
      return {
        bg: badgeColors[theme].max,
        text: theme === "dark" ? secondary : text,
      };
    }
    if (porcentage >= 65) {
      return {
        bg: badgeColors[theme].medium,
        text: theme === "dark" ? secondary : text,
      };
    }

    if (porcentage > 30 && porcentage < 65) {
      return {
        bg: badgeColors[theme].stable,
        text: theme === "dark" ? secondary : text,
      };
    }

    if (porcentage <= 20) {
      return {
        bg: badgeColors[theme].veryLow,
        text: theme === "dark" ? secondary : text,
      };
    }

    if (porcentage <= 30) {
      return {
        bg: badgeColors[theme].low,
        text: theme === "dark" ? secondary : text,
      };
    }
  };

  return (
    <View style={style}>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 8 }}>
        <ThemedText style={{ fontSize: 14 }}>Tu rendimiento actual</ThemedText>
        <ThemedText
          style={{
            backgroundColor: getColorBadge()?.bg,
            borderRadius: 100,
            paddingHorizontal: 10,
            color: getColorBadge()?.text,
            fontSize: 14,
          }}
        >
          {getMessageStatusProgres()}
        </ThemedText>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <View style={styles.type}>
          <Svg height="6" width="6" viewBox="0 0 30 30">
            <Circle
              cx="15"
              cy="15"
              r="15"
              strokeWidth="2.5"
              fill={badgeColors[theme].veryLow}
            />
          </Svg>

          <ThemedText style={styles.text}>Retroceso</ThemedText>
        </View>
        <View style={styles.type}>
          <Svg height="6" width="6" viewBox="0 0 30 30">
            <Circle
              cx="15"
              cy="15"
              r="15"
              strokeWidth="2.5"
              fill={badgeColors[theme].stable}
            />
          </Svg>

          <ThemedText style={styles.text}>Sin cambio</ThemedText>
        </View>
        <View style={styles.type}>
          <Svg height="6" width="6" viewBox="0 0 30 30">
            <Circle
              cx="15"
              cy="15"
              r="15"
              strokeWidth="2.5"
              fill={badgeColors[theme].max}
            />
          </Svg>

          <ThemedText style={styles.text}>Progreso</ThemedText>
        </View>
      </View>
      <LinearGradient
        colors={["#FF0000", "#FFFF00", "#00e606"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 100, height: 10, position: "relative" }}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        <Svg
          height="40"
          width="10"
          viewBox="0 0 40 40"
          style={{
            position: "absolute",
            transform: [{ translateY: -22 }],
            left: safeLeft,
          }}
        >
          <Rect
            x="10"
            y="10"
            width="10"
            height="80"
            fill={theme === "dark" ? "white" : "black"}
          />
        </Svg>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  type: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 14,
  },
});
