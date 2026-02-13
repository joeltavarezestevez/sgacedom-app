import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLogged = await authService.isAuthenticated();

  return isLogged
    ? true
    : router.createUrlTree(['/login']);
};
