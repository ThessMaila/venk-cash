import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { AbonnementService } from '../../../services/abonnement.service';
import { CompteurService } from '../../../services/compteur.service';
import { RapportService } from '../../../services/rapport.service';
import { NotificationService } from '../../../services/notification.service';
import { RequeteSouscription } from '../../../dto/requetes/requete-souscription.dto';
import { Compteur } from '../../../modeles/compteur.modele';

@Component({
    selector: 'app-formulaire-abonnement',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CardModule, InputTextModule, InputNumberModule, SelectModule, ToastModule],
    template: `
        <div class="card">
            <h2 class="text-2xl font-bold mb-4">Nouvel abonnement</h2>
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-6">
                    <label class="block font-medium mb-1">Nom</label>
                    <input pInputText class="w-full" [(ngModel)]="nom" placeholder="Nom du client" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block font-medium mb-1">Prenom</label>
                    <input pInputText class="w-full" [(ngModel)]="prenom" placeholder="Prenom du client" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block font-medium mb-1">Email</label>
                    <input pInputText class="w-full" [(ngModel)]="email" placeholder="Email" />
                </div>
                <div class="col-span-12 md:col-span-6">
                    <label class="block font-medium mb-1">Telephone</label>
                    <input pInputText class="w-full" [(ngModel)]="telephone" placeholder="Telephone" />
                </div>
                <div class="col-span-12">
                    <label class="block font-medium mb-1">Adresse</label>
                    <input pInputText class="w-full" [(ngModel)]="adresse" placeholder="Adresse" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block font-medium mb-1">Code branchement</label>
                    <input pInputText class="w-full" [(ngModel)]="codeBranchement" placeholder="Ex: BR-001" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block font-medium mb-1">Puissance souscrite</label>
                    <p-select [options]="puissances" [(ngModel)]="puissance" optionLabel="libelle" optionValue="valeur" class="w-full" placeholder="Choisir la puissance" />
                </div>
                <div class="col-span-12 md:col-span-4">
                    <label class="block font-medium mb-1">Compteur</label>
                    <p-select [options]="compteurs" [(ngModel)]="compteurChoisi" optionLabel="numeroCompteur" optionValue="numeroCompteur" class="w-full" placeholder="Choisir un compteur">
                        <ng-template #item let-c>
                            {{ c.numeroCompteur }} - {{ c.numeroSerie }}
                        </ng-template>
                    </p-select>
                </div>
                <div class="col-span-12">
                    <button pButton label="Souscrire l'abonnement" icon="pi pi-check" (onClick)="souscrire()" [loading]="chargement" class="mr-2"></button>
                    <a routerLink="/abonnements" pButton label="Annuler" class="p-button-secondary"></a>
                </div>
            </div>
        </div>
    `
})
export class FormulaireAbonnementComponent implements OnInit {
    nom = '';
    prenom = '';
    email = '';
    telephone = '';
    adresse = '';
    codeBranchement = '';
    puissance: number = 3;
    compteurChoisi: string = '';
    chargement = false;
    puissances = [
        { libelle: '3 Ampères', valeur: 3 },
        { libelle: '5 Ampères', valeur: 5 }
    ];
    compteurs: Compteur[] = [];

    constructor(
        private abonnementService: AbonnementService,
        private compteurService: CompteurService,
        private notification: NotificationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.compteurService.listerDisponibles().subscribe({
            next: (data) => this.compteurs = data
        });
    }

    souscrire(): void {
        if (!this.nom || !this.prenom || !this.codeBranchement || !this.compteurChoisi) {
            this.notification.avertir('Veuillez remplir tous les champs obligatoires');
            return;
        }

        this.chargement = true;
        const requete: RequeteSouscription = {
            nom: this.nom,
            prenom: this.prenom,
            email: this.email || undefined,
            telephone: this.telephone || undefined,
            adresse: this.adresse || undefined,
            codeBranchement: this.codeBranchement,
            puissanceAmperes: this.puissance,
            numeroCompteur: this.compteurChoisi
        };

        this.abonnementService.souscrire(requete).subscribe({
            next: () => {
                this.notification.succes('Abonnement cree avec succes');
                this.router.navigate(['/abonnements']);
            },
            error: (err) => {
                this.chargement = false;
                this.notification.erreur(err.error?.message || 'Erreur lors de la creation');
            }
        });
    }
}
