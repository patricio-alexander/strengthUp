import { Alert } from "react-native";

export const isValidName = (text: string) => {
  if (/[\/\\]/.test(text)) {
    Alert.alert("Nombre inválido", "No se permiten '/' o '\\' en el nombre.");
    return false;
  }
  return true;
};
