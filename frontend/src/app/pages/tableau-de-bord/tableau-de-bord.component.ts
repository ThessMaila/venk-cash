import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { RapportService } from '../../services/rapport.service';
import { VenteService } from '../../services/vente.service';
import { Statistique } from '../../dto/reponses/statistique.dto';
import { TransactionRecente } from '../../dto/reponses/transaction-recente.dto';

@Component({
    selector: 'app-tableau-de-bord',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule, TableModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12">
                <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-4">Tableau de bord</h2>
            </div>

            <!-- Cartes statistiques -->
            <div class="col-span-12 lg:col-span-3">
                <p-card styleClass="text-center">
                    <i class="pi pi-users text-3xl text-primary mb-2"></i>
                    <h3 class="text-xl font-bold">{{ stats?.totalAbonnementsActifs || 0 }}</h3>
                    <p class="text-muted-color">Abonnements actifs</p>
                </p-card>
            </div>
            <div class="col-span-12 lg:col-span-3">
                <p-card styleClass="text-center">
                    <i class="pi pi-bolt text-3xl text-orange-500 mb-2"></i>
                    <h3 class="text-xl font-bold">{{ stats?.totalKwhVendusAujourdhui || 0 }} kWh</h3>
                    <p class="text-muted-color">Vendus aujourd'hui</p>
                </p-card>
            </div>
            <div class="col-span-12 lg:col-span-3">
                <p-card styleClass="text-center">
                    <i class="pi pi-dollar text-3xl text-green-500 mb-2"></i>
                    <h3 class="text-xl font-bold">{{ (stats?.totalChiffreAffaireAujourdhui || 0) | number }} FCFA</h3>
                    <p class="text-muted-color">CA aujourd'hui</p>
                </p-card>
            </div>
            <div class="col-span-12 lg:col-span-3">
                <p-card styleClass="text-center">
                    <i class="pi pi-box text-3xl text-blue-500 mb-2"></i>
                    <h3 class="text-xl font-bold">{{ stats?.totalCompteursEnStock || 0 }}</h3>
                    <p class="text-muted-color">Compteurs en stock</p>
                </p-card>
            </div>

            <!-- Graphique -->
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Ventes hebdomadaires">
                    <canvas id="chartVentes"></canvas>
                </p-card>
            </div>
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Transactions recentes">
                    <p-table [value]="transactions" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]">
                        <ng-template #header>
                            <tr>
                                <th>Code</th>
                                <th>Client</th>
                                <th>Montant</th>
                                <th>kWh</th>
                                <th>Date</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-t>
                            <tr>
                                <td>{{ t.codeTransaction }}</td>
                                <td>{{ t.prenomAbonne }} {{ t.nomAbonne }}</td>
                                <td>{{ t.montantVerse | number }} FCFA</td>
                                <td>{{ t.quantiteKwh }} kWh</td>
                                <td>{{ t.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>
    `
})
export class TableauDeBordComponent implements OnInit {
    stats: Statistique | null = null;
    transactions: TransactionRecente[] = [];

    constructor(
        private rapportService: RapportService,
        private venteService: VenteService,
        private cdr: ChangeDetectorRef
    ) {
        afterNextRender(() => this.chargerDonnees());
    }

    private chargerDonnees(): void {
        this.rapportService.obtenirStatistiques().subscribe({
            next: (data) => {
                this.stats = data;
                this.cdr.markForCheck();
            }
        });
        this.venteService.listerRecentes().subscribe({
            next: (data) => {
                this.transactions = data;
                this.cdr.markForCheck();
            }
        });
    }

    ngOnInit(): void {
    }
}
