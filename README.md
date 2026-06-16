# VENK-CASH | SONABEL

Application de gestion des ventes de kWh et de suivi des consommations pour les compteurs de 3 et 5 Amperes a la SONABEL (Burkina Faso).

## Architecture

- **Frontend** : Angular 21 + PrimeNG + Template personnalise SONABEL (vert #00853F)
- **Backend** : Spring Boot 3.2 + Spring Security + JWT
- **Base de donnees** : MySQL 8+

## Fonctionnalites

### Module Vente (Caissiere, Chef de Guichet, Administrateur)
- Identification du client par numero de compteur
- Calcul automatique des taxes et redevances
- Generation du token STS pour recharge
- Impression et envoi du recu par email
- Historique des transactions

### Module Abonnement (Chef de Guichet, Administrateur)
- Creation d'abonnements (3A ou 5A)
- Changement de puissance (3A <-> 5A)
- Mutation d'abonne (changement de titulaire)
- Gestion des compteurs et branchements

### Module Caisse (Caissiere, Chef de Guichet)
- Ouverture/fermeture de session de caisse
- Recapitulatif des ventes
- Suivi du solde

### Module Statistiques (Chef de Guichet, Administrateur)
- Tableau de bord avec indicateurs
- Suivi des consommations
- Rapports de cloture

## Roles utilisateurs

| Role | Permissions |
|------|-------------|
| CAISSIERE | Vente, Historique, Caisse |
| CHEF_GUICHET | Caissiere + Abonnements, Compteurs, Rapports |
| ADMINISTRATEUR | Acces complet + Gestion utilisateurs |

## Prerequis

- Java 17+
- Node.js 20+
- MySQL 8+
- Maven (inclus via `mvnw`)

## Installation

### 1. Base de donnees

```sql
CREATE DATABASE venk_cash_db;
```

### 2. Configuration Backend

Modifier `backend/src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/venk_cash_db
spring.datasource.username=votre_utilisateur
spring.datasource.password=votre_mot_de_passe
```

### 3. Demarrage Backend

```bash
cd backend
.\mvnw spring-boot:run    # Windows
./mvnw spring-boot:run    # Linux/Mac
```

Le serveur demarre sur `http://localhost:8090`.

### 4. Demarrage Frontend

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
| caissiere1 | sonabel123 | Caissiere |
| caissiere2 | sonabel123 | Caissiere |

## Donnees de test pre-chargees

### Compteurs installes (pour tests de vente)
- **CPT-0004** - Traore Moussa (3A) - BR-001
- **CPT-0005** - Ouedraogo Fatoumata (3A) - BR-002
- **CPT-0006** - Sawadogo Adama (5A) - BR-003

### Compteurs en stock (pour nouveaux abonnements)
- CPT-0001 a CPT-0003, CPT-0007 a CPT-0010

### Branchements
- BR-001 a BR-005 (Ouagadougou et Bobo-Dioulasso)

### Grille tarifaire (taxes)
- Taxe municipale : 5%
- Redevance compteur : 250 FCFA
- Contribution service universel : 2%
- Frais de facturation : 100 FCFA

### Tarifs kWh
- 3 Amperes : 75,50 FCFA/kWh
- 5 Amperes : 82,25 FCFA/kWh

## Endpoints API Principaux

### Authentification
- `POST /api/auth/connexion` - Connexion

### Transactions
- `POST /api/transactions/pre-calcul` - Pre-calcul taxes/kWh
- `POST /api/transactions/effectuer` - Effectuer une vente
- `GET /api/transactions/recentes` - Transactions recentes
- `GET /api/transactions/{id}/pdf` - Telecharger recu PDF

### Abonnements
- `GET /api/abonnements` - Liste abonnements
- `POST /api/abonnements/souscription` - Nouvel abonnement
- `POST /api/abonnements/changement-puissance` - Changer puissance
- `POST /api/abonnements/mutation` - Muter abonne
- `GET /api/abonnements/compteur/{numero}` - Trouver par compteur

### Caisse
- `POST /api/sessions-caisse/ouverture` - Ouvrir session
- `POST /api/sessions-caisse/fermeture` - Fermer session
- `GET /api/sessions-caisse/recapitulatif` - Recapitulatif

## Structure du projet

```
venk-cash/
├── frontend/                    # Angular 21
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/          # Pages metier
│   │   │   │   ├── authentification/
│   │   │   │   ├── tableau-de-bord/
│   │   │   │   ├── abonnements/
│   │   │   │   ├── ventes/
│   │   │   │   ├── compteurs/
│   │   │   │   └── rapports/
│   │   │   ├── services/       # Services HTTP
│   │   │   ├── modeles/        # Interfaces TypeScript
│   │   │   ├── dto/            # DTOs
│   │   │   └── layout/         # Layout components
│   │   └── assets/
│   └── package.json
│
├── backend/                     # Spring Boot 3.2
│   └── src/main/java/com/sonabel/venkcash/
│       ├── entite/             # Entites JPA
│       ├── repository/         # Repositories
│       ├── service/            # Services metier
│       ├── controleur/         # Controllers REST
│       ├── dto/                # DTOs
│       └── security/           # Securite JWT
│
└── sonabel_logo.png            # Logo SONABEL
```

## Developpement

### Compiler le frontend
```bash
cd frontend
npm run build
```

### Compiler le backend
```bash
cd backend
./mvnw package
```

### Tests
```bash
# Backend
cd backend
./mvnw test

# Frontend
cd frontend
npm test
```

## Licence

Proprietaire - SONABEL Burkina Faso
