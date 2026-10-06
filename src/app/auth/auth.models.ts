export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface UsuarioToken {
  nome: string;
  roles: string[];
  expiraEM: Date;
}
