import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import Purchases from "react-native-purchases";
import { CustomerInfo } from "react-native-purchases";
import { Alert, StyleSheet } from "react-native";
import { View } from "react-native";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Touchable } from "@/components/Touchable";
import { useUserStore } from "@/store/userStore";
import Paywall from "react-native-purchases-ui";
import { NavigationHeader } from "@/components/NavigationHeader";

export default function StateSubScreen() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();
  const [date, setDate] = useState("");
  const { setIsPremium } = useUserStore();

  const restorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();
      setCustomerInfo(restore);
      setIsPremium({
        premium: typeof restore.entitlements.active["premium"] !== "undefined",
      });
    } catch (e) {
      Alert.alert("Error Purchases", JSON.stringify(e), [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  useEffect(() => {
    const stateSub = async () => {
      const customer = await Purchases.getCustomerInfo();
      setCustomerInfo(customer);

      if (typeof customer?.entitlements.active["premium"] !== "undefined") {
        const d = format(
          new Date(
            customer?.entitlements.active["premium"].expirationDate as string,
          ),
          "MMM dd, yyyy h:m:s aaa",
          {
            locale: es,
          },
        );

        setDate(d);
        return;
      }

      setDate("---");
    };

    stateSub();
    const customerInfoUpdated = (customerInfo: any) => {
      const isUserPremium =
        typeof customerInfo?.entitlements.active["premium"] !== "undefined";
      setIsPremium({ premium: isUserPremium });
      setCustomerInfo(customerInfo);
      const d = format(
        new Date(
          customerInfo?.entitlements.active["premium"].expirationDate as string,
        ),
        "MMM dd, yyyy h:m:s aaa",
        {
          locale: es,
        },
      );

      setDate(d);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, []);
  return (
    <ThemedView>
      <NavigationHeader title="Estado de la subscripción" />
      <View style={Style.container}>
        <View style={Style.box}>
          <ThemedText type="defaultSemiBold">Usuario ID</ThemedText>
          <ThemedText>{customerInfo?.originalAppUserId}</ThemedText>
        </View>
        <View style={Style.box}>
          <ThemedText type="defaultSemiBold">Plan Actual</ThemedText>
          <ThemedText>
            {typeof customerInfo?.entitlements.active["premium"] !== "undefined"
              ? "Premium"
              : "Básico"}
          </ThemedText>
        </View>
        <View style={Style.box}>
          <ThemedText type="defaultSemiBold"> Expiracion</ThemedText>
          <ThemedText>{date}</ThemedText>
        </View>

        {!customerInfo?.entitlements.active["premium"] && (
          <Touchable
            title="Subscribirme"
            onPress={() => Paywall.presentPaywall()}
          />
        )}

        <Touchable title="Restaurar compras" onPress={restorePurchases} />
      </View>
    </ThemedView>
  );
}

const Style = StyleSheet.create({
  box: {
    marginBottom: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
