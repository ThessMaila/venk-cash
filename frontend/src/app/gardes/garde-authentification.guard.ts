import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

export const gardeAuthentification = () => {
    const authService = inject(AuthentificationService);
    const router = inject(Router);

    if (!authService.estConnecte()) {
        router.navigate(['/connexion']);
        return false;
    }
    return true;
};

export const gardeRole = (roles: string[]) => {
    const authService = inject(AuthentificationService);
    const router = inject(Router);

    return () => {
        if (!authService.estConnecte()) {
            router.navigate(['/connexion']);
            return false;
        }
        if (!authService.aRole(roles)) {
            router.navigate(['/']);
            return false;
        }
        return true;
    };
};
