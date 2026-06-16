export interface RequeteSouscription {
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    codeBranchement: string;
    puissanceAmperes: number;
    numeroCompteur: string;
}
