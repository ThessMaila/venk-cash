import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../environments/environnement';
import { RequeteVente } from '../dto/requetes/requete-vente.dto';
import { ReponsePrecalcul } from '../dto/reponses/reponse-precalcul.dto';
import { ReponseRecuVente } from '../dto/reponses/reponse-recu-vente.dto';
import { TransactionRecente } from '../dto/reponses/transaction-recente.dto';
import { TransactionAchat } from '../modeles/vente.modele';

@Injectable({ providedIn: 'root' })
export class VenteService {
    private apiUrl = `${environnement.apiUrl}/transactions`;

    constructor(private http: HttpClient) {}

    preCalculer(requete: RequeteVente): Observable<ReponsePrecalcul> {
        return this.http.post<ReponsePrecalcul>(`${this.apiUrl}/pre-calcul`, requete);
    }

    effectuerAchat(requete: RequeteVente): Observable<ReponseRecuVente> {
        return this.http.post<ReponseRecuVente>(`${this.apiUrl}/effectuer`, requete);
    }

    annulerAchat(id: number): Observable<ReponseRecuVente> {
        return this.http.post<ReponseRecuVente>(`${this.apiUrl}/${id}/annuler`, {});
    }

    listerRecentes(): Observable<TransactionRecente[]> {
        return this.http.get<TransactionRecente[]>(`${this.apiUrl}/recentes`);
    }

    telechargerPdf(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
    }

    listerParAbonnement(abonnementId: number): Observable<TransactionAchat[]> {
        return this.http.get<TransactionAchat[]>(`${this.apiUrl}/abonnement/${abonnementId}`);
    }
}
