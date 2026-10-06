import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api.config';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const token = auth.getToken();
  const ehNossa = req.url.startsWith(API_URL);

  // Só anexa o token em requisições para a nossa API
  const requisicao =
    token && ehNossa ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      const ehLogin = req.url.endsWith('/auth/login');

      // 401 fora do login = token inválido ou expirado
      if (erro.status === 401 && !ehLogin) {
        auth.logout();
      }

      return throwError(() => erro);
    }),
  );
};
