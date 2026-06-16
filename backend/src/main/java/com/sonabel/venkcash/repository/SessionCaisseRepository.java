package com.sonabel.venkcash.repository;

import com.sonabel.venkcash.entite.SessionCaisse;
import com.sonabel.venkcash.entite.SessionCaisse.StatutSession;
import com.sonabel.venkcash.entite.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SessionCaisseRepository extends JpaRepository<SessionCaisse, Long> {
    List<SessionCaisse> findByUtilisateurOrderByDateOuvertureDesc(Utilisateur utilisateur);
    Optional<SessionCaisse> findByUtilisateurAndStatut(Utilisateur utilisateur, StatutSession statut);
}
