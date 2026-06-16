import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../environments/environnement';
import { Compteur } from '../modeles/compteur.modele';

@Injectable({ providedIn: 'root' })
export class CompteurService {
    private apiUrl = `${environnement.apiUrl}/compteurs`;

    constructor(private http: HttpClient) {}

    listerTous(): Observable<Compteur[]> {
        return this.http.get<Compteur[]>(this.apiUrl);
    }

    trouverParNumero(numero: string): Observable<Compteur> {
        return this.http.get<Compteur>(`${this.apiUrl}/numero/${numero}`);
    }

    listerDisponibles(): Observable<Compteur[]> {
        return this.http.get<Compteur[]>(`${this.apiUrl}/statut/EN_STOCK`);
    }

    creer(compteur: Compteur): Observable<Compteur> {
        return this.http.post<Compteur>(this.apiUrl, compteur);
    }
}
