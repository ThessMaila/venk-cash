import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { VenteService } from '../../../services/vente.service';
import { NotificationService } from '../../../services/notification.service';
import { TransactionRecente } from '../../../dto/reponses/transaction-recente.dto';

@Component({
    selector: 'app-historique-ventes',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, TagModule, ButtonModule],
    template: `
        <div class="card">
            <h2 class="text-2xl font-bold mb-4">Historique des ventes</h2>
            <p-table [value]="transactions" [paginator]="true" [rows]="15" [rowsPerPageOptions]="[15,30,50]" sortField="dateTransaction" [sortOrder]="-1">
                <ng-template #header>
                    <tr>
                        <th>Code</th>
                        <th>Client</th>
                        <th>Compteur</th>
                        <th>Montant</th>
                        <th>kWh</th>
                        <th>Date</th>
                        <th>Caissiere</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template #body let-t>
                    <tr>
                        <td>{{ t.codeTransaction }}</td>
                        <td>{{ t.prenomAbonne }} {{ t.nomAbonne }}</td>
                        <td>{{ t.numeroCompteur }}</td>
                        <td>{{ t.montantVerse | number }} FCFA</td>
                        <td>{{ t.quantiteKwh }} kWh</td>
                        <td>{{ t.dateTransaction | date:'dd/MM/yyyy HH:mm' }}</td>
                        <td>{{ t.caissiere }}</td>
                        <td><p-tag [value]="t.statut" [severity]="t.statut === 'VALIDEE' ? 'success' : 'danger'" /></td>
                        <td>
                            <button pButton icon="pi pi-file-pdf" class="p-button-rounded p-button-text" (onClick)="telechargerRecu(t)"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class HistoriqueVentesComponent implements OnInit {
    transactions: TransactionRecente[] = [];

    constructor(
        private venteService: VenteService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this.venteService.listerRecentes().subscribe({
            next: (data) => this.transactions = data
        });
    }

    telechargerRecu(t: TransactionRecente): void {
        this.notification.information('Telechargement disponible dans la page de vente');
    }
}
