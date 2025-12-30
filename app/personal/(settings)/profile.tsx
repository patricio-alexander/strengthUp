import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUserStore } from "@/store/userStore";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { useState } from "react";
import { IconButton } from "@/components/IconButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Touchable } from "@/components/Touchable";
import { supabase } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const { tint } = useColors();
  const { user, setUser } = useUserStore();
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState("");
  const [success, setSuccess] = useState(false);
  const successColor = useThemeColor({}, "success");
  const [loading, setLoading] = useState(false);

  const changeUsername = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .update({ username: value })
      .eq("id", user?.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }
    setUser(data);
    setSuccess(true);
    setLoading(false);
  };

  return (
    <ThemedView>
      <NavigationHeader
        title="Usuario"
        headerRight={() =>
          !loading ? (
            edit && <IconButton name="check" onPress={() => changeUsername()} />
          ) : (
            <ActivityIndicator size="small" color={tint} />
          )
        }
      />
      <View style={styles.imageContainer}>
        <Image source={{ uri: user?.avatar_url }} style={{ flex: 1 }} />
      </View>
      <Touchable type="shadow" title="Cambiar foto" />
      <View style={styles.inputControl}>
        <ThemedText type="defaultSemiBold">Nombre de usuario</ThemedText>
        <ThemedInput
          defaultValue={user?.username}
          onChangeText={(e) => {
            setEdit(true);
            setValue(e);
          }}
        />
      </View>
      {success && (
        <ThemedText style={{ color: successColor, paddingHorizontal: 20 }}>
          Nombre de usuario actualizado con éxito
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputControl: {
    marginHorizontal: 20,
  },
  imageContainer: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 12,
  },
});
