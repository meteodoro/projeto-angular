import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';
import { API_URL } from '../api.config';
import { loginFalso } from './auth.mock';
import { LoginRequest, LoginResponse, UsuarioToken } from './auth.models';

// true = login de teste, sem API
const USAR_LOGIN_FAKE = true;

const CHAVE_TOKEN = 'solstice_token';

const CLAIM_ROLE_LONG = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_NAME_LONG = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

interface PayloadJwt {
  exp: number;
  unique_name?: string;
  name?: string;
  role?: string | string[];
  [CLAIM_ROLE_LONG]?: string | string[];
  [CLAIM_NAME_LONG]?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private token = signal<string | null>(localStorage.getItem(CHAVE_TOKEN));

  readonly usuario = computed(() => this.decodificar(this.token()));

  readonly logado = computed(() => {
    const u = this.usuario();
    return u !== null && u.expiraEM > new Date();
  });

  login(dados: LoginRequest) {
    const requisicao$ = USAR_LOGIN_FAKE
      ? loginFalso(dados)
      : this.http.post<LoginResponse>(`${API_URL}/auth/login`, dados);

    return requisicao$.pipe(tap((resposta) => this.salvarToken(resposta.token)));
  }

  logout() {
    localStorage.removeItem(CHAVE_TOKEN);
    this.token.set(null);
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return this.token();
  }

  private salvarToken(token: string) {
    localStorage.setItem(CHAVE_TOKEN, token);
    this.token.set(token);
  }

  private decodificar(token: string | null): UsuarioToken | null {
    if (!token) {
      return null;
    }

    try {
      const payload = jwtDecode<PayloadJwt>(token);
      const rolesBrutas = payload.role ?? payload[CLAIM_ROLE_LONG] ?? [];

      return {
        nome: payload.unique_name ?? payload.name ?? payload[CLAIM_NAME_LONG] ?? '',
        roles: Array.isArray(rolesBrutas) ? rolesBrutas : [rolesBrutas],
        expiraEM: new Date(payload.exp * 1000),
      };
    } catch {
      return null;
    }
  }
}