export interface RequeteVente {
    numeroCompteur: string;
    montantVerse: number;
    montantRecu: number;
    envoyerEmail?: boolean;
    envoyerSms?: boolean;
}
