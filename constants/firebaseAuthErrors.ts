export const firebaseAuthErros: Record<string, string> = {
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/email-already-in-use": "Este correo ya está registrado.",
  "auth/invalid-email": "El correo no es válido.",
  "auth/invalid-credential": "Credenciales incorrectas",
  "auth/user-not-found": "El usuario no existe",
  "auth/wrong-password": "Contraseña incorrecta",
};

export type FirebaseAuthErrorCode = keyof typeof firebaseAuthErros;
