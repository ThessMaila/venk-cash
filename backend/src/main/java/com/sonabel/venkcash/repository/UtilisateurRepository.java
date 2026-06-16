package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByNomUtilisateur(String nomUtilisateur);
    Optional<Utilisateur> findByEmail(String email);
    Boolean existsByNomUtilisateur(String nomUtilisateur);
}
