export interface NotificationRespository {
  addPushToken(token: string, userId: string): Promise<void>;
  checkPushTokenExists(token: string): Promise<boolean>;
}
