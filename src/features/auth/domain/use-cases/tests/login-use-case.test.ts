import { AuthRepository } from "../../repositories/auth-repository";
import { LoginUseCase } from "../login-use-case";

describe("LoginUseCase", () => {
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      loginWithGoogle: jest.fn(),
      logout: jest.fn(),
    };
    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  it("delega el login con Google al repositorio", async () => {
    mockAuthRepository.loginWithGoogle.mockResolvedValue();

    await loginUseCase.loginWithGoogle();

    expect(mockAuthRepository.loginWithGoogle).toHaveBeenCalledTimes(1);
  });

  it("propaga el error si el repositorio falla", async () => {
    mockAuthRepository.loginWithGoogle.mockRejectedValue(
      new Error("credenciales invalidas"),
    );

    await expect(loginUseCase.loginWithGoogle()).rejects.toThrow(
      "credenciales invalidas",
    );
  });
});
