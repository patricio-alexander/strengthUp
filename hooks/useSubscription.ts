import { useEffect } from "react";
import Purchases from "react-native-purchases";

import { useUserStore } from "@/store/userStore";

export const useSubscription = () => {
  const { setIsPremium } = useUserStore();

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    Purchases.configure({
      apiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string,
    });

    const checkSubscription = async () => {
      const customer = await Purchases.getCustomerInfo();
      const premiumOrNo =
        customer?.entitlements.active["premium"] !== undefined;

      setIsPremium({ premium: premiumOrNo });
    };

    checkSubscription();
  }, []);
};
