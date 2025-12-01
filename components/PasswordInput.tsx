import { useState } from "react";
import { IconButton } from "./IconButton";
import { ThemedInput } from "./ThemedInput";
import { TextInputProps, View } from "react-native";

export const PasswordInput: React.FC<TextInputProps> = (props) => {
  const [show, setShow] = useState(true);

  return (
    <View style={{ position: "relative" }}>
      <ThemedInput {...props} secureTextEntry={show} />
      <IconButton
        name={show ? "eye" : "eye-closed"}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: [{ translateY: -22 }],
        }}
        onPress={() => setShow(!show)}
      />
    </View>
  );
};
