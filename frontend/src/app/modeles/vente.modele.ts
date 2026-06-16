import { DetailTaxe } from './detail-taxe.modele';

export type StatutTransaction = 'VALIDEE' | 'ANNULEE' | 'EN_ATTENTE';

export interface TransactionAchat {
    id?: number;
    codeTransaction: string;
    abonnementId?: number;
    montantVerse: number;
    montantTaxes: number;
    montantNet: number;
    coutUnitaireKwh: number;
    quantiteKwh: number;
    montantRecu: number;
    monnaieRendue: number;
    tokenRecharge: string;
    statut: StatutTransaction;
    dateTransaction: Date;
    commentaire?: string;
    detailsTaxes?: DetailTaxe[];
}

// Interface pour le recapitulatif de session de caisse
export interface RecapitulatifSession {
    session: SessionCaisse;
    totalVentes: number;
    totalKwh: number;
    nombreTransactions: number;
    soldeAttendu: number;
}

export interface SessionCaisse {
    id?: number;
    dateOuverture: Date;
    dateFermeture?: Date;
    soldeInitial: number;
    soldeFinal?: number;
    statut: 'OUVERTE' | 'FERMEE';
    remarques?: string;
}

// Interface pour le graphique de ventes
export interface VentesGraphique {
    labels: string[];
    data: number[];
}
