import { supabase } from "@/lib/supabase";
import { NotificationRespository } from "@features/notifications/domain/repositories/notification-repository";

export class NotificationRespositoryImpl implements NotificationRespository {
  async addPushToken(token: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({ push_token: token })
      .eq("id", userId);

    if (error) {
      throw new Error(
        "Error al agregar el token de notificación: " + error.message,
      );
    }
  }
  async checkPushTokenExists(token: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("users")
      .select("push_token")
      .eq("push_token", token);

    if (error) {
      throw new Error(
        "Error al verificar la existencia del token de notificación: " +
          error.message,
      );
    }

    return data.length > 0;
  }
}
