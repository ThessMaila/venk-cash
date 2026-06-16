import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CompteurService } from '../../../services/compteur.service';
import { NotificationService } from '../../../services/notification.service';
import { Compteur } from '../../../modeles/compteur.modele';

@Component({
    selector: 'app-liste-compteurs',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, TagModule, ButtonModule, DialogModule, InputTextModule, FormsModule],
    template: `
        <div class="card">
            <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="text-2xl font-bold">Compteurs</h2>
                <button pButton label="Nouveau compteur" icon="pi pi-plus" (onClick)="afficherDialogue = true"></button>
            </div>
            <p-table [value]="compteurs" [paginator]="true" [rows]="10">
                <ng-template #header>
                    <tr>
                        <th>N° Compteur</th>
                        <th>N° Serie</th>
                        <th>Statut</th>
                        <th>Emplacement</th>
                    </tr>
                </ng-template>
                <ng-template #body let-c>
                    <tr>
                        <td>{{ c.numeroCompteur }}</td>
                        <td>{{ c.numeroSerie }}</td>
                        <td>
                            <p-tag [value]="c.statut" [severity]="c.statut === 'ACTIF' ? 'success' : c.statut === 'EN_STOCK' ? 'info' : 'warn'" />
                        </td>
                        <td>{{ c.emplacement }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog header="Nouveau compteur" [(visible)]="afficherDialogue" [modal]="true" styleClass="w-30rem">
            <div class="flex flex-column gap-3">
                <div>
                    <label class="block font-medium mb-1">Numero compteur</label>
                    <input pInputText class="w-full" [(ngModel)]="nouveauNumero" placeholder="Ex: CPT-0011" />
                </div>
                <div>
                    <label class="block font-medium mb-1">Numero serie</label>
                    <input pInputText class="w-full" [(ngModel)]="nouveauSerie" placeholder="Ex: SER-2024-011" />
                </div>
                <div>
                    <label class="block font-medium mb-1">Emplacement</label>
                    <input pInputText class="w-full" [(ngModel)]="nouvelEmplacement" placeholder="Ex: Magasin central" />
                </div>
                <button pButton label="Enregistrer" icon="pi pi-check" (onClick)="creerCompteur()"></button>
            </div>
        </p-dialog>
    `
})
export class ListeCompteursComponent implements OnInit {
    compteurs: Compteur[] = [];
    afficherDialogue = false;
    nouveauNumero = '';
    nouveauSerie = '';
    nouvelEmplacement = 'Magasin central';

    constructor(
        private compteurService: CompteurService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this.chargerCompteurs();
    }

    chargerCompteurs(): void {
        this.compteurService.listerTous().subscribe({
            next: (data) => this.compteurs = data
        });
    }

    creerCompteur(): void {
        if (!this.nouveauNumero) {
            this.notification.avertir('Le numero compteur est requis');
            return;
        }
        this.compteurService.creer({
            numeroCompteur: this.nouveauNumero,
            numeroSerie: this.nouveauSerie,
            statut: 'EN_STOCK',
            emplacement: this.nouvelEmplacement
        }).subscribe({
            next: () => {
                this.notification.succes('Compteur cree avec succes');
                this.afficherDialogue = false;
                this.nouveauNumero = '';
                this.nouveauSerie = '';
                this.chargerCompteurs();
            },
            error: (err) => this.notification.erreur(err.error?.message || 'Erreur')
        });
    }
}
