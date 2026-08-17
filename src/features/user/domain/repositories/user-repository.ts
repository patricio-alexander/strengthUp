import { User, UserSettings } from "../user-entity";

export interface UserRepository {
  getUserById: (id: string) => Promise<User>;
  getUserSettings: (userId: string) => Promise<UserSettings>;
}
