import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";

export const useHourToTrain = () => {
  const { user } = useUserStore();
  const [hour, setHour] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchHour = async () => {
    const { data } = await supabase
      .from("settings")
      .select("hour_to_train")
      .eq("user_id", user?.id)
      .single();

    setIsLoading(false);

    setHour(data?.hour_to_train.slice(0, 5));
  };

  useEffect(() => {
    fetchHour();
  }, []);

  const setHourToTraining = async (time: string) => {
    const { data, error } = await supabase
      .from("settings")
      .update({ hour_to_train: time })
      .eq("user_id", user?.id)
      .select("hour_to_train")
      .single();

    if (error) {
      alert(error.message);
      return;
    }
    setHour(data.hour_to_train);
  };

  return {
    setHourToTraining,
    hour,
    isLoading,
  };
};
