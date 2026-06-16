import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../environments/environnement';
import { Abonnement } from '../modeles/abonnement.modele';
import { RequeteSouscription } from '../dto/requetes/requete-souscription.dto';
import { RequeteChangementPuissance } from '../dto/requetes/requete-changement-puissance.dto';
import { RequeteMutation } from '../dto/requetes/requete-mutation.dto';

@Injectable({ providedIn: 'root' })
export class AbonnementService {
    private apiUrl = `${environnement.apiUrl}/abonnements`;

    constructor(private http: HttpClient) {}

    listerTous(): Observable<Abonnement[]> {
        return this.http.get<Abonnement[]>(this.apiUrl);
    }

    listerActifs(): Observable<Abonnement[]> {
        return this.http.get<Abonnement[]>(`${this.apiUrl}/actifs`);
    }

    trouverParId(id: number): Observable<Abonnement> {
        return this.http.get<Abonnement>(`${this.apiUrl}/${id}`);
    }

    trouverParCompteur(numeroCompteur: string): Observable<Abonnement> {
        return this.http.get<Abonnement>(`${this.apiUrl}/compteur/${numeroCompteur}`);
    }

    souscrire(requete: RequeteSouscription): Observable<Abonnement> {
        return this.http.post<Abonnement>(`${this.apiUrl}/souscription`, requete);
    }

    changerPuissance(requete: RequeteChangementPuissance): Observable<Abonnement> {
        return this.http.post<Abonnement>(`${this.apiUrl}/changement-puissance`, requete);
    }

    muterAbonne(requete: RequeteMutation): Observable<Abonnement> {
        return this.http.post<Abonnement>(`${this.apiUrl}/mutation`, requete);
    }
}
