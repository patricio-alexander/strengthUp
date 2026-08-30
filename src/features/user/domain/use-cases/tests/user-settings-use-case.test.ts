import { UserRepository } from "../../repositories/user-repository";
import { UserSettings } from "../../user-entity";
import { UserSettingsUseCase } from "../user-settings";

describe("UserSettingsUseCase", () => {
  let mockedUserRepository: jest.Mocked<UserRepository>;
  let userSettingsUseCase: UserSettingsUseCase;

  beforeEach(() => {
    mockedUserRepository = {
      getUserById: jest.fn(),
      getUserSettings: jest.fn(),
    };

    userSettingsUseCase = new UserSettingsUseCase(mockedUserRepository);
  });
  it("devuelve las configuraciones del ususario", async () => {
    const userSettings: UserSettings = {
      hour_to_train: "19:20",
      userId: "1",
    };

    mockedUserRepository.getUserSettings.mockResolvedValue(userSettings);

    const result = await userSettingsUseCase.getUserSettings("1");

    expect(result).toEqual(userSettings);
    expect(mockedUserRepository.getUserSettings).toHaveBeenCalledWith("1");
  });
});
