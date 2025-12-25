import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Keyboard, View } from "react-native";
import { useUserStore } from "@/store/userStore";
import { Link, Redirect } from "expo-router";
import { ThemedInput } from "@/components/ThemedInput";
import { Touchable } from "@/components/Touchable";
import { useEffect, useState } from "react";
import { Form } from "@/types/form";
import { supabase } from "@/lib/supabase";

export default function AuthScreen() {
  const { session } = useUserStore();
  const [form, setForm] = useState<Form>({ email: "", password: "" });
  const [errors, setErrors] = useState<{ message: string }>({ message: "" });

  useEffect(() => {
    const id = setTimeout(() => {
      setErrors({ message: "" });
    }, 5000);
    return () => clearTimeout(id);
  }, [errors]);

  const signIn = async () => {
    Keyboard.dismiss();

    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) {
      alert(error?.message);
    }
  };

  const handleChangeForm = (name: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (session) {
    console.log("redirect");
    return <Redirect href={{ pathname: "/personal" }} />;
  }

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
        ¡Bienvenido a Heavy Up! 💪🚀
      </ThemedText>
      <ThemedText type="defaultSemiBold">
        Coloque las credenciales para continuar
      </ThemedText>

      <View style={{ width: "100%", padding: 20, gap: 12 }}>
        <ThemedText>Correo</ThemedText>
        <ThemedInput
          onChangeText={(value) => handleChangeForm("email", value)}
        />
        <ThemedText>Contraseña</ThemedText>
        <ThemedInput
          onChangeText={(value) => handleChangeForm("password", value)}
        />
        <Link
          href={{ pathname: "/signup" }}
          asChild
          style={{ alignSelf: "flex-end" }}
        >
          <ThemedText>Registrarse</ThemedText>
        </Link>
        <Touchable title="Entrar" onPress={signIn} />
      </View>
    </ThemedView>
  );
}
