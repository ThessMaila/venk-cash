import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { gardeAuthentification } from './app/gardes/garde-authentification.guard';

export const appRoutes: Routes = [
    {
        path: 'connexion',
        loadComponent: () => import('./app/pages/authentification/connexion/connexion.component').then(c => c.ConnexionComponent)
    },
    {
        path: '',
        component: AppLayout,
        canActivate: [gardeAuthentification],
        children: [
            { path: '', loadComponent: () => import('./app/pages/tableau-de-bord/tableau-de-bord.component').then(c => c.TableauDeBordComponent) },
            { path: 'abonnements', loadComponent: () => import('./app/pages/abonnements/liste-abonnements/liste-abonnements.component').then(c => c.ListeAbonnementsComponent) },
            { path: 'abonnements/nouveau', loadComponent: () => import('./app/pages/abonnements/formulaire-abonnement/formulaire-abonnement.component').then(c => c.FormulaireAbonnementComponent) },
            { path: 'abonnements/:id', loadComponent: () => import('./app/pages/abonnements/details-abonnement/details-abonnement.component').then(c => c.DetailsAbonnementComponent) },
            { path: 'ventes/nouveau', loadComponent: () => import('./app/pages/ventes/formulaire-vente/formulaire-vente.component').then(c => c.FormulaireVenteComponent) },
            { path: 'ventes/historique', loadComponent: () => import('./app/pages/ventes/historique-ventes/historique-ventes.component').then(c => c.HistoriqueVentesComponent) },
            { path: 'compteurs', loadComponent: () => import('./app/pages/compteurs/liste-compteurs/liste-compteurs.component').then(c => c.ListeCompteursComponent) },
            { path: 'rapports/cloture', loadComponent: () => import('./app/pages/rapports/cloture-caisse/cloture-caisse.component').then(c => c.ClotureCaisseComponent) },
            { path: 'rapports/consommations', loadComponent: () => import('./app/pages/rapports/suivi-consommations/suivi-consommations.component').then(c => c.SuiviConsommationsComponent) }
        ]
    },
    { path: '**', redirectTo: '' }
];
