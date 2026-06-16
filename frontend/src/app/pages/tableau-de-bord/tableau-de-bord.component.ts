import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { RapportService } from '../../services/rapport.service';
import { VenteService } from '../../services/vente.service';
import { Statistique } from '../../dto/reponses/statistique.dto';
import { TransactionRecente } from '../../dto/reponses/transaction-recente.dto';

/**
 * Composant du tableau de bord VENK-CASH.
 * Affiche les statistiques et les transactions recentes.
 */
@Component({
    selector: 'app-tableau-de-bord',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule, TableModule, ButtonModule, TagModule, RouterModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <!-- Titre -->
            <div class="col-span-12">
                <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">Tableau de bord</h2>
                <p class="text-muted-color">Vue d'ensemble des activites de vente et des abonnements</p>
            </div>

            <!-- Cartes statistiques principales -->
            <div class="col-span-12 lg:col-span-3 md:col-span-6">
                <p-card styleClass="h-full">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <p class="text-500 mb-1">Abonnements actifs</p>
                            <h3 class="text-3xl font-bold text-primary">{{ stats?.totalAbonnementsActifs || 0 }}</h3>
                            <p class="text-sm text-muted-color">{{ stats?.totalAbonnes || 0 }} abonnes</p>
                        </div>
                        <div class="bg-primary-50 dark:bg-primary-900 p-3 border-round">
                            <i class="pi pi-users text-2xl text-primary"></i>
                        </div>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12 lg:col-span-3 md:col-span-6">
                <p-card styleClass="h-full">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <p class="text-500 mb-1">kWh vendus aujourd'hui</p>
                            <h3 class="text-3xl font-bold text-orange-600">{{ stats?.totalKwhVendusAujourdhui || 0 }}</h3>
                            <p class="text-sm text-muted-color">kWh</p>
                        </div>
                        <div class="bg-orange-50 dark:bg-orange-900 p-3 border-round">
                            <i class="pi pi-bolt text-2xl text-orange-500"></i>
                        </div>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12 lg:col-span-3 md:col-span-6">
                <p-card styleClass="h-full">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <p class="text-500 mb-1">CA aujourd'hui</p>
                            <h3 class="text-3xl font-bold text-green-600">{{ (stats?.totalChiffreAffaireAujourdhui || 0) | number }}</h3>
                            <p class="text-sm text-muted-color">FCFA</p>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900 p-3 border-round">
                            <i class="pi pi-dollar text-2xl text-green-500"></i>
                        </div>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12 lg:col-span-3 md:col-span-6">
                <p-card styleClass="h-full">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <p class="text-500 mb-1">Compteurs en stock</p>
                            <h3 class="text-3xl font-bold text-blue-600">{{ stats?.totalCompteursEnStock || 0 }}</h3>
                            <p class="text-sm text-muted-color">{{ stats?.totalCompteursActifs || 0 }} actifs</p>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-900 p-3 border-round">
                            <i class="pi pi-box text-2xl text-blue-500"></i>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Statistiques hebdomadaires -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Statistiques de la semaine">
                    <div class="flex flex-column gap-3">
                        <div class="flex justify-content-between align-items-center p-3 bg-surface-50 dark:bg-surface-800 border-round">
                            <div>
                                <p class="text-500 text-sm">kWh vendus</p>
                                <p class="font-bold text-lg">{{ stats?.totalKwhVendusSemaine || 0 }}</p>
                            </div>
                            <i class="pi pi-chart-line text-2xl text-primary"></i>
                        </div>
                        <div class="flex justify-content-between align-items-center p-3 bg-surface-50 dark:bg-surface-800 border-round">
                            <div>
                                <p class="text-500 text-sm">Chiffre d'affaires</p>
                                <p class="font-bold text-lg">{{ (stats?.totalChiffreAffaireSemaine || 0) | number }} FCFA</p>
                            </div>
                            <i class="pi pi-money-bill text-2xl text-green-500"></i>
                        </div>
                        <div class="flex justify-content-between align-items-center p-3 bg-surface-50 dark:bg-surface-800 border-round">
                            <div>
                                <p class="text-500 text-sm">kWh ce mois</p>
                                <p class="font-bold text-lg">{{ stats?.totalKwhVendusMois || 0 }}</p>
                            </div>
                            <i class="pi pi-calendar text-2xl text-blue-500"></i>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Graphique -->
            <div class="col-span-12 lg:col-span-8">
                <p-card header="Ventes de la semaine (kWh)">
                    <ng-container *ngIf="chartData; else chartSkeleton">
                        <p-chart type="bar" [data]="chartData" [options]="chartOptions" styleClass="h-18rem"></p-chart>
                    </ng-container>
                    <ng-template #chartSkeleton>
                        <div class="flex justify-content-center align-items-center h-18rem">
                            <i class="pi pi-spinner pi-spin text-2xl text-primary"></i>
                        </div>
                    </ng-template>
                </p-card>
            </div>

            <!-- Transactions recentes -->
            <div class="col-span-12">
                <p-card>
                    <ng-template #header>
                        <div class="flex justify-content-between align-items-center px-4 py-3">
                            <h3 class="font-bold m-0">Transactions recentes</h3>
                            <a routerLink="/ventes/historique" pButton label="Voir tout" icon="pi pi-arrow-right" iconPos="right" styleClass="p-button-text p-button-sm"></a>
                        </div>
                    </ng-template>
                    <p-table [value]="transactions" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]" styleClass="p-datatable-striped">
                        <ng-template #header>
                            <tr>
                                <th>Code</th>
                                <th>Client</th>
                                <th>Compteur</th>
                                <th>Montant</th>
                                <th>kWh</th>
                                <th>Date</th>
                                <th>Statut</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-t>
                            <tr>
                                <td><code class="bg-surface-100 dark:bg-surface-700 px-2 py-1 border-round">{{ t.codeTransaction }}</code></td>
                                <td>
                                    <div class="flex flex-column">
                                        <span class="font-medium">{{ t.prenomAbonne }} {{ t.nomAbonne }}</span>
                                    </div>
                                </td>
                                <td>{{ t.numeroCompteur }}</td>
                                <td>
                                    <span class="font-bold">{{ t.montantVerse | number }}</span>
                                    <span class="text-500 text-sm ml-1">FCFA</span>
                                </td>
                                <td>
                                    <span class="font-bold text-primary">{{ t.quantiteKwh }}</span>
                                    <span class="text-500 text-sm ml-1">kWh</span>
                                </td>
                                <td>{{ t.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</td>
                                <td>
                                    <p-tag [value]="t.statut === 'VALIDEE' ? 'Validee' : 'Annulee'"
                                           [severity]="t.statut === 'VALIDEE' ? 'success' : 'danger'"></p-tag>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="7" class="text-center py-4">
                                    <i class="pi pi-inbox text-4xl text-400 mb-2 block"></i>
                                    <p class="text-500">Aucune transaction recente</p>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>

            <!-- Raccourcis actions -->
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Actions rapides">
                    <div class="grid grid-cols-2 gap-3">
                        <a routerLink="/ventes/nouveau" class="col-span-1">
                            <div class="bg-primary-50 dark:bg-primary-900 p-4 border-round hover:surface-200 cursor-pointer transition-colors transition-duration-200">
                                <i class="pi pi-shopping-cart text-2xl text-primary mb-2 block"></i>
                                <p class="font-bold">Nouvelle vente</p>
                                <p class="text-sm text-muted-color">Effectuer une vente de kWh</p>
                            </div>
                        </a>
                        <a routerLink="/abonnements/nouveau" class="col-span-1">
                            <div class="bg-green-50 dark:bg-green-900 p-4 border-round hover:surface-200 cursor-pointer transition-colors transition-duration-200">
                                <i class="pi pi-user-plus text-2xl text-green-500 mb-2 block"></i>
                                <p class="font-bold">Nouvel abonnement</p>
                                <p class="text-sm text-muted-color">Creer un abonnement</p>
                            </div>
                        </a>
                        <a routerLink="/rapports/cloture" class="col-span-1">
                            <div class="bg-orange-50 dark:bg-orange-900 p-4 border-round hover:surface-200 cursor-pointer transition-colors transition-duration-200">
                                <i class="pi pi-calculator text-2xl text-orange-500 mb-2 block"></i>
                                <p class="font-bold">Cloture caisse</p>
                                <p class="text-sm text-muted-color">Gerer les sessions</p>
                            </div>
                        </a>
                        <a routerLink="/rapports/consommations" class="col-span-1">
                            <div class="bg-blue-50 dark:bg-blue-900 p-4 border-round hover:surface-200 cursor-pointer transition-colors transition-duration-200">
                                <i class="pi pi-chart-bar text-2xl text-blue-500 mb-2 block"></i>
                                <p class="font-bold">Statistiques</p>
                                <p class="text-sm text-muted-color">Voir les rapports</p>
                            </div>
                        </a>
                    </div>
                </p-card>
            </div>

            <!-- Resume du jour -->
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Resume du jour">
                    <div class="bg-gradient-to-r from-primary to-primary-700 p-4 border-round text-white">
                        <div class="flex justify-content-between align-items-center mb-3">
                            <span class="font-bold text-lg">Performances du jour</span>
                            <i class="pi pi-chart-pie text-2xl"></i>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <p class="text-white-alpha-70 text-sm">Ventes realisees</p>
                                <p class="font-bold text-2xl">{{ getNombreVentesJour() }}</p>
                            </div>
                            <div>
                                <p class="text-white-alpha-70 text-sm">Total encaisse</p>
                                <p class="font-bold text-2xl">{{ (stats?.totalChiffreAffaireAujourdhui || 0) | number }}</p>
                            </div>
                            <div>
                                <p class="text-white-alpha-70 text-sm">Energie vendue</p>
                                <p class="font-bold text-2xl">{{ stats?.totalKwhVendusAujourdhui || 0 }} kWh</p>
                            </div>
                            <div>
                                <p class="text-white-alpha-70 text-sm">Moyenne par vente</p>
                                <p class="font-bold text-2xl">{{ getMoyenneVente() | number }}</p>
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>
        </div>
    `
})
export class TableauDeBordComponent implements OnInit {
    stats: Statistique | null = null;
    transactions: TransactionRecente[] = [];
    chartData: any = null;
    chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'kWh' }
            }
        }
    };

    constructor(
        private rapportService: RapportService,
        private venteService: VenteService,
        private cdr: ChangeDetectorRef
    ) {
        afterNextRender(() => this.chargerDonnees());
    }

    ngOnInit(): void {}

    private chargerDonnees(): void {
        this.rapportService.obtenirStatistiques().subscribe({
            next: (data) => {
                this.stats = data;
                this.initChart();
                this.cdr.markForCheck();
            },
            error: (err) => console.error('Erreur chargement stats:', err)
        });

        this.venteService.listerRecentes().subscribe({
            next: (data) => {
                this.transactions = data;
                this.cdr.markForCheck();
            },
            error: (err) => console.error('Erreur chargement transactions:', err)
        });
    }

    private initChart(): void {
        const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const data = [45, 62, 55, 70, 85, 40, this.stats?.totalKwhVendusAujourdhui || 0];

        this.chartData = {
            labels: jours,
            datasets: [{
                label: 'kWh vendus',
                data: data,
                backgroundColor: 'rgba(0, 133, 63, 0.6)',
                borderColor: 'rgba(0, 133, 63, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        };
    }

    getNombreVentesJour(): number {
        return this.transactions.filter(t => {
            const today = new Date().toDateString();
            return new Date(t.dateTransaction).toDateString() === today && t.statut === 'VALIDEE';
        }).length;
    }

    getMoyenneVente(): number {
        const nombre = this.getNombreVentesJour();
        if (nombre === 0) return 0;
        return Math.round((this.stats?.totalChiffreAffaireAujourdhui || 0) / nombre);
    }
}
