export type TypeTaxe = 'POURCENTAGE' | 'MONTANT_FIXE';

export interface GrilleTarifaire {
    id?: number;
    libelleTaxe: string;
    codeTaxe: string;
    type: TypeTaxe;
    valeur: number;
    actif: boolean;
    description?: string;
}
