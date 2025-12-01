import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { useEffect, useState } from "react";
import { Touchable } from "@/components/Touchable";
import { PasswordInput } from "@/components/PasswordInput";
import { Form } from "@/types/form";
import {
  FirebaseAuthErrorCode,
  firebaseAuthErros,
} from "@/constants/firebaseAuthErrors";
import { auth, firestore } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useColors } from "@/hooks/useColors";

type SignUpPersonalized = Form & {
  username: string;
  confirmPassword: string;
};

export default function SignUpPersonalizedScreen() {
  const [form, setForm] = useState<SignUpPersonalized>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const { success, danger, tint } = useColors();

  const formCompleted =
    form.username && form.password && form.confirmPassword && form.email;
  const hasInput = form.confirmPassword.length > 0;
  const isMatch = form.password === form.confirmPassword;

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ message: string }>({ message: "" });

  const signUp = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      await setDoc(doc(firestore, "customers", user.user.uid), {
        username: form.username,
        role: "personalized",
      });
      setLoading(false);
    } catch (error: any) {
      const code = error.code as FirebaseAuthErrorCode;
      setErrors({ message: firebaseAuthErros[code] });
      setLoading(false);
    }
  };

  const handleChange = (name: keyof SignUpPersonalized, value: string) => {
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
      <NavigationHeader title="Crear cuenta como asesorado" />
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
            Nombre de usuario
          </ThemedText>
          <ThemedInput
            placeholder="user579"
            onChangeText={(email) => handleChange("username", email)}
          />
        </View>
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
            style={[
              !hasInput
                ? { borderColor: undefined, borderWidth: 0 }
                : isMatch
                  ? {
                      borderWidth: 1,
                      borderColor: success,
                    }
                  : {
                      borderWidth: 1,
                      borderColor: danger,
                    },
            ]}
          />
        </View>

        <View>
          <ThemedText style={styles.label} type="defaultSemiBold">
            Confirmar contraseña
          </ThemedText>
          <PasswordInput
            onChangeText={(confirmPassword) =>
              handleChange("confirmPassword", confirmPassword)
            }
            style={[
              !hasInput
                ? { borderColor: undefined, borderWidth: 0 }
                : isMatch
                  ? {
                      borderWidth: 1,
                      borderColor: success,
                    }
                  : {
                      borderWidth: 1,
                      borderColor: danger,
                    },
            ]}
          />
        </View>

        {!loading && (
          <Touchable
            title="Crear cuenta"
            onPress={signUp}
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
