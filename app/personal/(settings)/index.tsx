import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";
import { Link, router } from "expo-router";
import { Touchable } from "@/components/Touchable";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useUserStore } from "@/store/userStore";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsElement } from "@/components/SettingsElement";
import { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useHourToTrain } from "@/hooks/useHourToTrain";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import { supabase } from "@/lib/supabase";

export default function SettingsScreen() {
  const { sendInstantNotification } = useAppNotifications();
  const [show, setShow] = useState(false);
  const { existHour, setHourToTraining, hour } = useHourToTrain();
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

        {existHour && (
          <View>
            <SettingsElement
              icon="clock"
              title="Hora de entrenamiento"
              onPress={showPicker}
            />
            <ThemedText style={{ marginLeft: 26 }}>
              Actual: {format(new Date(hour), "hh:mm aaa", { locale: es })}
            </ThemedText>
          </View>
        )}

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={"time"}
            is24Hour={false}
            onChange={async (v: DateTimePickerEvent) => {
              if (v.type === "dismissed") return setShow(false);

              const date = new Date(Number(v.nativeEvent.timestamp));
              date.setDate(date.getDate() + 1);
              setShow(false);
              setHourToTraining(v);
              await sendInstantNotification({
                title: "Enhorabuena 🎉",
                body: "Tu notificación ha sido programada para mañana.",
              });

              // TODO: consultar que ejericio le toca el dia siguiente para poder notificar
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
