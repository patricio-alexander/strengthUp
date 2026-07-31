import { User } from "../user-entity";

export interface UserRepository {
  getUserById: (id: string) => Promise<User>;
}
