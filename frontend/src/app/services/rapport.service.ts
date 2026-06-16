import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../environments/environnement';

@Injectable({ providedIn: 'root' })
export class RapportService {
    private apiUrl = `${environnement.apiUrl}`;

    constructor(private http: HttpClient) {}

    obtenirStatistiques(): Observable<any> {
        return this.http.get(`${this.apiUrl}/statistiques`);
    }

    obtenirRecapitulatifSession(): Observable<any> {
        return this.http.get(`${this.apiUrl}/sessions-caisse/recapitulatif`);
    }

    ouvrirSession(soldeInitial: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/sessions-caisse/ouverture`, { soldeInitial });
    }

    fermerSession(remarques: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/sessions-caisse/fermeture`, { remarques });
    }

    historiqueSessions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/sessions-caisse/historique`);
    }

    listerBranchements(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/branchements`);
    }

    listerAbonnes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/abonnes`);
    }

    listerTarifs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/tarifs`);
    }

    listerGrilleTarifaire(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/grille-tarifaire`);
    }
}
