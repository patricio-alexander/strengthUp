import { supabase } from "@/lib/supabase";
import { UserRepository } from "@features/user/domain/repositories/user-repository";
import { User } from "@features/user/domain/user-entity";

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
}
