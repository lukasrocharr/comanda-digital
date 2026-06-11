import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from './services';

/** Libera as rotas /admin apenas para o administrador autenticado. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isAdmin) {
    return true;
  }

  toast.error('Acesso restrito ao administrador.');
  return router.createUrlTree(['/login']);
};
