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
    max: {
      bg: "rgba(0, 230, 6, 0.15)",
      text: "#00a304",
    },
    medium: {
      bg: "rgba(134, 239, 172, 0.25)",
      text: "#15803d",
    },
    stable: {
      bg: "rgba(255, 255, 0, 0.25)",
      text: "#9a8f00",
    },
    low: {
      bg: "rgba(255, 199, 199, 0.35)",
      text: "#b91c1c",
    },
    veryLow: {
      bg: "rgba(255, 87, 87, 0.35)",
      text: "#991b1b",
    },
  },

  dark: {
    max: {
      bg: "rgba(0, 230, 6, 0.18)",
      text: "#22c55e",
    },
    medium: {
      bg: "rgba(191, 255, 80, 0.2)",
      text: "#a3e635",
    },
    stable: {
      bg: "rgba(255, 255, 0, 0.2)",
      text: "#fde047",
    },
    low: {
      bg: "rgba(255, 178, 50, 0.25)",
      text: "#f59e0b",
    },
    veryLow: {
      bg: "rgba(255, 87, 87, 0.25)",
      text: "#ef4444",
    },
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
      return "EXCELENTE";
    }
    if (porcentage > 50) {
      return "AVANZANDO";
    }
    if (porcentage > 30 && porcentage <= 50) {
      return "ESTABLE";
    }
    if (porcentage <= 20) {
      return "NECESITA ATENCION";
    }

    if (porcentage <= 30) {
      return "DESCENDIENDO";
    }
  };

  const getColorBadge = () => {
    if (porcentage >= 80) {
      return {
        bg: badgeColors[theme].max.bg,
        text: badgeColors[theme].max.text,
      };
    }
    if (porcentage >= 65) {
      return {
        bg: badgeColors[theme].medium.bg,
        text: badgeColors[theme].medium.text,
      };
    }

    if (porcentage > 30 && porcentage < 65) {
      return {
        bg: badgeColors[theme].stable.bg,
        text: badgeColors[theme].stable.text,
      };
    }

    if (porcentage <= 20) {
      return {
        bg: badgeColors[theme].veryLow.bg,
        text: badgeColors[theme].veryLow.text,
      };
    }

    if (porcentage <= 30) {
      return {
        bg: badgeColors[theme].low.bg,
        text: badgeColors[theme].low.text,
      };
    }
  };

  return (
    <View style={style}>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 8 }}>
        <ThemedText style={{ fontSize: 14 }}>Estado actual:</ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={{
            backgroundColor: getColorBadge()?.bg,
            borderRadius: 10,
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
          marginBottom: 16,
        }}
      >
        <View style={styles.type}>
          <Svg height="6" width="6" viewBox="0 0 30 30">
            <Circle
              cx="15"
              cy="15"
              r="15"
              strokeWidth="2.5"
              fill={badgeColors[theme].veryLow.text}
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
              fill={badgeColors[theme].stable.text}
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
              fill={badgeColors[theme].max.text}
            />
          </Svg>

          <ThemedText style={styles.text}>Progreso</ThemedText>
        </View>
      </View>
      <LinearGradient
        colors={["#ff4d4d", "#ffcc00", "#00e676"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 100, height: 6, position: "relative" }}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        <Svg
          height="30"
          width="20"
          viewBox="0 0 40 40"
          style={{
            position: "absolute",
            transform: [{ translateY: -18 }],
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
