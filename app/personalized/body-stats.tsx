import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { auth, firestore } from "@/firebaseConfig";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type BodyStatsForm = {
  weight: string;
  height: string;
  age: string;
};

export default function BodyStatsScreen() {
  const [loading, setLoading] = useState(false);
  const { tint } = useColors();
  const [form, setForm] = useState({
    weight: "",
    height: "",
    age: "",
  });

  const formCompleted = form.age && form.weight && form.height;

  const handleChange = (name: keyof BodyStatsForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = async () => {
    try {
      setLoading(true);
      const customerRef = doc(
        firestore,
        "customers",
        auth.currentUser?.uid as string,
      );
      await updateDoc(customerRef, {
        bodyStats: {
          weight: Number(form.weight.replace(",", ".")),
          height: Number(form.height.replace(",", ".")),
          age: Number(form.age.replace(",", ".")),
        },
      });
      setLoading(false);
      router.back();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <ThemedView>
      <NavigationHeader title="Datos físicos" />
      <View style={styles.form}>
        <View>
          <ThemedText style={styles.label}>Peso (kg)</ThemedText>
          <ThemedInput
            onChangeText={(weight) => handleChange("weight", weight)}
            keyboardType="decimal-pad"
          />
        </View>

        <View>
          <ThemedText style={styles.label}>Altura (cm)</ThemedText>
          <ThemedInput
            onChangeText={(height) => handleChange("height", height)}
            keyboardType="decimal-pad"
          />
        </View>

        <View>
          <ThemedText style={styles.label}>Edad</ThemedText>
          <ThemedInput
            onChangeText={(age) => handleChange("age", age)}
            keyboardType="number-pad"
          />
        </View>
        {loading && <ActivityIndicator size="large" color={tint} />}
        {!loading && (
          <Touchable title="Guardar" onPress={save} disabled={!formCompleted} />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 12,
    gap: 12,
  },
  label: {
    marginBottom: 4,
  },
});
