import { DetailTaxeDTO } from './detail-taxe-dto';

export interface ReponseRecuVente {
    id: number;
    numeroRecu: string;
    numeroAbonnement: string;
    nomAbonne: string;
    prenomAbonne: string;
    numeroCompteur: string;
    puissanceSouscrite: string;
    montantVerse: number;
    montantTaxes: number;
    montantNet: number;
    coutUnitaireKwh: number;
    quantiteKwh: number;
    montantRecu: number;
    monnaieRendue: number;
    tokenRecharge: string;
    dateTransaction: Date;
    caissiere: string;
    detailsTaxes: DetailTaxeDTO[];
}
