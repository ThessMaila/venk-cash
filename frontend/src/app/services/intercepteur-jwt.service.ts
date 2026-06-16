import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthentificationService } from './authentification.service';

export const intercepteurJwt: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthentificationService);
    const router = inject(Router);
    const token = authService.getToken();

    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(req).pipe(
        catchError((erreur: HttpErrorResponse) => {
            if (erreur.status === 401) {
                authService.deconnecter();
                router.navigate(['/connexion']);
            }
            return throwError(() => erreur);
        })
    );
};
