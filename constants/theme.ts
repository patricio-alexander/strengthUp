import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const theme = {
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "rgb(30, 30, 42)",
      text: "rgb(246, 247, 249)",
    },
  },
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "rgb(246, 246, 249)",
      text: "rgb(30, 30, 42)",
    },
  },
};
