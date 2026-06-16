import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { AuthentificationService } from '../../../services/authentification.service';
import { NotificationService } from '../../../services/notification.service';
import { RequeteConnexion } from '../../../dto/requetes/requete-connexion.dto';

@Component({
    selector: 'app-connexion',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ToastModule],

    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-16 px-8 sm:px-16" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">VENK-CASH | SONABEL</div>
                            <span class="text-muted-color font-medium">Gestion des ventes de kWh</span>
                        </div>

                        <div>
                            <label for="identifiant" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Identifiant</label>
                            <input pInputText id="identifiant" type="text" placeholder="Votre identifiant" class="w-full mb-6" [(ngModel)]="identifiant" />

                            <label for="motdepasse" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                            <p-password id="motdepasse" [(ngModel)]="motDePasse" placeholder="Votre mot de passe" [toggleMask]="true" styleClass="mb-6" [fluid]="true" [feedback]="false"></p-password>

                            <p-button label="Se connecter" styleClass="w-full" (onClick)="connecter()" [loading]="chargement"></p-button>
                        </div>

                        <div class="text-center mt-6">
                            <span class="text-muted-color text-sm">Application de gestion des ventes de kWh</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class ConnexionComponent {
    identifiant: string = '';
    motDePasse: string = '';
    chargement: boolean = false;

    constructor(
        private authService: AuthentificationService,
        private router: Router,
        private notification: NotificationService
    ) {}

    connecter(): void {
        if (!this.identifiant || !this.motDePasse) {
            this.notification.avertir('Veuillez remplir tous les champs');
            return;
        }

        this.chargement = true;
        const requete: RequeteConnexion = {
            nomUtilisateur: this.identifiant,
            motDePasse: this.motDePasse
        };

        console.log('Envoi requete:', JSON.stringify(requete));

        this.authService.connecter(requete).subscribe({
            next: () => {
                this.notification.succes('Connexion reussie');
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.chargement = false;
                console.error('Erreur connexion:', err.status, err.statusText, err.error);
                this.notification.erreur('Identifiant ou mot de passe incorrect');
            }
        });
    }
}
