import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { AbonnementService } from '../../../services/abonnement.service';
import { VenteService } from '../../../services/vente.service';
import { Abonnement } from '../../../modeles/abonnement.modele';
import { TransactionAchat } from '../../../modeles/vente.modele';

@Component({
    selector: 'app-details-abonnement',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, TagModule, PanelModule, DividerModule],
    template: `
        <div class="card" *ngIf="abonnement">
            <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="text-2xl font-bold">Abonnement {{ abonnement.numeroAbonnement }}</h2>
                <div>
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

    constructor(
        private route: ActivatedRoute,
        private abonnementService: AbonnementService,
        private venteService: VenteService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.abonnementService.trouverParId(id).subscribe({
                next: (data) => {
                    this.abonnement = data;
                }
            });
            this.venteService.listerParAbonnement(id).subscribe({
                next: (data) => {
                    this.transactions = data;
                }
            });
        }
    }
}
