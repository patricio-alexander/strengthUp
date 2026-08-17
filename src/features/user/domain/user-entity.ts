export enum Role {
  Personal = "personal",
  Personalized = "personalized",
  Coach = "coach",
}

//export type Role = "personal" | "personalized" | "coach" | null;

export type User = {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  role: Role;
};

export interface UserSettings {
  userId: string;
  hour_to_train: string;
}
