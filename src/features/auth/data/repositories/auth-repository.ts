import { supabase } from "@/lib/supabase";
import { AuthRepository } from "../../domain/repositories/auth-repository";
import { AuthError, CodeErrors } from "../../domain/auth-error";

import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

export class AuthRepositoryImpl implements AuthRepository {
  async loginWithGoogle(): Promise<void> {
    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) {
      throw this.mapErrors(CodeErrors.INVALID_CREDENTIALS);
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.data.idToken,
    });

    if (error) {
      throw this.mapErrors(error.code);
    }
  }
  async logout(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      throw this.mapErrors(CodeErrors.ERROR_LOGOUT);
    }
  }

  private mapErrors(error: string) {
    const errorsCode: Record<string, { code: string; message: string }> = {
      invalid_credentials: {
        code: CodeErrors.INVALID_CREDENTIALS,
        message: "Credenciales invalidas",
      },
      email_exists: {
        code: CodeErrors.EMAIL_EXISTS,
        message: "Este correo ya existe",
      },
      email_address_invalid: {
        code: CodeErrors.EMAIL_INVALID,
        message: "Email invalido",
      },
      same_password: {
        code: CodeErrors.SAME_PASSWORD,
        message: "Use otra contraseña",
      },
    };

    const e = errorsCode[error];

    return new AuthError(e.message, e.code);
  }
}
