export type StatutBranchement = 'ACTIF' | 'INACTIF' | 'RESILIE';

export interface Branchement {
    id?: number;
    codeBranchement: string;
    adresse?: string;
    quartier?: string;
    ville?: string;
    statut: StatutBranchement;
    dateCreation?: Date;
}
