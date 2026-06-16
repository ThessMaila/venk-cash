import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AbonnementService } from '../../../services/abonnement.service';
import { VenteService } from '../../../services/vente.service';
import { NotificationService } from '../../../services/notification.service';
import { Abonnement } from '../../../modeles/abonnement.modele';
import { TransactionAchat } from '../../../modeles/vente.modele';
import { RequeteChangementPuissance } from '../../../dto/requetes/requete-changement-puissance.dto';
import { RequeteMutation } from '../../../dto/requetes/requete-mutation.dto';

@Component({
    selector: 'app-details-abonnement',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, TableModule, ButtonModule, CardModule, TagModule, PanelModule, DividerModule, DialogModule, InputTextModule, SelectModule],
    template: `
        <div class="card" *ngIf="abonnement">
            <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="text-2xl font-bold">Abonnement {{ abonnement.numeroAbonnement }}</h2>
                <div class="flex gap-2">
                    <button pButton label="Changer puissance" icon="pi pi-bolt" class="p-button-outlined" (onClick)="ouvrirDialogPuissance()" *ngIf="abonnement.statut === 'ACTIF'"></button>
                    <button pButton label="Muter abonne" icon="pi pi-user-plus" class="p-button-outlined" (onClick)="ouvrirDialogMutation()" *ngIf="abonnement.statut === 'ACTIF'"></button>
                    <a routerLink="/abonnements" pButton label="Retour" icon="pi pi-arrow-left" class="p-button-text"></a>
                </div>
            </div>

            <div class="grid">
                <div class="col-12 md:col-6">
                    <p-panel header="Client">
                        <div class="field">
                            <label class="font-bold">Nom complet :</label>
                            <span>{{ abonnement.abonne.prenom }} {{ abonnement.abonne.nom }}</span>
                        </div>
                        <div class="field" *ngIf="abonnement.abonne.email">
                            <label class="font-bold">Email :</label>
                            <span>{{ abonnement.abonne.email }}</span>
                        </div>
                        <div class="field" *ngIf="abonnement.abonne.telephone">
                            <label class="font-bold">Telephone :</label>
                            <span>{{ abonnement.abonne.telephone }}</span>
                        </div>
                        <div class="field" *ngIf="abonnement.abonne.adresse">
                            <label class="font-bold">Adresse :</label>
                            <span>{{ abonnement.abonne.adresse }}</span>
                        </div>
                    </p-panel>
                </div>

                <div class="col-12 md:col-6">
                    <p-panel header="Compteur & Branchement">
                        <div class="field">
                            <label class="font-bold">Compteur :</label>
                            <span>{{ abonnement.compteur.numeroCompteur }}</span>
                        </div>
                        <div class="field">
                            <label class="font-bold">Statut compteur :</label>
                            <p-tag [value]="abonnement.compteur.statut" [severity]="abonnement.compteur.statut === 'ACTIF' ? 'success' : 'warn'" />
                        </div>
                        <div class="field" *ngIf="abonnement.branchement">
                            <label class="font-bold">Branchement :</label>
                            <span>{{ abonnement.branchement.codeBranchement }}</span>
                        </div>
                        <div class="field" *ngIf="abonnement.branchement.adresse">
                            <label class="font-bold">Adresse branchement :</label>
                            <span>{{ abonnement.branchement.adresse }}, {{ abonnement.branchement.ville }}</span>
                        </div>
                    </p-panel>
                </div>

                <div class="col-12 md:col-6">
                    <p-panel header="Abonnement">
                        <div class="field">
                            <label class="font-bold">Statut :</label>
                            <p-tag [value]="abonnement.statut" [severity]="abonnement.statut === 'ACTIF' ? 'success' : abonnement.statut === 'SUSPENDU' ? 'warn' : 'danger'" />
                        </div>
                        <div class="field">
                            <label class="font-bold">Puissance souscrite :</label>
                            <span>{{ abonnement.tarif.puissanceAmperes }}A ({{ abonnement.tarif.libelle }})</span>
                        </div>
                        <div class="field">
                            <label class="font-bold">Cout unitaire :</label>
                            <span>{{ abonnement.tarif.coutUnitaireKwh }} FCFA/kWh</span>
                        </div>
                        <div class="field">
                            <label class="font-bold">Date souscription :</label>
                            <span>{{ abonnement.dateSouscription | date:'dd/MM/yyyy' }}</span>
                        </div>
                    </p-panel>
                </div>
            </div>

            <p-divider></p-divider>

            <h3 class="text-xl font-bold mb-3">Historique des transactions</h3>
            <p-table [value]="transactions" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5,10,20]">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>kWh</th>
                        <th>Token</th>
                        <th>Statut</th>
                    </tr>
                </ng-template>
                <ng-template #body let-t>
                    <tr>
                        <td>{{ t.codeTransaction }}</td>
                        <td>{{ t.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</td>
                        <td>{{ t.montantVerse | number }} FCFA</td>
                        <td>{{ t.quantiteKwh }}</td>
                        <td><code>{{ t.tokenRecharge }}</code></td>
                        <td>
                            <p-tag [value]="t.statut" [severity]="t.statut === 'VALIDEE' ? 'success' : 'danger'" />
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="6" class="text-center">Aucune transaction pour cet abonnement</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Dialog Changement de puissance -->
        <p-dialog header="Changement de puissance" [(visible)]="dialogPuissanceVisible" [modal]="true" [style]="{'width': '450px'}">
            <div class="flex flex-column gap-3">
                <p>Vous souhaitez changer la puissance de <strong>{{ abonnement?.tarif.puissanceAmperes }}A</strong> vers :</p>
                <div>
                    <label class="block font-medium mb-1">Nouvelle puissance</label>
                    <p-select [options]="optionsPuissance" [(ngModel)]="nouvellePuissance" optionLabel="libelle" optionValue="valeur" class="w-full" placeholder="Choisir..."></p-select>
                </div>
                <small class="text-muted">Le changement creera un nouvel abonnement avec le nouveau tarif.</small>
            </div>
            <ng-template #footer>
                <button pButton label="Annuler" icon="pi pi-times" class="p-button-text" (onClick)="dialogPuissanceVisible = false"></button>
                <button pButton label="Confirmer" icon="pi pi-check" (onClick)="changerPuissance()" [loading]="chargementPuissance"></button>
            </ng-template>
        </p-dialog>

        <!-- Dialog Mutation d'abonne -->
        <p-dialog header="Mutation d'abonne" [(visible)]="dialogMutationVisible" [modal]="true" [style]="{'width': '500px'}">
            <div class="flex flex-column gap-3">
                <p>Remplacer l'abonne actuel par un nouveau titulaire.</p>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-medium mb-1">Nom</label>
                        <input pInputText class="w-full" [(ngModel)]="mutationNom" placeholder="Nom du nouvel abonne" />
                    </div>
                    <div>
                        <label class="block font-medium mb-1">Prenom</label>
                        <input pInputText class="w-full" [(ngModel)]="mutationPrenom" placeholder="Prenom du nouvel abonne" />
                    </div>
                    <div>
                        <label class="block font-medium mb-1">Telephone</label>
                        <input pInputText class="w-full" [(ngModel)]="mutationTelephone" placeholder="Telephone" />
                    </div>
                    <div>
                        <label class="block font-medium mb-1">Email</label>
                        <input pInputText class="w-full" [(ngModel)]="mutationEmail" placeholder="Email (optionnel)" />
                    </div>
                    <div class="col-span-2">
                        <label class="block font-medium mb-1">Adresse</label>
                        <input pInputText class="w-full" [(ngModel)]="mutationAdresse" placeholder="Adresse" />
                    </div>
                </div>
            </div>
            <ng-template #footer>
                <button pButton label="Annuler" icon="pi pi-times" class="p-button-text" (onClick)="dialogMutationVisible = false"></button>
                <button pButton label="Confirmer la mutation" icon="pi pi-check" (onClick)="effectuerMutation()" [loading]="chargementMutation"></button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .field { margin-bottom: 0.75rem; }
        .field label { display: inline-block; min-width: 140px; color: var(--text-color-secondary); }
        code { background: var(--surface-ground); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
    `]
})
export class DetailsAbonnementComponent implements OnInit {
    abonnement: Abonnement | null = null;
    transactions: TransactionAchat[] = [];

    // Dialog changement puissance
    dialogPuissanceVisible = false;
    nouvellePuissance = 3;
    chargementPuissance = false;
    optionsPuissance = [
        { libelle: '3 Amperes', valeur: 3 },
        { libelle: '5 Amperes', valeur: 5 }
    ];

    // Dialog mutation
    dialogMutationVisible = false;
    mutationNom = '';
    mutationPrenom = '';
    mutationTelephone = '';
    mutationEmail = '';
    mutationAdresse = '';
    chargementMutation = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private abonnementService: AbonnementService,
        private venteService: VenteService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.abonnementService.trouverParId(id).subscribe({
                next: (data) => {
                    this.abonnement = data;
                    this.nouvellePuissance = data.tarif.puissanceAmperes === 3 ? 5 : 3;
                }
            });
            this.venteService.listerParAbonnement(id).subscribe({
                next: (data) => {
                    this.transactions = data;
                }
            });
        }
    }

    ouvrirDialogPuissance(): void {
        if (this.abonnement) {
            this.nouvellePuissance = this.abonnement.tarif.puissanceAmperes === 3 ? 5 : 3;
        }
        this.dialogPuissanceVisible = true;
    }

    ouvrirDialogMutation(): void {
        this.mutationNom = '';
        this.mutationPrenom = '';
        this.mutationTelephone = '';
        this.mutationEmail = '';
        this.mutationAdresse = '';
        this.dialogMutationVisible = true;
    }

    changerPuissance(): void {
        if (!this.abonnement) return;

        this.chargementPuissance = true;
        const requete: RequeteChangementPuissance = {
            abonnementId: this.abonnement.id!,
            nouvellePuissance: this.nouvellePuissance
        };

        this.abonnementService.changerPuissance(requete).subscribe({
            next: (nouvelAbonnement) => {
                this.chargementPuissance = false;
                this.dialogPuissanceVisible = false;
                this.notification.succes('Puissance changee avec succes');
                this.router.navigate(['/abonnements', nouvelAbonnement.id]);
            },
            error: (err) => {
                this.chargementPuissance = false;
                this.notification.erreur(err.error?.message || 'Erreur lors du changement');
            }
        });
    }

    effectuerMutation(): void {
        if (!this.abonnement) return;

        if (!this.mutationNom || !this.mutationPrenom || !this.mutationTelephone) {
            this.notification.avertir('Veuillez remplir les champs obligatoires');
            return;
        }

        this.chargementMutation = true;
        const requete: RequeteMutation = {
            abonnementActuelId: this.abonnement.id!,
            nouveauNom: this.mutationNom,
            nouveauPrenom: this.mutationPrenom,
            nouveauTelephone: this.mutationTelephone,
            nouvelEmail: this.mutationEmail || undefined,
            nouvelleAdresse: this.mutationAdresse || undefined
        };

        this.abonnementService.muterAbonne(requete).subscribe({
            next: (nouvelAbonnement) => {
                this.chargementMutation = false;
                this.dialogMutationVisible = false;
                this.notification.succes('Mutation effectuee avec succes');
                this.router.navigate(['/abonnements', nouvelAbonnement.id]);
            },
            error: (err) => {
                this.chargementMutation = false;
                this.notification.erreur(err.error?.message || 'Erreur lors de la mutation');
            }
        });
    }
}
