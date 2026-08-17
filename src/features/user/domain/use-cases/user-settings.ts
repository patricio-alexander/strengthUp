import { UserRepository } from "@features/user/domain/repositories/user-repository";

export class UserSettingsUseCase {
  constructor(private userRepository: UserRepository) {}

  async getUserSettings(userId: string) {
    return await this.userRepository.getUserSettings(userId);
  }
}
