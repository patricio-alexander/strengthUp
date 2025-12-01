import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { RoleCard } from "@/components/RoleCard";
import { useUserStore } from "@/store/userStore";
import { Redirect } from "expo-router";
import { Role } from "@/store/userStore";

export default function SelectAccount() {
  const { role } = useUserStore();

  if (role === Role.Coach) {
    return <Redirect href="/coach/(rooms)/home" />;
  }

  if (role === Role.Personalized) {
    return <Redirect href="/personalized/routine" />;
  }

  if (role === Role.Personal) {
    return <Redirect href="/personal" />;
  }

  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText type="subtitle">¡Bienvenido a StrengthUp! 💪🚀</ThemedText>
      <ThemedText type="defaultSemiBold">
        Establece tu tipo de cuenta
      </ThemedText>

      <View style={{ width: "100%", padding: 20, gap: 12 }}>
        <RoleCard
          disabled={true}
          role={Role.Coach}
          title="Entrenador"
          description="Administra a tus clientes, crea rutinas personalizadas y monitorea su progreso."
        />

        <RoleCard
          disabled={true}
          role={Role.Personalized}
          title="Asesorado"
          description="Accede a las rutinas asignadas por tu entrenador y sigue tu plan de entrenamiento."
        />

        <RoleCard
          role={Role.Personal}
          title="Usuario independiente"
          description="Arma tu rutina y visualiza cómo avanzas, con gráficas de rendimiento."
        />
      </View>
    </ThemedView>
  );
}
