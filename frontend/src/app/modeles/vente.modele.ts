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
}
