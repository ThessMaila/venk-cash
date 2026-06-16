package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.Compteur;
import com.sonabel.venkcash.entite.Compteur.StatutCompteur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompteurRepository extends JpaRepository<Compteur, Long> {
    Optional<Compteur> findByNumeroCompteur(String numeroCompteur);
    List<Compteur> findByStatut(StatutCompteur statut);
    List<Compteur> findByNumeroSerieContaining(String numeroSerie);
    Boolean existsByNumeroCompteur(String numeroCompteur);
    long countByStatut(StatutCompteur statut);
}
