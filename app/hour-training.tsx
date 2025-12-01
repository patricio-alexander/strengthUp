import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";

export default function HourTrainingScreen() {
  const [show, setShow] = useState(false);

  const showPicker = () => {
    setShow(true);
  };

  return (
    <ThemedView>
      <NavigationHeader title="Establece tu hora de entramiento" />
      <Touchable title="Elije la hora" onPress={showPicker} />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={"time"}
          is24Hour={true}
          onChange={(v: DateTimePickerEvent) => {
            console.log(v);
          }}
        />
      )}
    </ThemedView>
  );
}
