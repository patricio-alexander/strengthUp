import { AuthRepository } from "@features/auth/domain/repositories/auth-repository";

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async loginWithGoogle(): Promise<void> {
    await this.authRepository.loginWithGoogle();
  }
}
