import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { useEffect, useState } from "react";
import { Touchable } from "@/components/Touchable";
import { PasswordInput } from "@/components/PasswordInput";
import { Form } from "@/types/form";
import { Link, router } from "expo-router";
import {
  FirebaseAuthErrorCode,
  firebaseAuthErros,
} from "@/constants/firebaseAuthErrors";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useColors } from "@/hooks/useColors";

export default function SignUpPersonalizedScreen() {
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
  });

  const formCompleted = form.password && form.email;

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ message: string }>({ message: "" });
  const { tint, text, danger } = useColors();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/personalized/routines");
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);

      setLoading(false);
    } catch (error: any) {
      const code = error.code as FirebaseAuthErrorCode;
      setErrors({ message: firebaseAuthErros[code] });
      setLoading(false);
    }
  };

  const handleChange = (name: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setErrors({ message: "" });
    }, 5000);

    return () => clearTimeout(id);
  }, [errors]);

  return (
    <ThemedView>
      <NavigationHeader title="Acceder como asesorado" />
      <View style={styles.container}>
        {errors.message && (
          <View style={{ alignSelf: "center" }}>
            <ThemedText darkColor={danger} lightColor={danger}>
              {errors.message}
            </ThemedText>
          </View>
        )}

        <View>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Correo electrónico
          </ThemedText>
          <ThemedInput
            placeholder="example@gmail.com"
            onChangeText={(email) => handleChange("email", email)}
          />
        </View>
        <View>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Contraseña
          </ThemedText>
          <PasswordInput
            onChangeText={(password) => handleChange("password", password)}
          />
        </View>
        <View style={{ alignSelf: "flex-end" }}>
          <Link
            href="/signup-personalized"
            style={{
              color: text,

              fontFamily: "Inter_400Regular",
              fontSize: 16,
            }}
          >
            Registrarse
          </Link>
        </View>

        {!loading && (
          <Touchable
            title="Iniciar sesión"
            onPress={signIn}
            disabled={!formCompleted}
          />
        )}
        {loading && <ActivityIndicator size="large" color={tint} />}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  container: {
    gap: 12,
    marginHorizontal: 12,
  },
});
