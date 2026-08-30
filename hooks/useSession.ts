import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { getUserByIdUseCase } from "@/src/di/container";
import { SplashScreen } from "expo-router";

export const useSession = () => {
  const { setUser, setSession } = useUserStore();
  const [isAppReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession({ session });

      if (session) {
        try {
          const user = await getUserByIdUseCase.get(session.user.id);
          setUser(user);
          setAppIsReady(true);
        } catch (error) {
          console.log(error);
        }
      }
      setAppIsReady(true);
      SplashScreen.hideAsync();
    };
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //console.log("Auth state changed:", { event: _event, session });
      setSession({ session });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAppReady };
};
