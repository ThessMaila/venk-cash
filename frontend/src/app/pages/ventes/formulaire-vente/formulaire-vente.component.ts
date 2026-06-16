import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { VenteService } from '../../../services/vente.service';
import { NotificationService } from '../../../services/notification.service';
import { RequeteVente } from '../../../dto/requetes/requete-vente.dto';
import { ReponsePrecalcul } from '../../../dto/reponses/reponse-precalcul.dto';
import { ReponseRecuVente } from '../../../dto/reponses/reponse-recu-vente.dto';

@Component({
    selector: 'app-formulaire-vente',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CardModule, InputTextModule, InputNumberModule, DividerModule, TableModule, ToastModule, CheckboxModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12">
                <h2 class="text-2xl font-bold mb-4">Vente d'unites d'energie</h2>
            </div>

            <div class="col-span-12 lg:col-span-6">
                <p-card header="Identification du client">
                    <div class="flex flex-column gap-3">
                        <div>
                            <label class="block font-medium mb-1">Numero de compteur</label>
                            <div class="flex gap-2">
                                <input pInputText class="flex-1" [(ngModel)]="numeroCompteur" placeholder="Ex: CPT-0001" (keyup.enter)="identifierClient()" />
                                <button pButton icon="pi pi-search" (onClick)="identifierClient()" [loading]="chargementIdentification"></button>
                            </div>
                        </div>
                        <div *ngIf="clientIdentifie" class="bg-primary-50 dark:bg-primary-900 p-3 border-round">
                            <p class="font-bold">{{ abonnePrenom }} {{ abonneNom }}</p>
                            <p class="text-sm">Puissance: {{ puissanceSouscrite }}</p>
                            <p class="text-sm">Compteur: {{ numeroCompteur }}</p>
                        </div>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12 lg:col-span-6">
                <p-card header="Montant de la recharge">
                    <div class="flex flex-column gap-3">
                        <div>
                            <label class="block font-medium mb-1">Montant a recharger (FCFA)</label>
                            <p-inputNumber [(ngModel)]="montantVerse" [min]="100" [max]="1000000" class="w-full" placeholder="Ex: 5000" (onInput)="preCalculer()"></p-inputNumber>
                        </div>

                        <div *ngIf="precalcul" class="bg-surface-50 dark:bg-surface-800 p-3 border-round">
                            <div class="flex justify-content-between mb-1">
                                <span>Montant brut:</span>
                                <span class="font-bold">{{ precalcul.montantVerse | number }} FCFA</span>
                            </div>
                            <div class="flex justify-content-between mb-1">
                                <span>Total taxes:</span>
                                <span class="font-bold text-red-500">- {{ precalcul.montantTaxes | number }} FCFA</span>
                            </div>
                            <div class="flex justify-content-between mb-1">
                                <span>Montant net energie:</span>
                                <span class="font-bold">{{ precalcul.montantNet | number }} FCFA</span>
                            </div>
                            <p-divider></p-divider>
                            <div class="flex justify-content-between mb-1">
                                <span>Quantite d'energie:</span>
                                <span class="font-bold text-xl text-primary">{{ precalcul.quantiteKwh }} kWh</span>
                            </div>
                            <div class="flex justify-content-between">
                                <span>Cout unitaire:</span>
                                <span>{{ precalcul.coutUnitaireKwh }} FCFA/kWh</span>
                            </div>
                        </div>

                        <div *ngIf="precalcul && precalcul.detailsTaxes.length">
                            <p-table [value]="precalcul.detailsTaxes">
                                <ng-template #header>
                                    <tr><th>Taxe</th><th>Montant</th></tr>
                                </ng-template>
                                <ng-template #body let-t>
                                    <tr>
                                        <td>{{ t.libelle }} ({{ t.code }})</td>
                                        <td>{{ t.montant | number }} FCFA</td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </div>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12 lg:col-span-6" *ngIf="precalcul?.montantSuffisant">
                <p-card header="Encaissement">
                    <div>
                        <label class="block font-medium mb-1">Montant recu du client (FCFA)</label>
                        <p-inputNumber [(ngModel)]="montantRecu" [min]="montantVerse" class="w-full" placeholder="Ex: 10000"></p-inputNumber>
                        <div class="flex align-items-center gap-2 mt-3">
                            <p-checkbox [(ngModel)]="envoyerEmail" binary="true"></p-checkbox>
                            <label>Envoyer le recu par email</label>
                        </div>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12" *ngIf="precalcul?.montantSuffisant">
                <div class="flex gap-2">
                    <button pButton label="Valider la vente" icon="pi pi-check" (onClick)="validerVente()" [loading]="chargementValidation" class="p-button-lg"></button>
                    <button pButton label="Annuler" icon="pi pi-times" class="p-button-secondary p-button-lg" routerLink="/"></button>
                </div>
            </div>
        </div>

        <!-- Recu apres validation -->
        <div *ngIf="recu" class="mt-4">
            <p-card header="Reçu de vente" styleClass="border-primary">
                <div class="grid grid-cols-12 gap-3">
                    <div class="col-span-12 text-center mb-3">
                        <h3 class="text-xl font-bold">SONABEL - Venk-Cash</h3>
                        <p class="text-sm">Reçu de vente d'énergie</p>
                    </div>
                    <div class="col-span-6"><strong>N° Reçu:</strong> {{ recu.numeroRecu }}</div>
                    <div class="col-span-6"><strong>Date:</strong> {{ recu.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</div>
                    <div class="col-span-6"><strong>Client:</strong> {{ recu.prenomAbonne }} {{ recu.nomAbonne }}</div>
                    <div class="col-span-6"><strong>Compteur:</strong> {{ recu.numeroCompteur }}</div>
                    <div class="col-span-6"><strong>Puissance:</strong> {{ recu.puissanceSouscrite }}</div>
                    <div class="col-span-6"><strong>Caissiere:</strong> {{ recu.caissiere }}</div>
                    <div class="col-span-12"><p-divider></p-divider></div>
                    <div class="col-span-6">Montant verse:</div><div class="col-span-6 text-right">{{ recu.montantVerse | number }} FCFA</div>
                    <div class="col-span-6">Total taxes:</div><div class="col-span-6 text-right text-red-500">- {{ recu.montantTaxes | number }} FCFA</div>
                    <div class="col-span-6">Montant net:</div><div class="col-span-6 text-right font-bold">{{ recu.montantNet | number }} FCFA</div>
                    <div class="col-span-12"><p-divider></p-divider></div>
                    <div class="col-span-6 text-xl font-bold">Quantité d'énergie:</div>
                    <div class="col-span-6 text-xl font-bold text-primary text-right">{{ recu.quantiteKwh }} kWh</div>
                    <div class="col-span-6">Cout unitaire:</div><div class="col-span-6 text-right">{{ recu.coutUnitaireKwh }} FCFA/kWh</div>
                    <div class="col-span-12"><p-divider></p-divider></div>
                    <div class="col-span-12">
                        <div class="bg-primary-50 dark:bg-primary-900 p-3 text-center border-round">
                            <p class="text-sm mb-1">Token de recharge</p>
                            <p class="text-2xl font-bold tracking-wider">{{ recu.tokenRecharge }}</p>
                        </div>
                    </div>
                    <div class="col-span-6">Montant recu:</div><div class="col-span-6 text-right">{{ recu.montantRecu | number }} FCFA</div>
                    <div class="col-span-6">Monnaie rendue:</div><div class="col-span-6 text-right text-green-600 font-bold">{{ recu.monnaieRendue | number }} FCFA</div>
                    <div class="col-span-12 text-center mt-3">
                        <button pButton label="Imprimer le recu" icon="pi pi-print" class="p-button-outlined mr-2" (onClick)="imprimerRecu()"></button>
                        <button pButton label="Nouvelle vente" icon="pi pi-plus" (onClick)="reinitialiser()"></button>
                    </div>
                </div>
            </p-card>
        </div>
    `
})
export class FormulaireVenteComponent {
    numeroCompteur = '';
    montantVerse = 0;
    montantRecu = 0;
    envoyerEmail = false;
    chargementIdentification = false;
    chargementValidation = false;
    clientIdentifie = false;
    abonneNom = '';
    abonnePrenom = '';
    puissanceSouscrite = '';
    precalcul: ReponsePrecalcul | null = null;
    recu: ReponseRecuVente | null = null;

    constructor(
        private venteService: VenteService,
        private notification: NotificationService
    ) {}

    identifierClient(): void {
        if (!this.numeroCompteur) {
            this.notification.avertir('Veuillez saisir un numero de compteur');
            return;
        }

        this.chargementIdentification = true;
        this.clientIdentifie = false;
        this.precalcul = null;
        this.recu = null;

        this.venteService.preCalculer({ numeroCompteur: this.numeroCompteur, montantVerse: 100, montantRecu: 100 }).subscribe({
            next: (data) => {
                this.clientIdentifie = true;
                this.chargementIdentification = false;
            },
            error: (err) => {
                this.chargementIdentification = false;
                this.notification.erreur(err.error?.message || 'Compteur non trouve ou abonnement inactif');
            }
        });
    }

    preCalculer(): void {
        if (!this.numeroCompteur || this.montantVerse < 100) {
            this.precalcul = null;
            this.recu = null;
            return;
        }

        const requete: RequeteVente = {
            numeroCompteur: this.numeroCompteur,
            montantVerse: this.montantVerse,
            montantRecu: this.montantVerse
        };

        this.venteService.preCalculer(requete).subscribe({
            next: (data) => {
                this.precalcul = data;
                this.montantRecu = this.montantVerse;
            },
            error: () => this.precalcul = null
        });
    }

    validerVente(): void {
        if (!this.precalcul?.montantSuffisant) {
            this.notification.avertir('Le montant est insuffisant');
            return;
        }
        if (this.montantRecu < this.montantVerse) {
            this.notification.avertir('Le montant recu est inferieur au montant verse');
            return;
        }

        this.chargementValidation = true;
        const requete: RequeteVente = {
            numeroCompteur: this.numeroCompteur,
            montantVerse: this.montantVerse,
            montantRecu: this.montantRecu,
            envoyerEmail: this.envoyerEmail
        };

        this.venteService.effectuerAchat(requete).subscribe({
            next: (data) => {
                this.recu = data;
                this.chargementValidation = false;
                this.notification.succes('Vente effectuee avec succes');
            },
            error: (err) => {
                this.chargementValidation = false;
                this.notification.erreur(err.error?.message || 'Erreur lors de la vente');
            }
        });
    }

    imprimerRecu(): void {
        if (this.recu?.id) {
            this.venteService.telechargerPdf(this.recu.id).subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }
            });
        }
    }

    reinitialiser(): void {
        this.numeroCompteur = '';
        this.montantVerse = 0;
        this.montantRecu = 0;
        this.envoyerEmail = false;
        this.clientIdentifie = false;
        this.precalcul = null;
        this.recu = null;
    }
}
