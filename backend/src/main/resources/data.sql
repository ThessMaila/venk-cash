-- =============================================
-- VENK-CASH | SONABEL - Donnees initiales de test
-- =============================================
-- Ce fichier est execute au demarrage de l'application
-- (spring.jpa.hibernate.ddl-auto=update chargera ces donnees)

-- Mot de passe par defaut : "sonabel123" encode avec BCrypt
INSERT IGNORE INTO utilisateurs (nom_utilisateur, mot_de_passe, email, nom, prenom, profil, actif, date_creation)
VALUES 
('admin', '$2a$10$5/YCOydmfHKnHQeT5kilTOFaFz7NPx1uqu1PfJo3IB5XXnT2d5XEu', 'admin@sonabel.bf', 'Administrateur', 'Systeme', 'ADMINISTRATEUR', TRUE, NOW()),
('chef', '$2a$10$5/YCOydmfHKnHQeT5kilTOFaFz7NPx1uqu1PfJo3IB5XXnT2d5XEu', 'chef@sonabel.bf', 'Ouattara', 'Ibrahim', 'CHEF_GUICHET', TRUE, NOW()),
('caissiere1', '$2a$10$5/YCOydmfHKnHQeT5kilTOFaFz7NPx1uqu1PfJo3IB5XXnT2d5XEu', 'caissiere1@sonabel.bf', 'Diallo', 'Aminata', 'CAISSIERE', TRUE, NOW()),
('caissiere2', '$2a$10$5/YCOydmfHKnHQeT5kilTOFaFz7NPx1uqu1PfJo3IB5XXnT2d5XEu', 'caissiere2@sonabel.bf', 'Zongo', 'Mariam', 'CAISSIERE', TRUE, NOW());

-- Tarifs
INSERT IGNORE INTO tarifs (libelle, puissance_amperes, cout_unitaire_kwh, actif)
VALUES 
('Abonnement 3 Ampères', 3, 75.50, TRUE),
('Abonnement 5 Ampères', 5, 82.25, TRUE);

-- Grille tarifaire (taxes et redevances)
INSERT IGNORE INTO grille_tarifaire (libelle_taxe, code_taxe, type, valeur, actif, description)
VALUES 
('Taxe municipale', 'TM', 'POURCENTAGE', 5.0000, TRUE, 'Taxe municipale de 5%'),
('Redevance compteur', 'RC', 'MONTANT_FIXE', 250.0000, TRUE, 'Redevance mensuelle de compteur'),
('Contribution au service universel', 'CSU', 'POURCENTAGE', 2.0000, TRUE, 'Contribution au service universel electrique'),
('Frais de facturation', 'FF', 'MONTANT_FIXE', 100.0000, TRUE, 'Frais de facturation et d''encaissement');

-- Branchements
INSERT IGNORE INTO branchements (code_branchement, adresse, quartier, ville, statut, date_creation)
VALUES 
('BR-001', 'Avenue Kwame Nkrumah, 45', 'Centre-ville', 'Ouagadougou', 'ACTIF', NOW()),
('BR-002', 'Rue de la Liberte, 12', 'Zone du bois', 'Ouagadougou', 'ACTIF', NOW()),
('BR-003', 'Boulevard de l''Independance, 78', 'Ouaga 2000', 'Ouagadougou', 'ACTIF', NOW()),
('BR-004', 'Rue du Marché, 23', 'Tampouy', 'Ouagadougou', 'ACTIF', NOW()),
('BR-005', 'Avenue Charles de Gaulle, 56', 'Koulouba', 'Bobo-Dioulasso', 'ACTIF', NOW());

-- Compteurs
INSERT IGNORE INTO compteurs (numero_compteur, numero_serie, statut, emplacement)
VALUES 
('CPT-0001', 'SER-2024-001', 'EN_STOCK', 'Magasin central'),
('CPT-0002', 'SER-2024-002', 'EN_STOCK', 'Magasin central'),
('CPT-0003', 'SER-2024-003', 'EN_STOCK', 'Magasin central'),
('CPT-0004', 'SER-2024-004', 'EN_STOCK', 'Magasin central'),
('CPT-0005', 'SER-2024-005', 'EN_STOCK', 'Magasin central'),
('CPT-0006', 'SER-2024-006', 'EN_STOCK', 'Magasin central'),
('CPT-0007', 'SER-2024-007', 'EN_STOCK', 'Magasin central'),
('CPT-0008', 'SER-2024-008', 'EN_STOCK', 'Magasin central'),
('CPT-0009', 'SER-2024-009', 'EN_STOCK', 'Magasin central'),
('CPT-0010', 'SER-2024-010', 'EN_STOCK', 'Magasin central');

-- Abonnes (deja installes) - verification d'existence pour eviter les doublons
INSERT INTO abonnes (nom, prenom, email, telephone, adresse, date_creation, actif)
SELECT 'Traore', 'Moussa', 'moussa.traore@email.bf', '70123456', 'Avenue Kwame Nkrumah, 45', NOW(), TRUE
WHERE NOT EXISTS (SELECT 1 FROM abonnes WHERE nom = 'Traore' AND prenom = 'Moussa');

INSERT INTO abonnes (nom, prenom, email, telephone, adresse, date_creation, actif)
SELECT 'Ouedraogo', 'Fatoumata', 'fatou.ouedraogo@email.bf', '70234567', 'Rue de la Liberte, 12', NOW(), TRUE
WHERE NOT EXISTS (SELECT 1 FROM abonnes WHERE nom = 'Ouedraogo' AND prenom = 'Fatoumata');

INSERT INTO abonnes (nom, prenom, email, telephone, adresse, date_creation, actif)
SELECT 'Sawadogo', 'Adama', 'adama.sawadogo@email.bf', '70345678', 'Boulevard de l''Independance, 78', NOW(), TRUE
WHERE NOT EXISTS (SELECT 1 FROM abonnes WHERE nom = 'Sawadogo' AND prenom = 'Adama');

-- Mettre a jour les compteurs pour les abonnements de test
UPDATE compteurs SET statut = 'ACTIF', emplacement = 'Installe chez Traore' WHERE numero_compteur = 'CPT-0004' AND statut = 'EN_STOCK';
UPDATE compteurs SET statut = 'ACTIF', emplacement = 'Installe chez Ouedraogo' WHERE numero_compteur = 'CPT-0005' AND statut = 'EN_STOCK';
UPDATE compteurs SET statut = 'ACTIF', emplacement = 'Installe chez Sawadogo' WHERE numero_compteur = 'CPT-0006' AND statut = 'EN_STOCK';

-- Abonnements (INSERT IGNORE pour eviter les doublons au redemarrage)
INSERT IGNORE INTO abonnements (numero_abonnement, abonne_id, branchement_id, compteur_id, tarif_id, statut, date_souscription, actif)
SELECT 'ABN-0001', a.id, b.id, c.id, t.id, 'ACTIF', NOW(), TRUE
FROM abonnes a, branchements b, compteurs c, tarifs t
WHERE a.nom = 'Traore' AND a.prenom = 'Moussa' AND b.code_branchement = 'BR-001' AND c.numero_compteur = 'CPT-0004' AND t.puissance_amperes = 3
LIMIT 1;

INSERT IGNORE INTO abonnements (numero_abonnement, abonne_id, branchement_id, compteur_id, tarif_id, statut, date_souscription, actif)
SELECT 'ABN-0002', a.id, b.id, c.id, t.id, 'ACTIF', NOW(), TRUE
FROM abonnes a, branchements b, compteurs c, tarifs t
WHERE a.nom = 'Ouedraogo' AND a.prenom = 'Fatoumata' AND b.code_branchement = 'BR-002' AND c.numero_compteur = 'CPT-0005' AND t.puissance_amperes = 3
LIMIT 1;

INSERT IGNORE INTO abonnements (numero_abonnement, abonne_id, branchement_id, compteur_id, tarif_id, statut, date_souscription, actif)
SELECT 'ABN-0003', a.id, b.id, c.id, t.id, 'ACTIF', NOW(), TRUE
FROM abonnes a, branchements b, compteurs c, tarifs t
WHERE a.nom = 'Sawadogo' AND a.prenom = 'Adama' AND b.code_branchement = 'BR-003' AND c.numero_compteur = 'CPT-0006' AND t.puissance_amperes = 5
LIMIT 1;
