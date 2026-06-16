export type Profil = 'CAISSIERE' | 'CHEF_GUICHET' | 'ADMINISTRATEUR';

export interface Utilisateur {
    id?: number;
    nomUtilisateur: string;
    email: string;
    nom?: string;
    prenom?: string;
    profil: Profil;
    actif: boolean;
    dateCreation?: Date;
    derniereConnexion?: Date;
}
