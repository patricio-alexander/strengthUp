import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, Keyboard, View } from "react-native";
import { useUserStore } from "@/store/userStore";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useColors } from "@/hooks/useColors";

export default function AuthScreen() {
  const { session } = useUserStore();
  const { setUser } = useUserStore();
  const { tint } = useColors();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_CLIENT_ID_WEB,
    });
  }, []);

  if (session) {
    return <Redirect href={{ pathname: "/personal" }} />;
  }

  const signIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const {
          data: { session: remoteSession },
          error,
        } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken,
        });
        if (remoteSession) {
          const { data: user } = await supabase
            .from("users")
            .select()
            .eq("id", remoteSession.user.id)
            .single();
          setUser(user);
        }

        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      if (error.code === statusCodes.IN_PROGRESS) {
        console.error("Login ya en progreso");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error("Google Play Services no disponible");
      } else {
        console.error("Google login error:", error);
      }
    }
  };

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
        ¡Bienvenido a StrengthUp! 💪🚀
      </ThemedText>
      {loading ? (
        <ActivityIndicator size="large" color={tint} />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      )}
    </ThemedView>
  );
}
