import React, { useEffect, useState } from "react";

import {
  View,
  Pressable,
  Dimensions,
  StyleSheet,
  useColorScheme,
  Keyboard,
} from "react-native";
import { NavigationIcon } from "./NavigationIcon";
import { Colors } from "@/constants/Colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { ThemedText } from "./ThemedText";

const { width } = Dimensions.get("window");

const TabBar = ({ state, descriptors, navigation }: any) => {
  const { secondary, primary } = useColors();

  const [keyboardShow, setKeyboardShow] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShow(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShow(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={{
        ...styles.mainContainer,
        display: keyboardShow ? "none" : "flex",
        backgroundColor: secondary,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const scale = useSharedValue(1);

        useEffect(() => {
          scale.value = withTiming(isFocused ? 1.2 : 1, { duration: 200 });
        }, [isFocused]);

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
        }));

        return (
          <View key={index} style={[styles.mainItemContainer]}>
            <Pressable
              onPress={onPress}
              style={{
                backgroundColor: isFocused ? primary : secondary,
                borderRadius: 100,
                marginVertical: 2,
              }}
            >
              <Animated.View
                style={[
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    padding: 14,
                  },
                  animatedStyle,
                ]}
              >
                <NavigationIcon route={label} isFocused={isFocused} />
              </Animated.View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
  },
  mainItemContainer: {
    flex: 1,
    alignItems: "center",
    marginVertical: 3,
    borderRadius: 1,
    borderColor: "#333B42",
  },
});

export default TabBar;
