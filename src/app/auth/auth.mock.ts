import { HttpErrorResponse } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { LoginRequest, LoginResponse } from './auth.models';

// SÓ PARA TESTE
const USUARIOS_TESTE = [
  { email: 'admin@solstice.com', senha: 'admin123', nome: 'Admin', roles: ['Admin'] },
  { email: 'cliente@solstice.com', senha: 'cliente123', nome: 'Cliente Teste', roles: ['Cliente'] },
];

function paraBase64Url(objeto: object): string {
  const bytes = new TextEncoder().encode(JSON.stringify(objeto));
  let binario = '';
  bytes.forEach((b) => (binario += String.fromCharCode(b)));

  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function loginFalso(dados: LoginRequest): Observable<LoginResponse> {
  const usuario = USUARIOS_TESTE.find(
    (u) => u.email === dados.email.trim().toLowerCase() && u.senha === dados.senha,
  );

  if (!usuario) {
    return throwError(() => new HttpErrorResponse({ status: 401 })).pipe(delay(500));
  }

  const payload = {
    unique_name: usuario.nome,
    role: usuario.roles,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, 
  };

  // Token sem assinatura de verdade: o jwtDecode só lê o conteúdo, não valida
  const token = `${paraBase64Url({ alg: 'none', typ: 'JWT' })}.${paraBase64Url(payload)}.assinatura-falsa`;

  return of({ token }).pipe(delay(500));
}
