import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { Touchable } from "@/components/Touchable";
import { SettingsElement } from "@/components/SettingsElement";
import { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useHourToTrain } from "@/hooks/useHourToTrain";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabase";

export default function SettingsScreen() {
  const [show, setShow] = useState(false);

  const { setHourToTraining, hour } = useHourToTrain();
  const showPicker = () => {
    setShow(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ThemedView>
      <ThemedText
        type="subtitle"
        style={{ marginHorizontal: 12, marginBottom: 12 }}
      >
        Ajustes
      </ThemedText>
      <View style={{ marginHorizontal: 12, gap: 12 }}>
        <Link href="/personal/profile" asChild>
          <SettingsElement icon="person" title="Usuario" />
        </Link>

        <View>
          <SettingsElement
            icon="clock"
            title="Hora de entrenamiento"
            onPress={showPicker}
          />
          <ThemedText style={{ marginLeft: 26 }}>
            Actual: {hour.slice(0, 5)}
          </ThemedText>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={"time"}
            is24Hour={false}
            onChange={async (v: DateTimePickerEvent) => {
              if (v.type === "dismissed") return setShow(false);

              const date = new Date(v.nativeEvent.timestamp);
              const f = format(date, "hh:mm", { locale: es });

              setShow(false);
              setHourToTraining(f);
            }}
          />
        )}
      </View>

      <Touchable
        title="Cerrar sesión"
        type="danger"
        style={Styles.button}
        onPress={logout}
      />
    </ThemedView>
  );
}

const Styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  element: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
  },
});
