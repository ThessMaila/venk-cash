package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AbonnementRepository extends JpaRepository<Abonnement, Long> {
    Optional<Abonnement> findByNumeroAbonnement(String numeroAbonnement);
    List<Abonnement> findByAbonne(Abonne abonne);
    List<Abonnement> findByBranchement(Branchement branchement);
    Optional<Abonnement> findByCompteurAndActifTrue(Compteur compteur);
    List<Abonnement> findByStatut(Abonnement.StatutAbonnement statut);
    List<Abonnement> findByActifTrue();
    Optional<Abonnement> findByCompteurNumeroCompteurAndActifTrue(String numeroCompteur);
    List<Abonnement> findByBranchementAndActifTrue(Branchement branchement);
    long countByActifTrue();
}
