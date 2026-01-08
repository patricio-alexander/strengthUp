import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, Dimensions, Image, StyleSheet } from "react-native";
import { useUserStore } from "@/store/userStore";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { View } from "react-native";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useColors } from "@/hooks/useColors";
import { GoogleButton } from "@/components/GoogleButton";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

/*
 
 Coordenadas para el linear gradient

(0,0) -------- (1,0)
  |              |
  |              |
  |              |
(0,1) -------- (1,1)
 
*/

export default function AuthScreen() {
  const { session } = useUserStore();
  const { setUser } = useUserStore();
  const { tint, primary } = useColors();
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
    <View style={{ flex: 1 }}>
      <Image
        source={require("../assets/images/pexels-leonmart-1552106.jpg")}
        style={{ width, height, ...StyleSheet.absoluteFillObject }}
      />
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height / 2,
        }}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 100,
          alignSelf: "center",
        }}
      >
        <ThemedText
          type="subtitle"
          style={{ marginBottom: 30, color: "white" }}
        >
          ¡Bienvenido a StrengthUp! 💪🚀
        </ThemedText>

        {loading ? (
          <ActivityIndicator size="large" color={tint} />
        ) : (
          <GoogleButton onPress={signIn} />
        )}
      </View>
    </View>
  );
}
