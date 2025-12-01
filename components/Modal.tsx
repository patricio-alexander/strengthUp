import { Modal as RNModal, ModalProps } from "react-native";
import { BlurView } from "expo-blur";
import { useColors } from "@/hooks/useColors";
import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useGradualKeyboardAnimation } from "@/hooks/useGradualKeyboardAnimation";

type CustomModalProps = ModalProps;

export const Modal = ({
  children,
  animationType = "fade",
  transparent = true,
  statusBarTranslucent = true,
  ...props
}: CustomModalProps) => {
  const { background } = useColors();
  const { height } = useGradualKeyboardAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  return (
    <RNModal
      {...props}
      statusBarTranslucent={statusBarTranslucent}
      transparent={transparent}
      animationType={animationType}
    >
      <BlurView
        tint="systemChromeMaterialDark"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        intensity={100}
      >
        <View
          style={{
            backgroundColor: background,
            margin: 10,
            borderRadius: 20,
            padding: 26,
            width: "80%",
          }}
        >
          {children}
        </View>
        <Animated.View style={keyboardPadding} />
      </BlurView>
    </RNModal>
  );
};
