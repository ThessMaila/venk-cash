# VENK-CASH | SONABEL

Application de gestion des ventes de kWh et de suivi des consommations pour les compteurs de 3 et 5 Ampères à la SONABEL.

## Architecture

- **Frontend** : Angular 21 + PrimeNG + Sakai Template
- **Backend** : Spring Boot 3.2 + JPA / Hibernate
- **Base de données** : MySQL

## Prérequis

- Java 17+
- Node.js 20+
- MySQL 8+
- Maven (inclus via `mvnw`)

## Installation

### 1. Base de données

```sql
CREATE DATABASE venk_cash_db;
```

### 2. Backend

```bash
cd backend
.\mvnw spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

L'application est accessible sur `http://localhost:4200`.

## Comptes de test

| Identifiant | Mot de passe | Profil |
|------------|-------------|--------|
| admin | sonabel123 | Administrateur |
| chef | sonabel123 | Chef de Guichet |
| caissiere1 | sonabel123 | Caissière |

STRUCTURE COMPLÈTE — APPLICATION VENK-CASH
Gestion des ventes de kWh — SONABEL
Frontend Angular 21 (Sakai-NG) + Backend Spring Boot + MySQL
---
🌐 FRONTEND — ANGULAR 21 (base Sakai-NG)
```
sakai-ng/src/
│
├── index.html
├── main.ts
├── styles.scss                          ← Palette SONABEL (vert #00853F)
│
├── environments/
│   ├── environnement.ts                 ← URL API développement
│   └── environnement.prod.ts            ← URL API production
│
├── assets/
│   ├── images/
│   │   ├── logo-sonabel.png
│   │   └── logo-venkcash.png
│   └── layout/
│       └── styles/
│           ├── theme/
│           │   └── theme-sonabel.scss   ← variables PrimeNG personnalisées
│           └── layout.scss              ← surcharge layout Sakai
│
└── app/
    │
    ├── app.config.ts                    ← configuration standalone Angular 21
    ├── app.routes.ts                    ← routes principales
    ├── app.component.ts
    │
    ├── disposition/                     ← LAYOUT (adaptation du layout/ Sakai)
    │   ├── disposition.component.ts     ← composant racine layout
    │   ├── disposition.component.html
    │   ├── barre-superieure/            ← topbar Sakai adapté
    │   │   ├── barre-superieure.component.ts
    │   │   └── barre-superieure.component.html
    │   ├── barre-laterale/              ← sidebar Sakai adapté (vert #00853F)
    │   │   ├── barre-laterale.component.ts
    │   │   └── barre-laterale.component.html
    │   ├── menu-navigation/             ← menu items Sakai adapté
    │   │   ├── menu-navigation.component.ts
    │   │   └── menu-navigation.component.html
    │   └── disposition.service.ts       ← gestion état sidebar (ouvert/fermé)
    │
    ├── modeles/                         ← INTERFACES TYPESCRIPT (forme des données)
    │   ├── abonne.modele.ts
    │   ├── abonnement.modele.ts
    │   ├── branchement.modele.ts
    │   ├── compteur.modele.ts
    │   ├── vente.modele.ts
    │   ├── encaissement.modele.ts
    │   ├── taxe.modele.ts
    │   ├── grille-tarifaire.modele.ts
    │   └── utilisateur.modele.ts
    │
    ├── dto/                             ← OBJETS DE TRANSFERT (échanges API)
    │   ├── requetes/                    ← ce qu'Angular ENVOIE au backend
    │   │   ├── requete-connexion.dto.ts
    │   │   ├── requete-abonnement.dto.ts
    │   │   ├── requete-vente.dto.ts
    │   │   └── requete-changement-abonne.dto.ts
    │   └── reponses/                    ← ce que le backend RETOURNE
    │       ├── reponse-connexion.dto.ts
    │       ├── reponse-abonnement.dto.ts
    │       ├── reponse-recapitulatif.dto.ts
    │       ├── reponse-vente.dto.ts
    │       └── reponse-erreur.dto.ts
    │
    ├── services/                        ← SERVICES (appels HTTP vers API)
    │   ├── authentification.service.ts
    │   ├── abonnement.service.ts
    │   ├── vente.service.ts
    │   ├── compteur.service.ts
    │   ├── rapport.service.ts
    │   ├── notification.service.ts      ← toasts PrimeNG (succès/erreur)
    │   └── intercepteur-jwt.service.ts  ← ajout token JWT à chaque requête
    │
    ├── gardes/                          ← GUARDS (protection des routes)
    │   └── garde-authentification.guard.ts
    │
    └── pages/                           ← PAGES (composants métier Sakai)
        │
        ├── authentification/
        │   └── connexion/
        │       ├── connexion.component.ts
        │       ├── connexion.component.html  ← style login.component Sakai
        │       └── connexion.component.scss
        │
        ├── tableau-de-bord/             ← dashboard (= dashboard Sakai)
        │   ├── tableau-de-bord.component.ts
        │   └── tableau-de-bord.component.html
        │
        ├── abonnements/
        │   ├── liste-abonnements/
        │   │   ├── liste-abonnements.component.ts
        │   │   └── liste-abonnements.component.html   ← p-table Sakai
        │   ├── formulaire-abonnement/
        │   │   ├── formulaire-abonnement.component.ts
        │   │   └── formulaire-abonnement.component.html ← p-dialog Sakai
        │   └── detail-abonnement/
        │       ├── detail-abonnement.component.ts
        │       └── detail-abonnement.component.html
        │
        ├── ventes/
        │   ├── formulaire-vente/         ← identification compteur + montant
        │   │   ├── formulaire-vente.component.ts
        │   │   └── formulaire-vente.component.html
        │   ├── recapitulatif-vente/      ← écran taxes + kWh avant paiement
        │   │   ├── recapitulatif-vente.component.ts
        │   │   └── recapitulatif-vente.component.html
        │   ├── recu-vente/               ← reçu imprimable + envoi email/SMS
        │   │   ├── recu-vente.component.ts
        │   │   └── recu-vente.component.html
        │   └── historique-ventes/
        │       ├── historique-ventes.component.ts
        │       └── historique-ventes.component.html    ← p-table Sakai
        │
        ├── compteurs/
        │   ├── liste-compteurs/
        │   │   ├── liste-compteurs.component.ts
        │   │   └── liste-compteurs.component.html
        │   └── formulaire-compteur/
        │       ├── formulaire-compteur.component.ts
        │       └── formulaire-compteur.component.html
        │
        └── rapports/
            ├── cloture-caisse/
            │   ├── cloture-caisse.component.ts
            │   └── cloture-caisse.component.html
            └── suivi-consommations/
                ├── suivi-consommations.component.ts
                └── suivi-consommations.component.html
```
---
⚙️ BACKEND — SPRING BOOT 3 + JAVA 17
```
venk-cash-backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/bf/sonabel/venkcash/
    │   │   │
    │   │   ├── VenkCashApplication.java          ← point d'entrée Spring Boot
    │   │   │
    │   │   ├── configuration/
    │   │   │   ├── ConfigurationSecurite.java     ← Spring Security + JWT
    │   │   │   ├── ConfigurationCors.java         ← autoriser Angular :4200
    │   │   │   └── ConfigurationJwt.java          ← secret + durée token
    │   │   │
    │   │   ├── entites/                           ← TABLES MySQL (@Entity JPA)
    │   │   │   ├── Abonne.java                    ← table : abonne
    │   │   │   ├── Abonnement.java                ← table : abonnement
    │   │   │   ├── Branchement.java               ← table : branchement
    │   │   │   ├── Compteur.java                  ← table : compteur
    │   │   │   ├── Vente.java                     ← table : vente
    │   │   │   ├── Encaissement.java              ← table : encaissement
    │   │   │   ├── Taxe.java                      ← table : taxe
    │   │   │   ├── GrilleTarifaire.java           ← table : grille_tarifaire
    │   │   │   ├── Utilisateur.java               ← table : utilisateur
    │   │   │   └── Role.java                      ← table : role
    │   │   │
    │   │   ├── dto/                               ← TRANSFERT DE DONNÉES
    │   │   │   ├── requetes/                      ← données reçues d'Angular
    │   │   │   │   ├── RequeteConnexion.java
    │   │   │   │   ├── RequeteAbonnement.java
    │   │   │   │   ├── RequeteVente.java
    │   │   │   │   └── RequeteChangementAbonne.java
    │   │   │   └── reponses/                      ← données renvoyées à Angular
    │   │   │       ├── ReponseConnexion.java       ← token JWT + infos user
    │   │   │       ├── ReponseAbonnement.java
    │   │   │       ├── ReponseRecapitulatif.java   ← taxes, kWh calculés
    │   │   │       ├── ReponseVente.java           ← token STS + reçu
    │   │   │       └── ReponseErreur.java
    │   │   │
    │   │   ├── depots/                            ← REPOSITORIES (accès BDD)
    │   │   │   ├── DepotAbonne.java
    │   │   │   ├── DepotAbonnement.java
    │   │   │   ├── DepotBranchement.java
    │   │   │   ├── DepotCompteur.java
    │   │   │   ├── DepotVente.java
    │   │   │   ├── DepotEncaissement.java
    │   │   │   ├── DepotTaxe.java
    │   │   │   ├── DepotGrilleTarifaire.java
    │   │   │   └── DepotUtilisateur.java
    │   │   │
    │   │   ├── services/                          ← LOGIQUE MÉTIER
    │   │   │   ├── ServiceAuthentification.java
    │   │   │   ├── ServiceAbonnement.java
    │   │   │   ├── ServiceVente.java              ← moteur calcul taxes + kWh
    │   │   │   ├── ServiceCompteur.java
    │   │   │   ├── ServiceNotification.java       ← envoi email + SMS reçu
    │   │   │   └── ServiceRapport.java
    │   │   │
    │   │   ├── controleurs/                       ← ENDPOINTS REST
    │   │   │   ├── ControleurAuthentification.java  ← POST /api/auth/connexion
    │   │   │   ├── ControleurAbonnement.java        ← /api/abonnements
    │   │   │   ├── ControleurVente.java             ← /api/ventes
    │   │   │   ├── ControleurCompteur.java          ← /api/compteurs
    │   │   │   └── ControleurRapport.java           ← /api/rapports
    │   │   │
    │   │   ├── securite/                          ← SÉCURITÉ JWT
    │   │   │   ├── FiltreJwt.java                 ← intercepte chaque requête
    │   │   │   ├── ServiceDetailsUtilisateur.java ← UserDetailsService Spring
    │   │   │   └── UtilitaireJwt.java             ← générer / valider JWT
    │   │   │
    │   │   └── exceptions/                        ← GESTION DES ERREURS
    │   │       ├── ExceptionMetier.java           ← erreur fonctionnelle
    │   │       └── GestionnaireExceptions.java    ← @ControllerAdvice global
    │   │
    │   └── resources/
    │       ├── application.properties             ← config BDD + JWT + mail
    │       └── data.sql                           ← données initiales (rôles, tarifs)
    │
    └── test/java/bf/sonabel/venkcash/
        ├── ServiceVenteTest.java                  ← tests calcul taxes + kWh
        └── ServiceAbonnementTest.java
```
---
🗄️ BASE DE DONNÉES — MySQL
```
venk_cash_db/
├── abonne               (id, nom, prenom, email, telephone, date_creation)
├── branchement          (id, code_branchement, adresse, statut)
├── compteur             (id, numero_serie, type_amperage, statut, date_installation)
├── grille_tarifaire     (id, type_amperage, cout_kwh, date_application)
├── taxe                 (id, libelle, valeur, type_calcul, id_grille)
├── abonnement           (id, date_debut, statut, id_abonne, id_branchement, id_compteur, id_grille)
├── vente                (id, montant_brut, montant_net, quantite_kwh, token_sts, date_vente, statut, id_abonnement, id_utilisateur)
├── encaissement         (id, montant_recu, monnaie_rendue, date_encaissement, id_vente)
├── role                 (id, libelle)                         ← CAISSIERE, CHEF_GUICHET, ADMIN
└── utilisateur          (id, nom, prenom, identifiant, mot_de_passe, id_role)
```
---
🔗 ROUTES ANGULAR
Route	Composant	Accès
`/connexion`	ConnexionComponent	Public
`/tableau-de-bord`	TableauDeBordComponent	Tous
`/abonnements`	ListeAbonnementsComponent	Chef + Admin
`/abonnements/nouveau`	FormulaireAbonnementComponent	Chef + Admin
`/ventes/nouveau`	FormulaireVenteComponent	Caissière + Chef + Admin
`/ventes/historique`	HistoriqueVentesComponent	Tous
`/compteurs`	ListeCompteursComponent	Admin
`/rapports/cloture`	ClotureCaisseComponent	Chef + Admin
`/rapports/consommations`	SuiviConsommationsComponent	Chef + Admin
---
🔗 ENDPOINTS REST SPRING BOOT
Méthode	URL	Action	Rôle
POST	`/api/auth/connexion`	Authentification	Public
GET	`/api/abonnements`	Liste abonnements	Chef + Admin
POST	`/api/abonnements`	Créer abonnement	Chef + Admin
PUT	`/api/abonnements/{id}/resilier`	Résilier	Chef + Admin
POST	`/api/ventes/precalculer`	Calcul taxes + kWh	Caissière+
POST	`/api/ventes`	Enregistrer vente	Caissière+
POST	`/api/ventes/{id}/annuler`	Annuler vente	Caissière+
GET	`/api/compteurs/disponibles`	Stock compteurs	Chef + Admin
GET	`/api/rapports/cloture`	Clôture caisse	Chef + Admin
---

```
