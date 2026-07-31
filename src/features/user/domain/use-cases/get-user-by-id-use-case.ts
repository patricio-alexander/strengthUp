import { UserRepository } from "@features/user/domain/repositories/user-repository";
import { User } from "@features/user/domain/user-entity";

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async get(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }
}
