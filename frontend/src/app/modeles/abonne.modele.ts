export interface Abonne {
    id?: number;
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    dateCreation?: Date;
    actif?: boolean;
}
