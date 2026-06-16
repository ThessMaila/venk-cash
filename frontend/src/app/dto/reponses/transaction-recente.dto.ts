export interface TransactionRecente {
    codeTransaction: string;
    nomAbonne: string;
    prenomAbonne: string;
    numeroCompteur: string;
    montantVerse: number;
    quantiteKwh: number;
    dateTransaction: Date;
    statut: string;
    caissiere: string;
}
