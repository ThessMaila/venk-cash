export type StatutCompteur = 'EN_STOCK' | 'ACTIF' | 'SUSPENDU' | 'RESILIE';

export interface Compteur {
    id?: number;
    numeroCompteur: string;
    numeroSerie?: string;
    statut: StatutCompteur;
    emplacement?: string;
}
