import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environnement } from '../../environments/environnement';
import { RequeteConnexion } from '../dto/requetes/requete-connexion.dto';
import { ReponseConnexion } from '../dto/reponses/reponse-connexion.dto';

@Injectable({ providedIn: 'root' })
export class AuthentificationService {
    private apiUrl = `${environnement.apiUrl}/auth`;

    constructor(private http: HttpClient) {}

    connecter(requete: RequeteConnexion): Observable<ReponseConnexion> {
        return this.http.post<ReponseConnexion>(`${this.apiUrl}/connexion`, requete).pipe(
            tap(reponse => {
                localStorage.setItem('token', reponse.token);
                localStorage.setItem('utilisateur', JSON.stringify(reponse));
            })
        );
    }

    deconnecter(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUtilisateur(): ReponseConnexion | null {
        const data = localStorage.getItem('utilisateur');
        return data ? JSON.parse(data) : null;
    }

    estConnecte(): boolean {
        return !!this.getToken();
    }

    getProfil(): string | null {
        const utilisateur = this.getUtilisateur();
        return utilisateur ? utilisateur.profil : null;
    }

    aRole(roles: string[]): boolean {
        const profil = this.getProfil();
        return profil ? roles.includes(profil) : false;
    }
}
