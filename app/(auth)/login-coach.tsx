import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { useEffect, useState } from "react";
import { Touchable } from "@/components/Touchable";
import { PasswordInput } from "@/components/PasswordInput";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { Link, router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { Form } from "@/types/form";
import {
  FirebaseAuthErrorCode,
  firebaseAuthErros,
} from "@/constants/firebaseAuthErrors";

export default function LoginCoach() {
  const [form, setForm] = useState<Form>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { tint, text, danger } = useColors();
  const [errors, setErrors] = useState({ message: "" });
  const formCompleted = form.email && form.password;

  const signIn = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
    } catch (error: any) {
      const code = error.code as FirebaseAuthErrorCode;
      setErrors({ message: firebaseAuthErros[code] });
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setErrors({ message: "" });
    }, 5000);
    return () => clearTimeout(id);
  }, [errors]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/coach/home");
      }
    });

    return unsubscribe;
  }, []);

  const handleChangeForm = (name: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ThemedView>
      <NavigationHeader title="Acceso para entrenadores" />
      <View style={styles.container}>
        {errors.message && (
          <View style={{ alignSelf: "center" }}>
            <ThemedText darkColor={danger} lightColor={danger}>
              {errors.message}
            </ThemedText>
          </View>
        )}

        <View>
          <ThemedText type="defaultSemiBold" style={styles.input}>
            Correo electrónico
          </ThemedText>
          <ThemedInput
            placeholder="example@gmail.com"
            onChangeText={(value) => handleChangeForm("email", value)}
          />
        </View>

        <View>
          <ThemedText type="defaultSemiBold" style={styles.input}>
            Contraseña
          </ThemedText>
          <PasswordInput
            onChangeText={(value) => handleChangeForm("password", value)}
          />
        </View>

        <View style={{ alignSelf: "flex-end" }}>
          <Link
            href="/signup-coach"
            style={{
              color: text,

              fontFamily: "Inter_400Regular",
              fontSize: 16,
            }}
          >
            Registrarse
          </Link>
        </View>

        {!loading ? (
          <Touchable
            title="Iniciar sesión"
            onPress={signIn}
            disabled={!formCompleted}
          />
        ) : (
          <ActivityIndicator color={tint} size={"large"} />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 4,
  },
  container: {
    gap: 12,
    marginHorizontal: 12,
  },
});
