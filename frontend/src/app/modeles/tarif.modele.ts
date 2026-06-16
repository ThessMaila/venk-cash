export interface Tarif {
    id?: number;
    libelle: string;
    puissanceAmperes: number;
    coutUnitaireKwh: number;
    actif: boolean;
}
