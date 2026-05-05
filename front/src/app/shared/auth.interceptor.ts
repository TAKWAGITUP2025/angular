import { HttpInterceptorFn } from '@angular/common/http';

// Ajoute automatiquement le token JWT a chaque requete
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }
  return next(req);
};
