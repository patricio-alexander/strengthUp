export interface AuthRepository {
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
}
