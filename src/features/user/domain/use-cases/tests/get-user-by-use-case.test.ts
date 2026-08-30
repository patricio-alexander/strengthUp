import { UserRepository } from "../../repositories/user-repository";
import { GetUserByIdUseCase } from "../get-user-by-id-use-case";
import { Role, User } from "../../user-entity";

describe("GetUserByUseCase", () => {
  let mockUserRepository: jest.Mocked<UserRepository>;

  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeEach(() => {
    mockUserRepository = {
      getUserById: jest.fn(),
      getUserSettings: jest.fn(),
    };
    getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepository);
  });

  it("esto debe rertonar el ususario al consulta al repositorio", async () => {
    const user: User = {
      id: "1",
      email: "test@test.com",
      username: "test",
      avatar_url: "https://test.com",
      role: Role.Personal,
    };

    mockUserRepository.getUserById.mockResolvedValue(user);

    const result = await getUserByIdUseCase.get("1");

    expect(result).toEqual(user);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith("1");
  });
});
