import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');

  // Attatch the token for the following paths
  const isBackendRequest =
    req.url.startsWith('http://localhost:8080/api/') ||
    req.url.startsWith('http://localhost:4200/api/') ||
    req.url.startsWith('/api/');

  // Do not attatch the token for the following paths
  const isPublicEndpoint =
    req.url.endsWith('/api/login') ||
    req.url.endsWith('/api/register');

  if (!token || !isBackendRequest || isPublicEndpoint) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
