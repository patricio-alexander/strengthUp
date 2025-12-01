import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedView } from "@/components/ThemedView";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Keyboard } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Touchable } from "@/components/Touchable";
import { ThemedInput } from "@/components/ThemedInput";

import { PasswordInput } from "@/components/PasswordInput";
import { auth, firestore } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useColors } from "@/hooks/useColors";
import { Form } from "@/types/form";
import {
  FirebaseAuthErrorCode,
  firebaseAuthErros,
} from "@/constants/firebaseAuthErrors";

type SignUpForm = Form & {
  username: string;
  confirmPassword: string;
};

export default function SignUpCoachScreen() {
  const [form, setForm] = useState<SignUpForm>({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ message: string }>({ message: "" });
  const { tint, success, danger } = useColors();

  const hasInput = form.confirmPassword.length > 0;
  const isMatch = form.password === form.confirmPassword;
  const formCompleted =
    form.email && form.username && form.password && form.confirmPassword;

  const signUp = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      await setDoc(doc(firestore, "coachs", user.user.uid), {
        name: form.username,
        role: "coach",
      });
      setLoading(false);
    } catch (error: any) {
      const code = error.code as FirebaseAuthErrorCode;
      setErrors({ message: firebaseAuthErros[code] });
      setLoading(false);
    }
  };

  const handleChangeForm = (name: keyof SignUpForm, value: string) => {
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
      <NavigationHeader title="Registrarse como entrenador" />
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
            Usuario
          </ThemedText>
          <ThemedInput
            placeholder="user470"
            onChangeText={(value) => handleChangeForm("username", value)}
          />
        </View>

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
            onChangeText={(value) => handleChangeForm("password", value)}
          />
        </View>

        <View>
          <ThemedText type="defaultSemiBold" style={styles.input}>
            Confirmar contraseña
          </ThemedText>
          <PasswordInput
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
            onChangeText={(value) => handleChangeForm("confirmPassword", value)}
          />
        </View>

        {!loading ? (
          <Touchable
            title="Registrarse"
            onPress={signUp}
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
