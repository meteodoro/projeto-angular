import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.logado()) {
    return true;
  }

  // Manda para o login e guarda a página que a pessoa queria acessar
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
