import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, useColorScheme, View, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

type LevelProgressBarProps = ViewProps & {
  value: number;
};

type StatusKey = "max" | "medium" | "stable" | "low" | "veryLow";

const MARKER_SIZE = 18;
const TRACK_HEIGHT = 10;

const badgeColors = {
  light: {
    max: { bg: "rgba(0, 230, 6, 0.15)", text: "#00a304" },
    medium: { bg: "rgba(134, 239, 172, 0.25)", text: "#15803d" },
    stable: { bg: "rgba(255, 255, 0, 0.25)", text: "#9a8f00" },
    low: { bg: "rgba(255, 199, 199, 0.35)", text: "#b91c1c" },
    veryLow: { bg: "rgba(255, 87, 87, 0.35)", text: "#991b1b" },
  },
  dark: {
    max: { bg: "rgba(0, 230, 6, 0.18)", text: "#22c55e" },
    medium: { bg: "rgba(191, 255, 80, 0.2)", text: "#a3e635" },
    stable: { bg: "rgba(255, 255, 0, 0.2)", text: "#fde047" },
    low: { bg: "rgba(255, 178, 50, 0.25)", text: "#f59e0b" },
    veryLow: { bg: "rgba(255, 87, 87, 0.25)", text: "#ef4444" },
  },
} as const;

const getStatus = (
  percentage: number,
): { key: StatusKey; label: string } => {
  if (percentage >= 80) return { key: "max", label: "EXCELENTE" };
  if (percentage > 55) return { key: "medium", label: "AVANZANDO" };
  if (percentage >= 45) return { key: "stable", label: "ESTABLE" };
  if (percentage > 20) return { key: "low", label: "DESCENDIENDO" };
  return { key: "veryLow", label: "NECESITA ATENCIÓN" };
};

const formatDelta = (value: number) => {
  const pct = Math.round(value * 100);
  if (pct === 0) return "0%";
  return pct > 0 ? `+${pct}%` : `${pct}%`;
};

export const LevelProgressBar = ({ value, style }: LevelProgressBarProps) => {
  const { text } = useColors();
  const theme = useColorScheme() ?? "light";

  const x = Math.max(-1, Math.min(1, value));
  const percentage = ((x + 1) / 2) * 100;
  const { key, label } = getStatus(percentage);
  const badge = badgeColors[theme][key];

  const trackWidth = useSharedValue(0);
  const progress = useSharedValue(0.5);

  useEffect(() => {
    progress.value = withSpring(percentage / 100, {
      damping: 16,
      stiffness: 140,
      mass: 0.6,
    });
  }, [percentage, progress]);

  const markerStyle = useAnimatedStyle(() => {
    const maxX = Math.max(trackWidth.value - MARKER_SIZE, 0);
    const nextX = progress.value * trackWidth.value - MARKER_SIZE / 2;

    return {
      transform: [{ translateX: Math.min(Math.max(nextX, 0), maxX) }],
    };
  });

  return (
    <View
      style={style}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: -100,
        max: 100,
        now: Math.round(x * 100),
        text: `${label}, ${formatDelta(x)}`,
      }}
    >
      <View style={styles.header}>
        <ThemedText style={styles.headerLabel}>Estado actual</ThemedText>
        <View style={styles.headerMeta}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.delta,
              { color: badge.text },
            ]}
          >
            {formatDelta(x)}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.badgeText, { color: badge.text }]}
            >
              {label}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.trackWrap}>
        <LinearGradient
          colors={["#ef4444", "#eab308", "#22c55e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.track}
          onLayout={(e) => {
            trackWidth.value = e.nativeEvent.layout.width;
          }}
        />
        <View
          pointerEvents="none"
          style={[styles.centerTick, { backgroundColor: text }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.marker,
            {
              backgroundColor: badge.text,
              borderColor: theme === "dark" ? "#1b1b27" : "#f6f6f9",
            },
            markerStyle,
          ]}
        />
      </View>

      <View style={styles.legend}>
        <LegendDot
          color={badgeColors[theme].veryLow.text}
          label="Retroceso"
        />
        <LegendDot
          color={badgeColors[theme].stable.text}
          label="Sin cambio"
        />
        <LegendDot color={badgeColors[theme].max.text} label="Progreso" />
      </View>
    </View>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <ThemedText style={styles.legendText}>{label}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 14,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  delta: {
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  trackWrap: {
    height: MARKER_SIZE,
    justifyContent: "center",
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: 100,
  },
  centerTick: {
    position: "absolute",
    alignSelf: "center",
    width: 2,
    height: 14,
    borderRadius: 1,
    opacity: 0.28,
  },
  marker: {
    position: "absolute",
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: 3,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
});
