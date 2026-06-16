import { DetailTaxeDTO } from './detail-taxe-dto';

export interface ReponsePrecalcul {
    montantVerse: number;
    montantTaxes: number;
    montantNet: number;
    coutUnitaireKwh: number;
    quantiteKwh: number;
    detailsTaxes: DetailTaxeDTO[];
    montantSuffisant: boolean;
    message: string;
}
