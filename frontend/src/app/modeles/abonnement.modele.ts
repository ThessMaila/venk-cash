import { Abonne } from './abonne.modele';
import { Branchement } from './branchement.modele';
import { Compteur } from './compteur.modele';
import { Tarif } from './tarif.modele';

export type StatutAbonnement = 'ACTIF' | 'SUSPENDU' | 'RESILIE';

export interface Abonnement {
    id?: number;
    numeroAbonnement: string;
    abonne: Abonne;
    branchement: Branchement;
    compteur: Compteur;
    tarif: Tarif;
    statut: StatutAbonnement;
    dateSouscription: Date;
    dateResiliation?: Date;
    actif: boolean;
}
