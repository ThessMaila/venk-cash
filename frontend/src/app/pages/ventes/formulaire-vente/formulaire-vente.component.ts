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
import { TagModule } from 'primeng/tag';
import { StepsModule } from 'primeng/steps';
import { MessagesModule } from 'primeng/messages';
import { VenteService } from '../../../services/vente.service';
import { AbonnementService } from '../../../services/abonnement.service';
import { NotificationService } from '../../../services/notification.service';
import { RequeteVente } from '../../../dto/requetes/requete-vente.dto';
import { ReponsePrecalcul } from '../../../dto/reponses/reponse-precalcul.dto';
import { ReponseRecuVente } from '../../../dto/reponses/reponse-recu-vente.dto';
import { Abonnement } from '../../../modeles/abonnement.modele';

@Component({
    selector: 'app-formulaire-vente',
    standalone: true,
    imports: [
        CommonModule, FormsModule, RouterModule, ButtonModule, CardModule,
        InputTextModule, InputNumberModule, DividerModule, TableModule,
        ToastModule, CheckboxModule, TagModule, StepsModule, MessagesModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <!-- En-tête avec titre et indicateur de phase -->
            <div class="col-span-12">
                <div class="flex justify-content-between align-items-center">
                    <h2 class="text-2xl font-bold">Vente d'unites d'energie</h2>
                    <p-tag [value]="phaseActuelle" [severity]="severityPhase" styleClass="text-lg px-3 py-2"></p-tag>
                </div>
                <p-divider></p-divider>
            </div>

            <!-- Phase A: Identification et Controle d'Eligibilite -->
            <div class="col-span-12" *ngIf="etape === 1">
                <p-card header="Phase A - Identification du client" subheader="Controle d'eligibilite du compteur">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 lg:col-span-6">
                            <label class="block font-medium mb-2">Numero de compteur</label>
                            <div class="flex gap-2">
                                <input pInputText class="flex-1" [(ngModel)]="numeroCompteur"
                                    placeholder="Ex: CPT-0004" (keyup.enter)="identifierClient()"
                                    [disabled]="chargementIdentification" />
                                <button pButton icon="pi pi-search" label="Identifier"
                                    (onClick)="identifierClient()" [loading]="chargementIdentification"></button>
                            </div>
                            <small class="text-muted">Saisissez le numero de compteur du client</small>
                        </div>

                        <!-- Message d'erreur -->
                        <div class="col-span-12" *ngIf="messageErreur">
                            <div class="bg-red-50 dark:bg-red-900 p-4 border-round border-left-3 border-red-500">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-times-circle text-red-500 text-xl"></i>
                                    <span class="font-bold text-red-700">{{ messageErreur }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Informations client identifie -->
                        <div class="col-span-12" *ngIf="clientIdentifie && abonnement">
                            <div class="bg-green-50 dark:bg-green-900 p-4 border-round border-left-3 border-green-500">
                                <div class="flex align-items-center gap-2 mb-3">
                                    <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                    <span class="font-bold text-green-700">Client identifie avec succes</span>
                                </div>
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12 md:col-span-6">
                                        <p class="text-500 mb-1">Abonne</p>
                                        <p class="font-bold text-lg">{{ abonnement.abonne.prenom }} {{ abonnement.abonne.nom }}</p>
                                    </div>
                                    <div class="col-span-6 md:col-span-3">
                                        <p class="text-500 mb-1">Compteur</p>
                                        <p class="font-bold">{{ abonnement.compteur.numeroCompteur }}</p>
                                    </div>
                                    <div class="col-span-6 md:col-span-3">
                                        <p class="text-500 mb-1">Puissance souscrite</p>
                                        <p-tag [value]="abonnement.tarif.puissanceAmperes + ' Amperes'" severity="success"></p-tag>
                                    </div>
                                    <div class="col-span-6 md:col-span-3" *ngIf="abonnement.abonne.telephone">
                                        <p class="text-500 mb-1">Telephone</p>
                                        <p class="font-bold">{{ abonnement.abonne.telephone }}</p>
                                    </div>
                                    <div class="col-span-6 md:col-span-3" *ngIf="abonnement.abonne.email">
                                        <p class="text-500 mb-1">Email</p>
                                        <p class="font-bold">{{ abonnement.abonne.email }}</p>
                                    </div>
                                    <div class="col-span-12 md:col-span-6">
                                        <p class="text-500 mb-1">Cout unitaire kWh</p>
                                        <p class="font-bold text-primary">{{ abonnement.tarif.coutUnitaireKwh }} FCFA/kWh</p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-content-end mt-3">
                                <button pButton label="Passer a la saisie du montant" icon="pi pi-arrow-right" iconPos="right"
                                    (onClick)="passerEtape2()" class="p-button-lg"></button>
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Phase B: Saisie Financiere et Pre-calcul -->
            <div class="col-span-12" *ngIf="etape === 2">
                <p-card header="Phase B - Saisie du montant et pre-calcul" subheader="Calcul automatique des taxes et kWh">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 lg:col-span-5">
                            <label class="block font-medium mb-2">Montant a recharger (FCFA)</label>
                            <p-inputNumber [(ngModel)]="montantVerse" [min]="100" [max]="1000000"
                                class="w-full" placeholder="Ex: 5000" (onInput)="calculerTaxes()"
                                mode="currency" currency="FCFA" locale="fr-FR"></p-inputNumber>
                            <small class="text-muted">Minimum 100 FCFA - Maximum 1 000 000 FCFA</small>

                            <div class="mt-3">
                                <button pButton label="Calculer les taxes" icon="pi pi-calculator"
                                    (onClick)="calculerTaxes()" [loading]="chargementCalcul"
                                    class="w-full"></button>
                            </div>
                        </div>

                        <div class="col-span-12 lg:col-span-7" *ngIf="precalcul">
                            <div class="bg-surface-50 dark:bg-surface-800 p-4 border-round">
                                <h4 class="font-bold mb-3">Recapitulatif du pre-calcul</h4>

                                <div class="flex justify-content-between py-2 border-bottom-1 border-200">
                                    <span>Montant verse par le client:</span>
                                    <span class="font-bold">{{ precalcul.montantVerse | number }} FCFA</span>
                                </div>

                                <div *ngIf="precalcul.detailsTaxes?.length" class="py-2 bg-red-50 my-2">
                                    <p class="font-bold text-red-600 mb-2">Taxes et redevances deduites:</p>
                                    <div *ngFor="let taxe of precalcul.detailsTaxes" class="flex justify-content-between px-3 py-1">
                                        <span class="text-600">{{ taxe.libelle }} ({{ taxe.code }}):</span>
                                        <span class="text-red-600">- {{ taxe.montant | number }} FCFA</span>
                                    </div>
                                    <div class="flex justify-content-between px-3 py-2 border-top-1 border-red-200 mt-2">
                                        <span class="font-bold text-red-700">Total taxes:</span>
                                        <span class="font-bold text-red-700">- {{ precalcul.montantTaxes | number }} FCFA</span>
                                    </div>
                                </div>

                                <div class="flex justify-content-between py-2 border-bottom-1 border-200">
                                    <span class="font-medium">Montant net energie:</span>
                                    <span class="font-bold text-lg">{{ precalcul.montantNet | number }} FCFA</span>
                                </div>

                                <div *ngIf="precalcul.montantSuffisant; else montantInsuffisant" class="bg-green-50 dark:bg-green-900 p-4 mt-3 border-round">
                                    <div class="flex justify-content-between align-items-center">
                                        <span class="font-bold text-lg">Quantite d'energie:</span>
                                        <span class="font-bold text-3xl text-green-600">{{ precalcul.quantiteKwh }} kWh</span>
                                    </div>
                                    <div class="flex justify-content-between mt-2 text-600">
                                        <span>Cout unitaire:</span>
                                        <span>{{ precalcul.coutUnitaireKwh }} FCFA/kWh</span>
                                    </div>
                                </div>

                                <ng-template #montantInsuffisant>
                                    <div class="bg-red-50 dark:bg-red-900 p-4 mt-3 border-round">
                                        <p class="text-red-700 font-bold">{{ precalcul.message }}</p>
                                    </div>
                                </ng-template>
                            </div>

                            <div *ngIf="precalcul.montantSuffisant" class="flex gap-2 justify-content-end mt-3">
                                <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-secondary"
                                    (onClick)="retourEtape1()"></button>
                                <button pButton label="Passer a l'encaissement" icon="pi pi-arrow-right" iconPos="right"
                                    (onClick)="passerEtape3()"></button>
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Phase C: Encaissement et Arbitrage Transactionnel -->
            <div class="col-span-12" *ngIf="etape === 3">
                <p-card header="Phase C - Encaissement" subheader="Reception du paiement et validation">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 lg:col-span-6">
                            <div class="bg-blue-50 dark:bg-blue-900 p-4 border-round mb-4">
                                <h4 class="font-bold mb-2">Recapitulatif de la vente</h4>
                                <p>Client: <strong>{{ abonnement?.abonne.prenom }} {{ abonnement?.abonne.nom }}</strong></p>
                                <p>Montant a payer: <strong class="text-primary">{{ montantVerse | number }} FCFA</strong></p>
                                <p>Quantite kWh: <strong class="text-green-600">{{ precalcul?.quantiteKwh }} kWh</strong></p>
                            </div>

                            <label class="block font-medium mb-2">Montant recu du client (FCFA)</label>
                            <p-inputNumber [(ngModel)]="montantRecu" [min]="montantVerse"
                                class="w-full" placeholder="Ex: 10000"
                                mode="currency" currency="FCFA" locale="fr-FR"></p-inputNumber>

                            <div *ngIf="montantRecu >= montantVerse" class="bg-yellow-50 dark:bg-yellow-900 p-3 mt-3 border-round">
                                <div class="flex justify-content-between">
                                    <span>Montant a payer:</span>
                                    <span>{{ montantVerse | number }} FCFA</span>
                                </div>
                                <div class="flex justify-content-between">
                                    <span>Montant recu:</span>
                                    <span>{{ montantRecu | number }} FCFA</span>
                                </div>
                                <p-divider></p-divider>
                                <div class="flex justify-content-between font-bold text-lg">
                                    <span>Monnaie a rendre:</span>
                                    <span class="text-orange-600">{{ (montantRecu - montantVerse) | number }} FCFA</span>
                                </div>
                            </div>

                            <div *ngIf="montantRecu < montantVerse && montantRecu > 0" class="bg-red-50 dark:bg-red-900 p-3 mt-3 border-round">
                                <p class="text-red-700"><i class="pi pi-exclamation-triangle mr-2"></i>Le montant recu est inferieur au montant a payer</p>
                            </div>

                            <!-- Options d'envoi du recu -->
                            <div class="mt-4">
                                <p class="font-medium mb-2">Options d'envoi du recu</p>
                                <div class="flex align-items-center gap-2 mb-2">
                                    <p-checkbox [(ngModel)]="envoyerEmail" binary="true" [disabled]="!abonnement?.abonne.email"></p-checkbox>
                                    <label [class]="{'text-400': !abonnement?.abonne.email}">Envoyer par email {{ abonnement?.abonne.email ? '' : '(email non renseigne)' }}</label>
                                </div>
                                <div class="flex align-items-center gap-2">
                                    <p-checkbox [(ngModel)]="envoyerSms" binary="true" [disabled]="!abonnement?.abonne.telephone"></p-checkbox>
                                    <label [class]="{'text-400': !abonnement?.abonne.telephone}">Envoyer par SMS {{ abonnement?.abonne.telephone ? '' : '(telephone non renseigne)' }}</label>
                                </div>
                            </div>

                            <div class="flex gap-2 mt-4">
                                <button pButton label="Annuler la vente" icon="pi pi-times"
                                    class="p-button-danger p-button-outlined" (onClick)="annulerVente()"></button>
                                <button pButton label="Valider et encaisser" icon="pi pi-check"
                                    (onClick)="validerVente()" [loading]="chargementValidation"
                                    [disabled]="montantRecu < montantVerse" class="p-button-success p-button-lg flex-1"></button>
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Phase D: Cloture de l'acte de vente - Recu -->
            <div class="col-span-12" *ngIf="etape === 4 && recu">
                <p-card header="Phase D - Recu de vente" subheader="Transaction completee avec succes">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 lg:col-span-8">
                            <div class="bg-white dark:bg-surface-800 p-4 border-round border-1" id="recu-impression">
                                <!-- En-tete du recu -->
                                <div class="text-center mb-4">
                                    <h3 class="text-xl font-bold text-primary">SONABEL</h3>
                                    <p class="text-sm">Societe Nationale d'Electricite du Burkina</p>
                                    <p class="text-xs text-500">Recu de vente d'unites d'energie</p>
                                </div>

                                <p-divider></p-divider>

                                <!-- Informations transaction -->
                                <div class="grid grid-cols-2 gap-3 my-4">
                                    <div>
                                        <p class="text-500 text-sm">N° Recu</p>
                                        <p class="font-bold">{{ recu.numeroRecu }}</p>
                                    </div>
                                    <div>
                                        <p class="text-500 text-sm">Date</p>
                                        <p class="font-bold">{{ recu.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-500 text-sm">Client</p>
                                        <p class="font-bold">{{ recu.prenomAbonne }} {{ recu.nomAbonne }}</p>
                                    </div>
                                    <div>
                                        <p class="text-500 text-sm">Compteur</p>
                                        <p class="font-bold">{{ recu.numeroCompteur }}</p>
                                    </div>
                                    <div>
                                        <p class="text-500 text-sm">Puissance</p>
                                        <p class="font-bold">{{ recu.puissanceSouscrite }}</p>
                                    </div>
                                    <div>
                                        <p class="text-500 text-sm">Caissiere</p>
                                        <p class="font-bold">{{ recu.caissiere }}</p>
                                    </div>
                                </div>

                                <p-divider></p-divider>

                                <!-- Details financiers -->
                                <div class="my-4">
                                    <h4 class="font-bold mb-2">Details financiers</h4>
                                    <div class="flex justify-content-between py-1">
                                        <span>Montant verse:</span>
                                        <span class="font-bold">{{ recu.montantVerse | number }} FCFA</span>
                                    </div>
                                    <div class="flex justify-content-between py-1 text-red-600">
                                        <span>Total taxes et redevances:</span>
                                        <span class="font-bold">- {{ recu.montantTaxes | number }} FCFA</span>
                                    </div>
                                    <div class="flex justify-content-between py-1 border-top-1 border-200">
                                        <span class="font-medium">Montant net energie:</span>
                                        <span class="font-bold">{{ recu.montantNet | number }} FCFA</span>
                                    </div>
                                    <div class="flex justify-content-between py-1">
                                        <span>Cout unitaire kWh:</span>
                                        <span>{{ recu.coutUnitaireKwh }} FCFA</span>
                                    </div>
                                </div>

                                <p-divider></p-divider>

                                <!-- Token -->
                                <div class="bg-primary-50 dark:bg-primary-900 p-4 my-4 text-center border-round">
                                    <div class="flex justify-content-between align-items-center mb-2">
                                        <span class="font-bold">QUANTITE D'ENERGIE</span>
                                        <span class="text-3xl font-bold text-primary">{{ recu.quantiteKwh }} kWh</span>
                                    </div>
                                    <p class="text-sm text-500 mb-2">Token de recharge (saisir sur le compteur)</p>
                                    <p class="text-2xl font-bold tracking-widest bg-white dark:bg-surface-700 p-2 border-round">{{ recu.tokenRecharge }}</p>
                                </div>

                                <p-divider></p-divider>

                                <!-- Encaissement -->
                                <div class="my-4">
                                    <div class="flex justify-content-between py-1">
                                        <span>Montant recu:</span>
                                        <span>{{ recu.montantRecu | number }} FCFA</span>
                                    </div>
                                    <div class="flex justify-content-between py-1 text-green-600">
                                        <span class="font-bold">Monnaie rendue:</span>
                                        <span class="font-bold">{{ recu.monnaieRendue | number }} FCFA</span>
                                    </div>
                                </div>

                                <p-divider></p-divider>

                                <!-- Pied de page -->
                                <div class="text-center text-xs text-500 mt-4">
                                    <p>SONABEL - L'energie au service du developpement</p>
                                    <p>Merci de votre confiance</p>
                                </div>
                            </div>

                            <div class="flex gap-2 justify-content-center mt-4">
                                <button pButton label="Imprimer le recu" icon="pi pi-print"
                                    class="p-button-outlined" (onClick)="imprimerRecu()"></button>
                                <button pButton label="Nouvelle vente" icon="pi pi-plus"
                                    class="p-button-success" (onClick)="reinitialiser()"></button>
                            </div>
                        </div>

                        <!-- Resume lateral -->
                        <div class="col-span-12 lg:col-span-4">
                            <div class="bg-green-50 dark:bg-green-900 p-4 border-round mb-4">
                                <div class="flex align-items-center gap-2 mb-3">
                                    <i class="pi pi-check-circle text-green-500 text-2xl"></i>
                                    <span class="font-bold text-green-700">Vente reussie</span>
                                </div>
                                <p class="text-600">La transaction a ete enregistree avec succes.</p>
                            </div>

                            <div *ngIf="recuEnvoye" class="bg-blue-50 dark:bg-blue-900 p-4 border-round">
                                <div class="flex align-items-center gap-2 mb-2">
                                    <i class="pi pi-envelope text-blue-500"></i>
                                    <span class="font-bold">Notifications envoyees</span>
                                </div>
                                <p *ngIf="envoyerEmail" class="text-sm">Email envoye a {{ abonnement?.abonne.email }}</p>
                                <p *ngIf="envoyerSms" class="text-sm">SMS envoye au {{ abonnement?.abonne.telephone }}</p>
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>
        </div>
    `
})
export class FormulaireVenteComponent {
    // Etapes du workflow
    etape = 1;
    phaseActuelle = 'Phase A: Identification';
    severityPhase: 'info' | 'success' | 'warning' | 'secondary' = 'info';

    // Donnees du formulaire
    numeroCompteur = '';
    montantVerse = 0;
    montantRecu = 0;
    envoyerEmail = false;
    envoyerSms = false;

    // Etats de chargement
    chargementIdentification = false;
    chargementCalcul = false;
    chargementValidation = false;

    // Donnees du client et calculs
    clientIdentifie = false;
    abonnement: Abonnement | null = null;
    precalcul: ReponsePrecalcul | null = null;
    recu: ReponseRecuVente | null = null;
    recuEnvoye = false;
    messageErreur = '';

    constructor(
        private venteService: VenteService,
        private abonnementService: AbonnementService,
        private notification: NotificationService
    ) {}

    // ========== PHASE A: Identification ==========
    identifierClient(): void {
        if (!this.numeroCompteur) {
            this.notification.avertir('Veuillez saisir un numero de compteur');
            return;
        }

        this.chargementIdentification = true;
        this.clientIdentifie = false;
        this.abonnement = null;
        this.messageErreur = '';

        this.abonnementService.trouverParCompteur(this.numeroCompteur).subscribe({
            next: (data) => {
                this.abonnement = data;
                this.clientIdentifie = true;
                this.chargementIdentification = false;
                this.notification.succes('Client identifie: ' + data.abonne.prenom + ' ' + data.abonne.nom);
            },
            error: (err) => {
                this.chargementIdentification = false;
                this.messageErreur = err.error?.message || 'Compteur non trouve ou abonnement inactif';
                this.notification.erreur(this.messageErreur);
            }
        });
    }

    passerEtape2(): void {
        this.etape = 2;
        this.phaseActuelle = 'Phase B: Pre-calcul';
        this.severityPhase = 'warning';
    }

    retourEtape1(): void {
        this.etape = 1;
        this.phaseActuelle = 'Phase A: Identification';
        this.severityPhase = 'info';
    }

    // ========== PHASE B: Pre-calcul ==========
    calculerTaxes(): void {
        if (!this.numeroCompteur || !this.clientIdentifie || this.montantVerse < 100) {
            this.precalcul = null;
            if (this.montantVerse > 0 && this.montantVerse < 100) {
                this.notification.avertir('Le montant minimum est de 100 FCFA');
            }
            return;
        }

        this.chargementCalcul = true;
        const requete: RequeteVente = {
            numeroCompteur: this.numeroCompteur,
            montantVerse: this.montantVerse,
            montantRecu: this.montantVerse
        };

        this.venteService.preCalculer(requete).subscribe({
            next: (data) => {
                this.precalcul = data;
                this.chargementCalcul = false;
                if (data.montantSuffisant) {
                    this.montantRecu = this.montantVerse;
                }
            },
            error: (err) => {
                this.chargementCalcul = false;
                this.precalcul = null;
                this.notification.erreur(err.error?.message || 'Erreur lors du calcul');
            }
        });
    }

    passerEtape3(): void {
        this.etape = 3;
        this.phaseActuelle = 'Phase C: Encaissement';
        this.severityPhase = 'warning';
    }

    // ========== PHASE C: Encaissement ==========
    validerVente(): void {
        if (!this.precalcul?.montantSuffisant) {
            this.notification.avertir('Le montant est insuffisant pour couvrir les taxes');
            return;
        }
        if (this.montantRecu < this.montantVerse) {
            this.notification.avertir('Le montant recu est inferieur au montant a payer');
            return;
        }

        this.chargementValidation = true;
        const requete: RequeteVente = {
            numeroCompteur: this.numeroCompteur,
            montantVerse: this.montantVerse,
            montantRecu: this.montantRecu,
            envoyerEmail: this.envoyerEmail,
            envoyerSms: this.envoyerSms
        };

        this.venteService.effectuerAchat(requete).subscribe({
            next: (data) => {
                this.recu = data;
                this.etape = 4;
                this.phaseActuelle = 'Phase D: Cloture';
                this.severityPhase = 'success';
                this.chargementValidation = false;
                this.recuEnvoye = this.envoyerEmail || this.envoyerSms;
                this.notification.succes('Vente effectuee avec succes - Token genere');
            },
            error: (err) => {
                this.chargementValidation = false;
                this.notification.erreur(err.error?.message || 'Erreur lors de la validation');
            }
        });
    }

    annulerVente(): void {
        this.notification.information('Vente annulee par la caissiere');
        this.reinitialiser();
    }

    // ========== PHASE D: Cloture ==========
    imprimerRecu(): void {
        if (this.recu?.id) {
            this.venteService.telechargerPdf(this.recu.id).subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                },
                error: () => {
                    this.notification.erreur('Erreur lors de la generation du PDF');
                }
            });
        }
    }

    reinitialiser(): void {
        this.etape = 1;
        this.phaseActuelle = 'Phase A: Identification';
        this.severityPhase = 'info';
        this.numeroCompteur = '';
        this.montantVerse = 0;
        this.montantRecu = 0;
        this.envoyerEmail = false;
        this.envoyerSms = false;
        this.clientIdentifie = false;
        this.abonnement = null;
        this.precalcul = null;
        this.recu = null;
        this.recuEnvoye = false;
        this.messageErreur = '';
    }
}
