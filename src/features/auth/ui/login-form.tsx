import { Image, View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { useUserStore } from "@/store/userStore";
import { Redirect } from "expo-router";
import { GoogleButton } from "@/components/GoogleButton";
const { height } = Dimensions.get("window");
import { useLoginWithGoogle } from "./viewmodel/useLoginWithGoogle";
/*
 
 Coordenadas para el linear gradient

(0,0) -------- (1,0)
  |              |
  |              |
  |              |
(0,1) -------- (1,1)
 
*/

export default function LoginForm() {
  const { session } = useUserStore();
  const { error, signIn } = useLoginWithGoogle();

  if (session) {
    return <Redirect href={{ pathname: "/personal" }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("@/assets/images/pexels-leonmart-1552106.jpg")}
        style={styles.image}
      />
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />
      <View style={styles.wrapperAuth}>
        {error && <ThemedText type="error">{error}</ThemedText>}
        <ThemedText type="subtitle" style={styles.text}>
          ¡Bienvenido a StrengthUp! 💪🚀
        </ThemedText>
        <GoogleButton onPress={signIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height,
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 2,
  },

  wrapperAuth: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
  },
  text: { marginBottom: 30, color: "white" },
});
