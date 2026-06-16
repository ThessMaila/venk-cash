import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul>`,
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];
    private authService = inject(AuthentificationService);

    ngOnInit() {
        const profil = this.authService.getProfil();
        const estCaissiere = profil === 'CAISSIERE';
        const estChef = profil === 'CHEF_GUICHET' || profil === 'ADMINISTRATEUR';
        const estAdmin = profil === 'ADMINISTRATEUR';

        this.model = [
            {
                label: 'Tableau de bord',
                items: [
                    { label: 'Accueil', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Ventes',
                visible: !estAdmin,
                items: [
                    { label: 'Nouvelle vente', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/ventes/nouveau'] },
                    { label: 'Historique', icon: 'pi pi-fw pi-history', routerLink: ['/ventes/historique'] }
                ]
            },
            {
                label: 'Gestion',
                visible: estChef,
                items: [
                    { label: 'Abonnements', icon: 'pi pi-fw pi-file', routerLink: ['/abonnements'] },
                    { label: 'Nouvel abonnement', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/abonnements/nouveau'] },
                    { label: 'Compteurs', icon: 'pi pi-fw pi-microchip', routerLink: ['/compteurs'] }
                ]
            },
            {
                label: 'Rapports',
                visible: estChef,
                items: [
                    { label: 'Cloture de caisse', icon: 'pi pi-fw pi-calculator', routerLink: ['/rapports/cloture'] },
                    { label: 'Suivi consommations', icon: 'pi pi-fw pi-chart-line', routerLink: ['/rapports/consommations'] }
                ]
            }
        ];
    }
}
