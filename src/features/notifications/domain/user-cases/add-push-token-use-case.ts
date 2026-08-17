import { NotificationRespository } from "@features/notifications/domain/repositories/notification-repository";

export class AddPushTokenUseCase {
  constructor(private notificationRepository: NotificationRespository) {}

  async addPushToken(token: string, userId: string): Promise<void> {
    await this.notificationRepository.addPushToken(token, userId);
  }
}
