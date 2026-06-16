import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AbonnementService } from '../../../services/abonnement.service';
import { Abonnement } from '../../../modeles/abonnement.modele';

@Component({
    selector: 'app-liste-abonnements',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, TagModule],
    template: `
        <div class="card">
            <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="text-2xl font-bold">Abonnements</h2>
                <a routerLink="/abonnements/nouveau" pButton label="Nouvel abonnement" icon="pi pi-plus"></a>
            </div>
            <p-table [value]="abonnements" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10,20,50]">
                <ng-template #header>
                    <tr>
                        <th>N° Abonnement</th>
                        <th>Client</th>
                        <th>Compteur</th>
                        <th>Puissance</th>
                        <th>Branchement</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template #body let-a>
                    <tr>
                        <td>{{ a.numeroAbonnement }}</td>
                        <td>{{ a.abonne.prenom }} {{ a.abonne.nom }}</td>
                        <td>{{ a.compteur.numeroCompteur }}</td>
                        <td>{{ a.tarif.puissanceAmperes }}A</td>
                        <td>{{ a.branchement.codeBranchement }}</td>
                        <td>
                            <p-tag [value]="a.statut" [severity]="a.statut === 'ACTIF' ? 'success' : a.statut === 'SUSPENDU' ? 'warn' : 'danger'" />
                        </td>
                        <td>{{ a.dateSouscription | date:'dd/MM/yyyy' }}</td>
                        <td>
                            <button pButton icon="pi pi-search" class="p-button-rounded p-button-text" [routerLink]="['/abonnements', a.id]"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class ListeAbonnementsComponent implements OnInit {
    abonnements: Abonnement[] = [];

    constructor(
        private abonnementService: AbonnementService,
        private cdr: ChangeDetectorRef
    ) {
        afterNextRender(() => this.chargerAbonnements());
    }

    private chargerAbonnements(): void {
        this.abonnementService.listerTous().subscribe({
            next: (data) => {
                this.abonnements = data;
                this.cdr.markForCheck();
            }
        });
    }

    ngOnInit(): void {
    }
}
