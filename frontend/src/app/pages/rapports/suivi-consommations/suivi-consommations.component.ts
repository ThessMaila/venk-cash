import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { VenteService } from '../../../services/vente.service';
import { AbonnementService } from '../../../services/abonnement.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-suivi-consommations',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, TableModule, InputTextModule, ButtonModule, ChartModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12">
                <h2 class="text-2xl font-bold mb-4">Suivi des consommations</h2>
            </div>

            <div class="col-span-12 lg:col-span-6">
                <p-card header="Rechercher un compteur">
                    <div class="flex gap-2">
                        <input pInputText class="flex-1" [(ngModel)]="numeroCompteur" placeholder="Numero de compteur" (keyup.enter)="rechercher()" />
                        <button pButton icon="pi pi-search" (onClick)="rechercher()"></button>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12" *ngIf="transactions.length">
                <p-card header="Historique des achats">
                    <p-table [value]="transactions" [paginator]="true" [rows]="10">
                        <ng-template #header>
                            <tr>
                                <th>Date</th>
                                <th>Montant verse</th>
                                <th>Taxes</th>
                                <th>Net</th>
                                <th>kWh</th>
                                <th>Statut</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-t>
                            <tr>
                                <td>{{ t.dateTransaction | date:'dd/MM/yyyy' }}</td>
                                <td>{{ t.montantVerse | number }} FCFA</td>
                                <td>{{ t.montantTaxes | number }} FCFA</td>
                                <td>{{ t.montantNet | number }} FCFA</td>
                                <td>{{ t.quantiteKwh }} kWh</td>
                                <td>{{ t.statut }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>
    `
})
export class SuiviConsommationsComponent {
    numeroCompteur = '';
    transactions: any[] = [];

    constructor(
        private venteService: VenteService,
        private abonnementService: AbonnementService,
        private notification: NotificationService
    ) {}

    rechercher(): void {
        if (!this.numeroCompteur) return;

        this.abonnementService.trouverParCompteur(this.numeroCompteur).subscribe({
            next: (abonnement) => {
                this.venteService.listerParAbonnement(abonnement.id!).subscribe({
                    next: (data) => this.transactions = data
                });
            },
            error: () => this.notification.erreur('Aucun abonnement trouve pour ce compteur')
        });
    }
}
