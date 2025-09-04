

export interface User {
  IdUsuario: number;
  CorreoElectronico: string;
  GoogleId: string | null;
  PersonaIdPersona: number;
  PsicologoIdPsicologo: number | null;
  TipoUsuarioIdTipoUsuario: number;
  Token: string | null;
  auth_method: 'local' | 'google' | string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}