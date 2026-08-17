import { NotificationRespository } from "@features/notifications/domain/repositories/notification-repository";
export class CheckPushTokenUseCase {
  constructor(private notificationRepository: NotificationRespository) {}
  checkPushTokenExists(token: string): Promise<boolean> {
    return this.notificationRepository.checkPushTokenExists(token);
  }
}
