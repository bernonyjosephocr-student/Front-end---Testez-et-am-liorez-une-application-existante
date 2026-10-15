import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  //If No token is found, redirect to login page
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // Token is found, check if it is expired
  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = JSON.parse(atob(parts[1]));

    // JWT expiry is expressed in seconds; So, using Date.now().
    if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem('authToken');
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch {
    localStorage.removeItem('authToken');
    return router.createUrlTree(['/login']);
  }
};