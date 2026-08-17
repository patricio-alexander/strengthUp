import { supabase } from "@/lib/supabase";
import { UserRepository } from "@features/user/domain/repositories/user-repository";
import { User, UserSettings } from "@features/user/domain/user-entity";

export class UserRepositoryImpl implements UserRepository {
  async getUserById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }

    return {
      id: data.id,
      username: data.username,
      role: data.error,
      avatar_url: data.avatar_url,
      email: data.email,
    };
  }

  async getUserSettings(userId: string): Promise<UserSettings> {
    const { data, error } = await supabase
      .from("settings")
      .select()
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(
        `Error al obtener configuración de usuario: ${error.message}`,
      );
    }

    return {
      userId: data.user_id,
      hour_to_train: data.hour_to_train,
    };
  }
}
