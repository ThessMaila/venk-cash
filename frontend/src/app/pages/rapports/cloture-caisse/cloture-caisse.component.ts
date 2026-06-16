import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { RapportService } from '../../../services/rapport.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-cloture-caisse',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, TableModule, InputTextModule, InputNumberModule, DividerModule, FormsModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12">
                <h2 class="text-2xl font-bold mb-4">Gestion de caisse</h2>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <p-card header="Ouverture de caisse">
                    <div class="flex flex-column gap-3">
                        <div>
                            <label class="block font-medium mb-1">Solde initial (FCFA)</label>
                            <p-inputNumber [(ngModel)]="soldeInitial" [min]="0" class="w-full"></p-inputNumber>
                        </div>
                        <button pButton label="Ouvrir la caisse" icon="pi pi-lock-open" (onClick)="ouvrirCaisse()" [loading]="chargement"></button>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <p-card header="Recapitulatif session en cours">
                    <div *ngIf="recap">
                        <div class="flex justify-content-between mb-2">
                            <span>Solde initial:</span>
                            <span class="font-bold">{{ recap.session?.soldeInitial | number }} FCFA</span>
                        </div>
                        <div class="flex justify-content-between mb-2">
                            <span>Total ventes:</span>
                            <span class="font-bold text-green-600">{{ recap.totalVentes | number }} FCFA</span>
                        </div>
                        <div class="flex justify-content-between mb-2">
                            <span>Total kWh vendus:</span>
                            <span class="font-bold">{{ recap.totalKwh }} kWh</span>
                        </div>
                        <div class="flex justify-content-between mb-2">
                            <span>Nombre transactions:</span>
                            <span class="font-bold">{{ recap.nombreTransactions }}</span>
                        </div>
                        <p-divider></p-divider>
                        <div class="flex justify-content-between mb-2">
                            <span class="text-lg font-bold">Solde attendu:</span>
                            <span class="text-lg font-bold text-primary">{{ recap.soldeAttendu | number }} FCFA</span>
                        </div>
                    </div>
                    <div *ngIf="!recap" class="text-center text-muted p-3">
                        <p>Aucune session ouverte</p>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <p-card header="Fermeture de caisse">
                    <div class="flex flex-column gap-3">
                        <div>
                            <label class="block font-medium mb-1">Remarques</label>
                            <input pInputText class="w-full" [(ngModel)]="remarquesFermeture" placeholder="Observations..." />
                        </div>
                        <button pButton label="Fermer la caisse" icon="pi pi-lock" class="p-button-danger" (onClick)="fermerCaisse()" [loading]="chargementFermeture"></button>
                    </div>
                </p-card>
            </div>

            <div class="col-span-12" *ngIf="historique.length">
                <p-card header="Historique des sessions">
                    <p-table [value]="historique">
                        <ng-template #header>
                            <tr>
                                <th>Date ouverture</th>
                                <th>Date fermeture</th>
                                <th>Solde initial</th>
                                <th>Solde final</th>
                                <th>Statut</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-s>
                            <tr>
                                <td>{{ s.dateOuverture | date:'dd/MM/yyyy HH:mm' }}</td>
                                <td>{{ (s.dateFermeture | date:'dd/MM/yyyy HH:mm') || '-' }}</td>
                                <td>{{ s.soldeInitial | number }} FCFA</td>
                                <td>{{ (s.soldeFinal | number) || '-' }} FCFA</td>
                                <td>{{ s.statut }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>
    `
})
export class ClotureCaisseComponent implements OnInit {
    soldeInitial = 0;
    remarquesFermeture = '';
    chargement = false;
    chargementFermeture = false;
    recap: any = null;
    historique: any[] = [];

    constructor(
        private rapportService: RapportService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this.chargerRecap();
        this.rapportService.historiqueSessions().subscribe({
            next: (data) => this.historique = data
        });
    }

    chargerRecap(): void {
        this.rapportService.obtenirRecapitulatifSession().subscribe({
            next: (data) => this.recap = data,
            error: () => this.recap = null
        });
    }

    ouvrirCaisse(): void {
        this.chargement = true;
        this.rapportService.ouvrirSession(this.soldeInitial).subscribe({
            next: () => {
                this.notification.succes('Caisse ouverte avec succes');
                this.chargement = false;
                this.chargerRecap();
            },
            error: (err) => {
                this.chargement = false;
                this.notification.erreur(err.error?.message || 'Erreur');
            }
        });
    }

    fermerCaisse(): void {
        this.chargementFermeture = true;
        this.rapportService.fermerSession(this.remarquesFermeture).subscribe({
            next: () => {
                this.notification.succes('Caisse fermee avec succes');
                this.chargementFermeture = false;
                this.recap = null;
            },
            error: (err) => {
                this.chargementFermeture = false;
                this.notification.erreur(err.error?.message || 'Erreur');
            }
        });
    }
}
