import { NavigationHeader } from "@/components/NavigationHeader";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { firestore } from "@/firebaseConfig";
import { useColors } from "@/hooks/useColors";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, View } from "react-native";

type EditForm = {
  age: string;
  height: string;
  weight: string;
  username: string;
};

export default function EditProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { tint } = useColors();
  const [customer, setCustomer] = useState<EditForm>({
    age: "",
    height: "",
    weight: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const ref = doc(firestore, "customers", id);
      const customerFirestore = await getDoc(ref);
      setCustomer({
        age: customerFirestore.data()?.bodyStats?.age?.toString(),
        weight: customerFirestore.data()?.bodyStats?.weight?.toString(),
        height: customerFirestore.data()?.bodyStats?.height?.toString(),
        username: customerFirestore.data()?.username,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (name: keyof EditForm, value: string) => {
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const formCompleted =
    customer?.age && customer?.weight && customer?.height && customer?.username;

  const save = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      const ref = doc(firestore, "customers", id);

      await updateDoc(ref, {
        username: customer.username,
        bodyStats: {
          weight: Number(customer.weight.replace(",", ".")),
          height: Number(customer.height.replace(",", ".")),
          age: Number(customer.age.replace(",", ".")),
        },
      });
      setLoading(false);
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedView>
      <NavigationHeader
        title="Editar perfil"
        headerRight={() =>
          formCompleted && (
            <>
              {loading ? (
                <ActivityIndicator size="small" color={tint} />
              ) : (
                <Touchable title="Guardar" type="shadow" onPress={save} />
              )}
            </>
          )
        }
      />
      <View style={styles.form}>
        <View>
          <ThemedText>Nombres</ThemedText>
          <ThemedInput
            value={customer?.username}
            onChangeText={(value) => handleChange("username", value)}
          />
        </View>
        <View>
          <ThemedText>Peso (kg)</ThemedText>
          <ThemedInput
            value={customer?.weight}
            onChangeText={(value) => handleChange("weight", value)}
          />
        </View>
        <View>
          <ThemedText>Altura</ThemedText>
          <ThemedInput
            value={customer?.height}
            onChangeText={(value) => handleChange("height", value)}
          />
        </View>
        <View>
          <ThemedText>Edad</ThemedText>
          <ThemedInput
            value={customer?.age}
            onChangeText={(value) => handleChange("age", value)}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 12,
    gap: 12,
  },
});
