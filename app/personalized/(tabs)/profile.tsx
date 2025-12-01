import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Touchable } from "@/components/Touchable";
import { auth } from "@/firebaseConfig";
import { deleteUser, onAuthStateChanged } from "firebase/auth";
import { Link, router, useFocusEffect } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { firestore } from "@/firebaseConfig";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useColors } from "@/hooks/useColors";
import { IconButton } from "@/components/IconButton";

type Customer = {
  bodyStats: {
    age: number;
    height: number;
    weight: number;
  };
  username: string;
  role: string;
};

export default function ProfileCustomerPersonalizedScreen() {
  const [customerData, setCustomerData] = useState<Customer>();
  const [bodyStats, setBodyStats] = useState(false);
  const { secondary } = useColors();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      }
    });

    return unsubscribe; // cleanup
  }, []);

  const fetchUser = async () => {
    const docRef = doc(firestore, "customers", auth.currentUser?.uid as string);
    const personalized = await getDoc(docRef);
    if (!personalized.data()?.bodyStats) {
      setBodyStats(false);
      return;
    } else {
      setBodyStats(true);
      setCustomerData(personalized.data() as Customer);
    }
  };

  const deleteUserDataAndAccount = async () => {
    const user = auth?.currentUser;

    Alert.alert(
      "Eliminar cuenta",
      "¿Está seguro que desea eliminar la cuenta?",
      [
        {
          text: "Cancelar",
          onPress: () => {
            console.log("Cancelar");
          },
        },
        {
          text: "Aceptar",
          onPress: () => {
            deleteDoc(
              doc(firestore, "customers", auth.currentUser?.uid as string),
            )
              .then(() => deleteUser(user))
              .catch((e) => console.log(e));
          },
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  return (
    <ThemedView>
      <View style={styles.header}>
        <ThemedText type="subtitle">Perfil</ThemedText>
        <Touchable
          title="Cerrar sesión"
          type="shadow"
          onPress={() => auth.signOut()}
          icon="sign-out"
        />
      </View>

      {bodyStats && (
        <View
          style={{
            gap: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <ThemedText>{customerData?.username.toUpperCase()}</ThemedText>
            <Link
              href={{
                pathname: "/personalized/edit-profile/[id]",
                params: {
                  id: auth.currentUser?.uid ?? "",
                },
              }}
              asChild
            >
              <IconButton name="pencil" size={20} />
            </Link>
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <ThemedText
              style={{
                backgroundColor: secondary,
                borderRadius: 10,
                ...styles.label,
              }}
            >
              {customerData?.bodyStats.age} años
            </ThemedText>
            <ThemedText
              style={{
                backgroundColor: secondary,
                borderRadius: 10,
                ...styles.label,
              }}
            >
              {customerData?.bodyStats.weight} kg
            </ThemedText>
            <ThemedText
              style={{
                backgroundColor: secondary,
                borderRadius: 10,
                ...styles.label,
              }}
            >
              {customerData?.bodyStats.height} cm
            </ThemedText>
          </View>
        </View>
      )}

      {!bodyStats && (
        <ThemedText style={{ alignSelf: "center" }}>
          Al parecer no tines datos físicos por el momento
        </ThemedText>
      )}
      {/* <Touchable */}
      {/*   type="danger" */}
      {/*   title="Eliminar cuenta" */}
      {/*   style={{ marginTop: 20 }} */}
      {/*   onPress={deleteUserDataAndAccount} */}
      {/* /> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
